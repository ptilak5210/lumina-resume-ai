import os
from dotenv import load_dotenv
load_dotenv()

from app.services.ats_analyzer import perform_ats_analysis

sample = {
    "fullName": "Tilak Patel",
    "email": "ptilak5210@gmail.com",
    "phone": "+91 7490961147",
    "summary": "Full-stack Python developer with 2 years of experience building web applications.",
    "experience": [
        {"company": "Vedanco IT Solution", "position": "Python Developer", "startDate": "Oct 2023", "endDate": "Present", "description": "Built REST APIs and integrated AI models."}
    ],
    "education": [{"institution": "Gujarat Tech", "degree": "BE", "field": "Computer Engineering", "graduationDate": "2023"}],
    "skills": ["Python", "Flask", "React", "PostgreSQL", "Docker"],
    "projects": [{"title": "AI Resume Analyzer", "description": "Built an AI-powered resume analyzer using Gemini"}],
    "certifications": []
}

result = perform_ats_analysis(sample)
print("Overall Score:", result.get("overallScore"))
print("Section Scores:", result.get("sectionScores"))
print("Missing Keywords:", result.get("missingKeywords", [])[:5])
print("Strengths:", result.get("strengths", []))
print("Suggestions count:", len(result.get("suggestions", [])))
