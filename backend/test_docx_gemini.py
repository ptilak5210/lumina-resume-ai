import os
import tempfile
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai

api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
    tmp.write(b"Hello World")
    tmp_path = tmp.name

try:
    f = genai.upload_file(path=tmp_path)
    print("Success Upload:", f.mime_type)
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    res = model.generate_content([f, "Extract text"])
    print("Success Generate:", res.text)
    
    genai.delete_file(f.name)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    os.remove(tmp_path)
