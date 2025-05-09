from flask import Blueprint, request, jsonify
from models import db, User, Post, Article, Community, VerificationRequest, Notification, Profile
from flask_jwt_extended import get_jwt, verify_jwt_in_request, jwt_required
from flask_cors import cross_origin
from flask_cors import CORS
from jwt.exceptions import ExpiredSignatureError
from jwt.exceptions import DecodeError as JWTDecodeError
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import Unauthorized
from middleware.auth import role_required
from utils.email_utils import send_email
from datetime import datetime

admin_bp = Blueprint('admin', __name__)
CORS(admin_bp, origins=["http://localhost:5173"], supports_credentials=True)

# Middleware to check if the user is an admin
@admin_bp.before_request
def check_admin():
    if request.method == 'OPTIONS':
        return preflight_ok()
        
    try:
        verify_jwt_in_request()
        claims = get_jwt()
        
        # More robust role checking
        user_role = claims.get("role", "").lower()
        if user_role != "admin":
            return jsonify({
                "error": "Admin access only",
                "required_role": "admin",
                "your_role": user_role
            }), 403
    except Exception as e:
        return jsonify({"error": f"Authorization failed: {str(e)}"}), 401

def preflight_ok():
    return jsonify({"message": "Preflight OK"}), 200

# ---------------------------- USERS ----------------------------

@admin_bp.route('/admin/users', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def get_users():
    if request.method == 'OPTIONS':
        return preflight_ok()

    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({"users": [{
        "id": u.id, 
        "email": u.email, 
        "role": u.role, 
        "is_active": u.is_active,
        "created_at": u.created_at.isoformat() if u.created_at else None,
        "profile": {
            "full_name": u.profile.full_name if u.profile else "N/A",
            "region": u.profile.region if u.profile else "",
            "license_number": u.profile.license_number if u.profile else "",
            "is_verified": u.profile.is_verified if u.profile else False
        }
    } for u in users]})

# Fix the add_user endpoint
@admin_bp.route('/admin/add_user', methods=['POST'])
@jwt_required()
@role_required("admin")
def add_user():
    data = request.get_json()
    
    # Required fields validation
    required_fields = ['email', 'role', 'full_name']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400

    # Check for existing user
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User with this email already exists"}), 400

    try:
        # Create user
        new_user = User(
            email=data['email'],
            role=data['role'],
            is_active=True,
            created_at=datetime.utcnow()
        )
        new_user.set_password("TempPassword123!")  # Set default password
        db.session.add(new_user)

        # Create profile
        profile = Profile(
            user=new_user,
            full_name=data['full_name'],
            region=data.get('region', ''),
            license_number=data.get('license_number', ''),
            is_verified=data.get('is_verified', False)
        )
        db.session.add(profile)
        
        db.session.commit()

        return jsonify({
            "message": "User created successfully",
            "user_id": new_user.id,
            "profile_id": profile.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/admin/verify-user/<int:user_id>', methods=['POST'])
@jwt_required()
@role_required("admin")
def verify_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    if not user.profile:
        profile = Profile(
            user_id=user_id,
            full_name="",
            is_verified=True
        )
        db.session.add(profile)
    else:
        user.profile.is_verified = True

    # Mark verification requests as resolved
    VerificationRequest.query.filter_by(user_id=user_id, is_resolved=False).update({'is_resolved': True})

    # Create notification
    db.session.add(Notification(
        user_id=user.id,
        message="Your account has been verified by an administrator.",
        link="/profile"
    ))

    db.session.commit()
    return jsonify({"message": "User verified successfully"})

# Add missing notifications endpoint
@admin_bp.route('/admin/notifications', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_admin_notifications():
    try:
        # Get unverified health professionals
        health_pros = User.query.filter_by(role='health_pro', is_validated=False).all()
        
        # Get pending articles
        pending_articles = Article.query.filter_by(is_approved=False).all()
        
        # Format response
        notifications = []
        
        for user in health_pros:
            notifications.append({
                "type": "health_pro_verification",
                "message": f"Health professional {user.email} needs verification",
                "user_id": user.id
            })
            
        for article in pending_articles:
            notifications.append({
                "type": "article_approval",
                "message": f"Article '{article.title}' needs approval",
                "article_id": article.id
            })
            
        return jsonify({"notifications": notifications})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
