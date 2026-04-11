from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
        
    new_user = User(name=data['name'], email=data['email'])
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(days=1))
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify(user.to_dict()), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        # Constructive ambiguity to prevent user enumeration
        return jsonify({'message': 'If an account exists for that email, we have sent a password reset link.'}), 200

    # Generate token
    import secrets
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    
    db.session.commit()

    # Send email
    from app.utils.email_utils import send_reset_email
    if send_reset_email(email, token):
        return jsonify({'message': 'If an account exists for that email, we have sent a password reset link.'}), 200
    else:
        return jsonify({'message': 'Failed to send email. Please try again later.'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({'message': 'Token and new password are required'}), 400

    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({'message': 'Invalid or expired token'}), 400

    if user.reset_token_expiry < datetime.datetime.utcnow():
        return jsonify({'message': 'Invalid or expired token'}), 400

    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.session.commit()

    return jsonify({'message': 'Password has been reset successfully'}), 200

@auth_bp.route('/social-login', methods=['POST'])
def social_login():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    provider = data.get('provider') # google or github
    
    if not email or not provider:
        return jsonify({'message': 'Email and provider are required'}), 400
        
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Create new user
        # Generate a random password since they use social login
        import secrets
        random_password = secrets.token_urlsafe(16)
        
        user = User(name=name or email.split('@')[0], email=email)
        user.set_password(random_password)
        
        db.session.add(user)
        db.session.commit()
        
    # Generate JWT
    access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(days=1))
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200
