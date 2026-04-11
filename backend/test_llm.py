import os
from dotenv import load_dotenv
load_dotenv()

from app.services.llm_parser import parse_resume_with_llm

sample_text = ""

print(parse_resume_with_llm(sample_text))
