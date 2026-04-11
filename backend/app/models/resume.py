import json
from datetime import datetime
from app import db


class Resume(db.Model):
    __tablename__ = 'resumes'

    id = db.Column(db.Integer, primary_key=True)
    # Supabase user UUID (no FK — Supabase manages users, not our DB)
    user_id = db.Column(db.String(36), nullable=False, index=True)

    # Personal Info
    title = db.Column(db.String(200), default='My Resume')
    full_name = db.Column(db.String(100), default='')
    email = db.Column(db.String(120), default='')
    phone = db.Column(db.String(30), default='')
    location = db.Column(db.String(100), default='')
    linkedin = db.Column(db.String(200), default='')
    website = db.Column(db.String(200), default='')
    summary = db.Column(db.Text, default='')
    theme = db.Column(db.String(50), default='minimalist')
    score = db.Column(db.Integer, nullable=True)

    # Sections stored as JSON text
    experience = db.Column(db.Text, default='[]')
    education = db.Column(db.Text, default='[]')
    skills = db.Column(db.Text, default='[]')
    projects = db.Column(db.Text, default='[]')
    certifications = db.Column(db.Text, default='[]')

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'linkedin': self.linkedin,
            'website': self.website,
            'summary': self.summary,
            'theme': self.theme,
            'score': self.score,
            'experience': json.loads(self.experience or '[]'),
            'education': json.loads(self.education or '[]'),
            'skills': json.loads(self.skills or '[]'),
            'projects': json.loads(self.projects or '[]'),
            'certifications': json.loads(self.certifications or '[]'),
            'createdAt': self.created_at.strftime('%m/%d/%Y') if self.created_at else '',
            'updatedAt': self.updated_at.strftime('%m/%d/%Y') if self.updated_at else '',
        }

    @staticmethod
    def from_dict(data: dict, user_id: str):
        """Create a Resume instance from a dict. user_id is Supabase UUID string."""
        resume = Resume(user_id=user_id)
        resume.title = data.get('title', 'My Resume')
        resume.full_name = data.get('fullName', '')
        resume.email = data.get('email', '')
        resume.phone = data.get('phone', '')
        resume.location = data.get('location', '')
        resume.linkedin = data.get('linkedin', '')
        resume.website = data.get('website', '')
        resume.summary = data.get('summary', '')
        resume.theme = data.get('theme', 'minimalist')
        resume.score = data.get('score')
        resume.experience = json.dumps(data.get('experience', []))
        resume.education = json.dumps(data.get('education', []))
        resume.skills = json.dumps(data.get('skills', []))
        resume.projects = json.dumps(data.get('projects', []))
        resume.certifications = json.dumps(data.get('certifications', []))
        return resume
