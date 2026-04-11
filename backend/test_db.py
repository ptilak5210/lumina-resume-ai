import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models.resume import Resume

app = create_app()

with app.app_context():
    resumes = Resume.query.order_by(Resume.id.desc()).limit(1).all()
    for r in resumes:
        print(f"ID: {r.id}")
        print(f"Full Name: '{r.full_name}'")
        print(f"Email: '{r.email}'")
        print(f"Summary: '{r.summary}'")
        print(f"Experience: {r.experience}")
