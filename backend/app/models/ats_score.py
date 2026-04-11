from datetime import datetime
from app import db

class AtsScore(db.Model):
    __tablename__ = 'ats_scores'

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False, index=True)
    score = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text, nullable=True) # Storing JSON or plain text feedback
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to Resume
    resume = db.relationship('Resume', backref=db.backref('ats_history', lazy=True, cascade='all, delete-orphan'))

    def to_dict(self):
        return {
            'id': self.id,
            'resume_id': self.resume_id,
            'score': self.score,
            'feedback': self.feedback,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
