from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.resume import Resume

from app.services.llm_parser import parse_resume_with_gemini_vision
from app.services.ats_analyzer import perform_ats_analysis
from app.services.supabase_auth import get_user_id_from_request, supabase_required
import json

resume_bp = Blueprint('resume', __name__)


# ── ATS Analysis ──────────────────────────────────────────────────────────────

@resume_bp.route('/analyze-ats', methods=['POST'])
@supabase_required
def analyze_ats():
    """Takes resume JSON → runs Gemini ATS analysis → returns structured result."""
    user_id = get_user_id_from_request()
    if not user_id:
        return jsonify({'message': 'Authentication required'}), 401

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No resume data provided'}), 400

    try:
        result = perform_ats_analysis(data)
        
        # Save to ats_scores permanently
        resume_id = data.get('id')
        if resume_id:
            try:
                from app.models.ats_score import AtsScore
                from app.models.resume import Resume
                # Convert string ID to int
                r_id_int = int(resume_id)
                score_record = AtsScore.query.filter_by(resume_id=r_id_int).first()
                if not score_record:
                    score_record = AtsScore(resume_id=r_id_int)
                    db.session.add(score_record)
                
                score_record.score = result.get('overallScore', 0)
                score_record.feedback = json.dumps(result)
                
                resume = Resume.query.filter_by(id=r_id_int, user_id=user_id).first()
                if resume:
                    resume.score = score_record.score
                
                db.session.commit()
            except Exception as dbe:
                db.session.rollback()
                current_app.logger.error(f'Failed to save ATS data to DB: {dbe}')

        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(f'ATS analysis error: {e}')
        return jsonify({'message': str(e)}), 500


# ── Parse PDF ────────────────────────────────────────────────────────────────

@resume_bp.route('/parse', methods=['POST'])
@supabase_required
def parse_resume():
    """Upload PDF → extract text → return structured resume data (not saved)."""
    user_id = get_user_id_from_request()
    if not user_id:
        return jsonify({'message': 'Authentication required'}), 401

    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

    file = request.files['file']
    filename = file.filename.lower()
    if not (filename.endswith('.pdf') or filename.endswith('.docx')):
        return jsonify({'message': 'Only PDF and .docx files are accepted'}), 400

    try:
        pdf_bytes = file.read()
        
        # Determine suffix to help Gemini API correctly detect MIME type locally
        ext = '.pdf'
        if filename.endswith('.docx'): ext = '.docx'
        
        # Gemini handles both standard PDFs and scanned images natively
        parsed = parse_resume_with_gemini_vision(pdf_bytes, file_ext=ext)
        return jsonify({'data': parsed}), 200
    except Exception as e:
        current_app.logger.error(f'PDF parse error: {e}')
        return jsonify({'message': str(e)}), 500


# ── Get all resumes ───────────────────────────────────────────────────────────

@resume_bp.route('/', methods=['GET'])
@supabase_required
def get_resumes():
    user_id = get_user_id_from_request()
    resumes = Resume.query.filter_by(user_id=user_id).order_by(Resume.updated_at.desc()).all()
    return jsonify([r.to_dict() for r in resumes]), 200


# ── Create resume ─────────────────────────────────────────────────────────────

@resume_bp.route('/', methods=['POST'])
@supabase_required
def create_resume():
    user_id = get_user_id_from_request()
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    resume = Resume.from_dict(data, user_id)
    db.session.add(resume)
    db.session.commit()
    return jsonify(resume.to_dict()), 201


# ── Update resume ─────────────────────────────────────────────────────────────

@resume_bp.route('/<int:resume_id>', methods=['PUT'])
@supabase_required
def update_resume(resume_id):
    user_id = get_user_id_from_request()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    resume.title = data.get('title', resume.title)
    resume.full_name = data.get('fullName', resume.full_name)
    resume.email = data.get('email', resume.email)
    resume.phone = data.get('phone', resume.phone)
    resume.location = data.get('location', resume.location)
    resume.linkedin = data.get('linkedin', resume.linkedin)
    resume.website = data.get('website', resume.website)
    resume.summary = data.get('summary', resume.summary)
    resume.theme = data.get('theme', resume.theme)
    resume.score = data.get('score', resume.score)
    resume.experience = json.dumps(data.get('experience', json.loads(resume.experience)))
    resume.education = json.dumps(data.get('education', json.loads(resume.education)))
    resume.skills = json.dumps(data.get('skills', json.loads(resume.skills)))
    resume.projects = json.dumps(data.get('projects', json.loads(resume.projects)))
    resume.certifications = json.dumps(data.get('certifications', json.loads(resume.certifications)))

    db.session.commit()
    return jsonify(resume.to_dict()), 200


# ── Delete resume ─────────────────────────────────────────────────────────────

@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
@supabase_required
def delete_resume(resume_id):
    user_id = get_user_id_from_request()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404

    db.session.delete(resume)
    db.session.commit()
    return jsonify({'message': 'Resume deleted'}), 200


# ── ATS Scores ────────────────────────────────────────────────────────────────

from app.models.ats_score import AtsScore

@resume_bp.route('/<int:resume_id>/ats-scores', methods=['GET', 'POST'])
@supabase_required
def manage_ats_scores(resume_id):
    user_id = get_user_id_from_request()
    
    # Ensure resume belongs to user
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    if not resume:
        return jsonify({'message': 'Resume not found'}), 404

    if request.method == 'GET':
        scores = AtsScore.query.filter_by(resume_id=resume_id).order_by(AtsScore.created_at.desc()).all()
        return jsonify([s.to_dict() for s in scores]), 200

    if request.method == 'POST':
        data = request.get_json()
        score = data.get('score')
        feedback = data.get('feedback')
        
        if score is None:
            return jsonify({'message': 'Score is required'}), 400
            
        ats_record = AtsScore(resume_id=resume_id, score=score, feedback=json.dumps(feedback) if feedback else None)
        db.session.add(ats_record)
        
        # Optionally update the latest score on the resume itself
        resume.score = score
        db.session.commit()
        
        return jsonify(ats_record.to_dict()), 201


# ── Subscriptions ─────────────────────────────────────────────────────────────

from app.models.subscription import Subscription

@resume_bp.route('/subscription', methods=['GET'])
@supabase_required
def get_subscription():
    user_id = get_user_id_from_request()
    
    sub = Subscription.query.filter_by(user_id=user_id).first()
    if not sub:
        # Auto-create free subscription for new users
        sub = Subscription(user_id=user_id, plan='free', status='active')
        db.session.add(sub)
        db.session.commit()

    return jsonify(sub.to_dict()), 200
