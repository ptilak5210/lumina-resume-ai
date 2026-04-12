import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()

from app import create_app
from app.models.resume import Resume

app = create_app()

with app.app_context():
    resumes = Resume.query.order_by(Resume.id.desc()).all()
    print(f"Total resumes: {len(resumes)}")
    for r in resumes:
        d = r.to_dict()
        exp = d['experience']
        skills = d['skills']
        print(f"\nID={d['id']}: '{d['fullName']}' | skills={len(skills)} | exp={len(exp)}")
        print(f"  email='{d['email']}' phone='{d['phone']}'")
        if exp:
            print(f"  exp[0] company='{exp[0].get('company')}' position='{exp[0].get('position')}'")
        if skills:
            print(f"  skills[:5]={skills[:5]}")
