import os
import json
import google.generativeai as genai
from flask import current_app


def configure_gemini():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not set in the environment.")
    genai.configure(api_key=api_key)


ATS_MODEL = 'gemini-2.0-flash'


def perform_ats_analysis(resume_data: dict) -> dict:
    """Uses Gemini 2.5 Flash to perform deep ATS analysis on a resume dict.
    Returns structured ATSResult matching the frontend ATSResult interface."""
    configure_gemini()
    model = genai.GenerativeModel(ATS_MODEL)

    exp = resume_data.get('experience', [])
    edu = resume_data.get('education', [])
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
{chr(10).join(f"- {e.get('position')} at {e.get('company')} ({e.get('startDate')} - {e.get('endDate')}): {e.get('description','')[:200]}" for e in exp)}

EDUCATION ({len(edu)} entries):
{chr(10).join(f"- {e.get('degree')} in {e.get('field')} from {e.get('institution')} ({e.get('graduationDate')})" for e in edu)}

SKILLS ({len(skills)}):
{', '.join(skills)}

PROJECTS ({len(projects)}):
{chr(10).join(f"- {p.get('title')}: {p.get('description','')[:100]}" for p in projects)}

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
- overallScore: weighted average (completeness*0.10 + summary*0.15 + experience*0.25 + skills*0.20 + education*0.10 + 10 if projects exist + 10 if certs exist)

Suggestions — write as a friendly career coach using "you", be specific:
Example: "Your summary is strong but only has 2 lines — a 3rd line mentioning your specialization can help recruiters shortlist you faster!"

MISSING KEYWORDS: 8-12 in-demand keywords for this person's field they should add.
PRESENT KEYWORDS: actual skills/tools found in the resume.
STRENGTHS: 2-4 specific genuine strengths written naturally.

Return this exact JSON structure:
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
      "impact": "high|medium|low",
      "section": ""
    }}
  ],
  "strengths": []
}}"""

    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json"
        )
    )

    raw = response.text.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    elif raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]

    result = json.loads(raw.strip())
    return result
