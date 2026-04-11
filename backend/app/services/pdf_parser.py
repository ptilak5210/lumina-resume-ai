import io
import re
import json

from pdfminer.high_level import extract_text_to_fp
from pdfminer.layout import LAParams


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extract raw text from PDF bytes using pdfminer.six"""
    output = io.StringIO()
    with io.BytesIO(pdf_bytes) as pdf_io:
        extract_text_to_fp(pdf_io, output, laparams=LAParams())
    return output.getvalue()


# ── Field Extractors ────────────────────────────────────────────────────────

def _email(text):
    m = re.search(r'[\w.+%-]+@[\w-]+\.[a-zA-Z]{2,}', text)
    return m.group(0).lower() if m else ''

def _phone(text):
    m = re.search(r'(?:\+?\d{1,3}[\s\-.]?)?\(?\d{3,5}\)?[\s\-.]?\d{3,5}[\s\-.]?\d{3,5}', text)
    return m.group(0).strip() if m else ''

def _linkedin(text):
    m = re.search(r'linkedin\.com/in/[\w%-]+', text, re.I)
    return m.group(0) if m else ''

def _website(text):
    m = re.search(r'(?:https?://)?(?:github\.com/[\w.-]+|[\w-]+\.(?:dev|io|me)(?:/[\w.-]*)?)', text, re.I)
    if m and 'linkedin' not in m.group(0):
        return m.group(0)
    return ''

def _location(text):
    m = re.search(r'\b([A-Z][a-zA-Z\s]{2,20}),\s*([A-Z]{2}|[A-Z][a-zA-Z]{3,15})\b', text)
    return m.group(0).strip() if m else ''

def _name(lines):
    for line in lines[:6]:
        c = line.strip()
        if not c or len(c) < 3 or len(c) > 60: continue
        if '@' in c: continue
        if re.match(r'^[\+\d\s().\-]{7,}$', c): continue
        if re.search(r'https?://|www\.|linkedin|github', c, re.I): continue
        if re.search(r'resume|curriculum|cv\b|objective|summary|profile', c, re.I): continue
        if re.match(r'^[A-Za-z]+([\s][A-Za-z]+){1,3}$', c):
            return c
    return ''


# ── Section Splitter ────────────────────────────────────────────────────────

SECTION_RE = [
    ('summary',        re.compile(r'^(SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|CAREER OBJECTIVE|PROFILE|ABOUT ME|ABOUT)\s*$', re.I)),
    ('experience',     re.compile(r'^(EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|EMPLOYMENT HISTORY|WORK HISTORY|INTERNSHIP[S]?)\s*$', re.I)),
    ('education',      re.compile(r'^(EDUCATION|ACADEMIC BACKGROUND|EDUCATIONAL QUALIFICATIONS?|ACADEMICS|QUALIFICATION)\s*$', re.I)),
    ('skills',         re.compile(r'^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|KEY SKILLS|TECHNOLOGIES|TECH STACK|EXPERTISE|TOOLS)\s*$', re.I)),
    ('projects',       re.compile(r'^(PROJECTS|PERSONAL PROJECTS|PORTFOLIO|NOTABLE PROJECTS|ACADEMIC PROJECTS)\s*$', re.I)),
    ('certifications', re.compile(r'^(CERTIFICATIONS?|LICENSES?|CREDENTIALS|ACHIEVEMENTS?|AWARDS?|HONORS?)\s*$', re.I)),
]

def split_sections(text):
    lines = text.split('\n')
    sections = {'header': ''}
    current = 'header'
    for line in lines:
        t = line.strip()
        matched = False
        for key, pat in SECTION_RE:
            if pat.match(t):
                current = key
                sections.setdefault(current, '')
                matched = True
                break
        if not matched:
            sections[current] = sections.get(current, '') + line + '\n'
    return sections


# ── Section Parsers ─────────────────────────────────────────────────────────

DATE_RANGE = re.compile(
    r'([A-Za-z]+\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*([A-Za-z]+\.?\s+\d{4}|\d{4}|Present|Current|Now)',
    re.I
)

def parse_experience(text):
    if not text.strip():
        return []
    results = []
    blocks = [b.strip() for b in re.split(r'\n{2,}', text) if b.strip() and len(b.strip()) > 5]
    for i, block in enumerate(blocks):
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        start_date = end_date = company = position = ''
        desc_lines = []
        for line in lines:
            dm = DATE_RANGE.search(line)
            if dm:
                start_date = dm.group(1)
                end_date = dm.group(2)
                rest = line[:dm.start()].strip().strip('|-').strip()
                if rest and not company:
                    company = rest
                continue
            is_bullet = bool(re.match(r'^[•\-\*▪▸►✓]', line))
            if is_bullet or len(line) > 100:
                desc_lines.append(re.sub(r'^[•\-\*▪▸►✓]\s*', '', line))
            elif not position and len(line) < 80:
                position = line
            elif not company and len(line) < 80:
                company = line
            else:
                desc_lines.append(line)
        if position or company or start_date:
            results.append({
                'id': str(i + 1),
                'company': company,
                'position': position,
                'startDate': start_date,
                'endDate': end_date or 'Present',
                'description': '\n'.join(desc_lines),
            })
    return results


DEGREE_RE = re.compile(
    r'\b(B\.?Tech|BE|B\.?E|B\.?Sc|B\.?Com|B\.?A|B\.?S|M\.?Tech|ME|M\.?E|M\.?Sc|MBA|MCA|BCA|PhD|Ph\.?D|'
    r'Bachelor|Master|Associate|Diploma|Higher Secondary|10th|12th|SSC|HSC|Intermediate|Matriculation|SSLC)\b',
    re.I
)
YEAR_RE = re.compile(r'\b(19|20)\d{2}\b')

def parse_education(text):
    if not text.strip():
        return []
    results = []
    blocks = [b.strip() for b in re.split(r'\n{2,}', text) if b.strip() and len(b.strip()) > 3]
    for i, block in enumerate(blocks):
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        institution = degree = field = graduation_date = ''
        years = YEAR_RE.findall(block)
        if years:
            graduation_date = years[-1]
        for line in lines:
            dm = DEGREE_RE.search(line)
            if dm:
                degree = YEAR_RE.sub('', line).strip(' \t-–|')
                in_m = re.search(r'(?:in|of)\s+([A-Z][a-zA-Z\s]+)', line)
                if in_m:
                    field = in_m.group(1).strip()
            elif not institution and len(line) < 100 and not line[0].isdigit():
                institution = YEAR_RE.sub('', line).strip(' \t-–|')
            elif not field and len(line) < 60:
                field = YEAR_RE.sub('', line).strip()
        if institution or degree:
            results.append({'id': str(i+1), 'institution': institution, 'degree': degree, 'field': field, 'graduationDate': graduation_date})
    return results


def parse_skills(text):
    if not text.strip():
        return []
    cleaned = re.sub(r'[•\*▪▸►✓|]', ',', text)
    cleaned = cleaned.replace('\n', ',')
    skills = [s.strip() for s in cleaned.split(',')]
    skills = [s for s in skills if 2 <= len(s) <= 50 and not re.match(r'^\d+$', s) and not re.search(r'skills?', s, re.I)]
    return list(dict.fromkeys(skills))  # deduplicate preserving order


URL_RE = re.compile(r'https?://[\S]+|(?:github|gitlab)\.com/[\S]+', re.I)

def parse_projects(text):
    if not text.strip():
        return []
    results = []
    blocks = [b.strip() for b in re.split(r'\n{2,}', text) if b.strip() and len(b.strip()) > 5]
    for i, block in enumerate(blocks):
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        title = link = ''
        desc_lines = []
        for line in lines:
            um = URL_RE.search(line)
            if um:
                link = um.group(0)
                continue
            is_bullet = bool(re.match(r'^[•\-\*▪▸►✓]', line))
            if not title and not is_bullet and len(line) < 100:
                title = re.sub(r'^[•\-\*]\s*', '', line)
            else:
                desc_lines.append(re.sub(r'^[•\-\*▪▸►✓]\s*', '', line))
        if title:
            results.append({'id': str(i+1), 'title': title, 'description': '\n'.join(desc_lines), 'link': link})
    return results


def parse_certifications(text):
    if not text.strip():
        return []
    results = []
    lines = [l.strip() for l in text.split('\n') if l.strip() and len(l.strip()) > 4]
    for i, line in enumerate(lines):
        ym = YEAR_RE.search(line)
        name = YEAR_RE.sub('', line).strip(' \t-•*')
        if len(name) > 3:
            results.append({'id': str(i+1), 'name': name, 'issuer': '', 'date': ym.group(0) if ym else '', 'link': ''})
    return results


# ── Main Parse Function ─────────────────────────────────────────────────────

def parse_resume_from_pdf(pdf_bytes: bytes) -> dict:
    text = extract_text_from_pdf_bytes(pdf_bytes)
    if not text.strip():
        raise ValueError('Could not extract text from PDF. It may be scanned/image-only or password-protected.')

    sections = split_sections(text)
    all_lines = [l.strip() for l in text.split('\n') if l.strip()]
    header_text = sections.get('header', text[:400])

    return {
        'fullName':       _name(all_lines),
        'email':          _email(text),
        'phone':          _phone(text),
        'location':       _location(header_text),
        'linkedin':       _linkedin(text),
        'website':        _website(text),
        'summary':        sections.get('summary', '').strip()[:1000],
        'experience':     parse_experience(sections.get('experience', '')),
        'education':      parse_education(sections.get('education', '')),
        'skills':         parse_skills(sections.get('skills', '')),
        'projects':       parse_projects(sections.get('projects', '')),
        'certifications': parse_certifications(sections.get('certifications', '')),
    }
