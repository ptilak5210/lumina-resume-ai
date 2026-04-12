import os
import json
import re
import google.generativeai as genai
from flask import current_app

VISION_MODEL = 'gemini-2.5-flash'

def _load_api_keys() -> list:
    """Load all non-empty Gemini API keys from env (supports rotation)."""
    keys = []
    for i in range(1, 5):
        k = os.environ.get(f"GEMINI_API_KEY_{i}", "").strip()
        if k:
            keys.append(k)
    fallback = os.environ.get("GEMINI_API_KEY", "").strip()
    if fallback and fallback not in keys:
        keys.append(fallback)
    return keys

def configure_gemini():
    """Configure Gemini with the first available API key."""
    keys = _load_api_keys()
    if not keys:
        raise ValueError("No GEMINI_API_KEY set in environment.")
    genai.configure(api_key=keys[0])

import tempfile
import docx
import io

def parse_resume_with_gemini_vision(file_bytes: bytes, file_ext: str = ".pdf") -> dict:
    """Uses Google Gemini Multi-Modal API to parse document bytes directly (handles text & images)."""
    keys = _load_api_keys()
    if not keys:
        raise ValueError("No GEMINI_API_KEY set in environment.")

    model = genai.GenerativeModel(VISION_MODEL)
    
    raw_text = ""
    gemini_file = None
    tmp_path = None
    
    if file_ext == '.docx':
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            raw_text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            if not raw_text.strip():
                raise ValueError('Could not extract text from Word Document.')
        except Exception as e:
            raise ValueError(f'Failed to parse DOCX file: {e}')
    else:
        # Save bytes to a temporary file for Gemini File API with proper extension
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name
        # Upload the document to Gemini
        gemini_file = genai.upload_file(path=tmp_path, display_name="Resume_Upload")
        
    prompt = f"""You are a backend resume parsing engine in a production app.

You are NOT a chatbot.
You do NOT talk to users.
You do NOT ask for input.
You do NOT explain anything.

Your ONLY task is to convert the given resume document into structured JSON that directly matches a resume builder application's data model.

If you output anything other than valid JSON, the system will fail.

---------------------------------------

STRICT OUTPUT RULES:

- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- No comments
- No placeholders like "please provide data"

---------------------------------------

JSON SCHEMA (MUST FOLLOW EXACTLY):

{{
  "fullName": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "website": "",
  "summary": "",
  "experience": [
    {{
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }}
  ],
  "education": [
    {{
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": ""
    }}
  ],
  "skills": [],
  "projects": [
    {{
      "title": "",
      "description": "",
      "link": ""
    }}
  ],
  "certifications": [
    {{
      "name": "",
      "issuer": "",
      "date": "",
      "link": ""
    }}
  ]
}}

---------------------------------------

PARSING INTELLIGENCE RULES:

- Identify sections using meaning, not just headings
- "Experience" may appear as Work History, Employment
- "Education" may appear as Academic Background
- "Skills" may appear as Tech Stack, Tools, Competencies

- Skills: return clean array of keywords
- Projects: include actual projects
- Missing fields: use "" for strings, [] for arrays

---------------------------------------

FINAL BEHAVIOR RULE:

You MUST extract the data from the attached document and ALWAYS return structured JSON.
"""
    
    if raw_text:
        prompt += f"\n\nRESUME TEXT:\n{raw_text}"

    # ── Key Rotation: try each key on quota errors ────────────────────────────
    last_error = None
    text_response = None
    for idx, key in enumerate(keys):
        try:
            genai.configure(api_key=key)
            model = genai.GenerativeModel(VISION_MODEL)
            if raw_text:
                response = model.generate_content(prompt)
            else:
                response = model.generate_content([gemini_file, prompt])
            text_response = response.text
            break  # success — stop rotating
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower() or "ResourceExhausted" in type(e).__name__:
                print(f"[LLM] Key {idx+1}/{len(keys)} quota exhausted — rotating to next key...")
                last_error = e
                continue
            else:
                raise  # Non-quota error

    # Clean up Gemini file upload regardless of outcome
    if gemini_file:
        try:
            genai.delete_file(gemini_file.name)
        except Exception:
            pass

    if text_response is None:
        raise last_error or RuntimeError("All API keys exhausted their quota.")

    try:
        clean_json = text_response.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        elif clean_json.startswith("```"):
            clean_json = clean_json[3:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        clean_json = clean_json.strip()

        parsed_data = json.loads(clean_json)

        default_data = {
            "fullName": "", "experience": [], "education": [],
            "skills": [], "projects": [], "certifications": []
        }
        for key in default_data:
            if key not in parsed_data:
                parsed_data[key] = default_data[key]

        return parsed_data

    except json.JSONDecodeError as e:
        current_app.logger.error(f"Failed to decode JSON from LLM: {text_response}")
        raise ValueError("LLM returned malformed JSON.") from e
    except Exception as e:
        current_app.logger.error(f"Error calling LLM: {str(e)}")
        raise e
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
