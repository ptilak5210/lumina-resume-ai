import os
import json
import google.generativeai as genai

# ── KEY ROTATION POOL ─────────────────────────────────────────────────────────
def _load_api_keys() -> list[str]:
    """Load all non-empty Gemini API keys from env in priority order."""
    keys = []
    for i in range(1, 5):
        k = os.environ.get(f"GEMINI_API_KEY_{i}", "").strip()
        if k:
            keys.append(k)
    fallback = os.environ.get("GEMINI_API_KEY", "").strip()
    if fallback and fallback not in keys:
        keys.append(fallback)
    return keys


ATS_MODEL = 'gemini-2.5-flash'


def _call_with_rotation(prompt: str) -> str:
    """Try each API key in order; rotate on 429 quota errors."""
    keys = _load_api_keys()
    if not keys:
        raise ValueError("No GEMINI_API_KEY set in environment.")

    last_error = None
    for idx, key in enumerate(keys):
        try:
            genai.configure(api_key=key)
            model = genai.GenerativeModel(ATS_MODEL)
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            raw = response.text.strip()
            # Strip markdown code fences if present
            if raw.startswith("```json"):
                raw = raw[7:]
            elif raw.startswith("```"):
                raw = raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            return raw.strip()

        except Exception as e:
            err_str = str(e)
            # Only rotate on quota/rate-limit errors
            if "429" in err_str or "quota" in err_str.lower() or "ResourceExhausted" in type(e).__name__:
                print(f"[ATS] Key {idx+1}/{len(keys)} quota exhausted — rotating to next key...")
                last_error = e
                continue
            else:
                raise  # Non-quota error — raise immediately

    raise last_error or RuntimeError("All API keys exhausted their quota.")


def perform_ats_analysis(resume_data: dict) -> dict:
    """Run ATS analysis using Gemini with automatic key rotation on quota errors."""
    exp  = resume_data.get('experience', [])
    edu  = resume_data.get('education', [])
    skills = resume_data.get('skills', [])
    projects = resume_data.get('projects', [])
    certs = resume_data.get('certifications', [])

    resume_text = f"""
Name: {resume_data.get('fullName', '')}
Email: {resume_data.get('email', '')}
Phone: {resume_data.get('phone', '')}
LinkedIn: {resume_data.get('linkedin', '')}
Website: {resume_data.get('website', '')}
Location: {resume_data.get('location', '')}

SUMMARY:
{resume_data.get('summary', '')}

EXPERIENCE ({len(exp)} entries):
{chr(10).join(
    f"- {e.get('position')} at {e.get('company')} ({e.get('startDate')} - {e.get('endDate')}): {str(e.get('description',''))[:200]}"
    for e in exp
)}

EDUCATION ({len(edu)} entries):
{chr(10).join(
    f"- {e.get('degree')} in {e.get('field')} from {e.get('institution')} ({e.get('graduationDate')})"
    for e in edu
)}

SKILLS ({len(skills)}):
{', '.join(skills)}

PROJECTS ({len(projects)}):
{chr(10).join(f"- {p.get('title')}: {str(p.get('description',''))[:100]}" for p in projects)}

CERTIFICATIONS ({len(certs)}):
{chr(10).join(f"- {c.get('name')} from {c.get('issuer')}" for c in certs)}
""".strip()

    prompt = f"""You are a world-class ATS expert and resume coach. Analyze this resume and return ONLY valid JSON.

RESUME:
{resume_text}

SCORING (0-100 for each):
- completeness: name+email+phone+linkedin+summary+experience+skills+education all present?
- summary: present, 3+ sentences, keyword-rich?
- experience: quantified achievements with numbers/%, multiple entries, clear titles?
- skills: 8+ relevant industry-standard keywords?
- education: institution, degree, field, graduation date all present?
- overallScore: weighted average (completeness*0.10 + summary*0.15 + experience*0.25 + skills*0.20 + education*0.10 + 10 if projects exist + 10 if certs exist, max 100)

Suggestions — write as a friendly career coach using "you", be specific:
Example: "Your summary is strong but adding your key specialization can help recruiters shortlist you faster!"

MISSING KEYWORDS: 8-12 in-demand keywords for this person's field they should add.
PRESENT KEYWORDS: actual skills/tools found in the resume.
STRENGTHS: 2-4 specific genuine strengths written naturally.

Return this EXACT JSON:
{{
  "overallScore": 0,
  "sectionScores": {{
    "completeness": 0,
    "summary": 0,
    "experience": 0,
    "skills": 0,
    "education": 0
  }},
  "missingKeywords": [],
  "presentKeywords": [],
  "suggestions": [
    {{
      "title": "",
      "detail": "",
      "impact": "high",
      "section": ""
    }}
  ],
  "strengths": []
}}"""

    raw = _call_with_rotation(prompt)
    return json.loads(raw)
