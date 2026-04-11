import os
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai

api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print(hasattr(genai, 'upload_file'))
