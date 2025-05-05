from flask import Blueprint, request, jsonify
from models import db, User, Post, Article, Community, VerificationRequest, Notification
from flask_jwt_extended import get_jwt, verify_jwt_in_request, jwt_required
from flask_cors import cross_origin
from jwt.exceptions import DecodeError as JWTDecodeError
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import Unauthorized
from middleware.auth import role_required
from utils.email_utils import send_email
import traceback

admin_bp = Blueprint('admin', __name__)

def is_admin():
    try:
        verify_jwt_in_request()
        claims = get_jwt()
        return claims.get("role", "").lower() == "admin"
    except (NoAuthorizationError, JWTDecodeError, Unauthorized):
        return False

def preflight_ok():
    return jsonify({"message": "Preflight OK"}), 200

# ---------------------------- USERS ----------------------------

@admin_bp.route('/admin/users', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def get_users():
    if request.method == 'OPTIONS':
        return preflight_ok()
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    users = User.query.all()
    return jsonify({"users": [{
        "id": u.id, "email": u.email, "role": u.role, "is_active": u.is_active,
        "created_at": u.created_at,
        "profile": {
            "full_name": u.profile.full_name if u.profile else "N/A",
            "region": u.profile.region if u.profile else "",
            "license_number": u.profile.license_number if u.profile else "",
            "is_verified": u.profile.is_verified if u.profile else False
        }
    } for u in users]})

@admin_bp.route('/admin/deactivate_user/<int:user_id>', methods=['PATCH', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def toggle_user_status(user_id):
    if request.method == 'OPTIONS':
        return preflight_ok()
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({"message": f"User {'activated' if user.is_active else 'deactivated'}"})

@admin_bp.route('/admin/delete_user/<int:user_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def delete_user(user_id):
    if request.method == 'OPTIONS':
        return preflight_ok()
    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Server error", "details": str(e)}), 500

# ---------------------------- POSTS ----------------------------

@admin_bp.route('/admin/posts', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_pending_posts():
    posts = Post.query.filter(Post.is_approved == False).all()
    return jsonify({"posts": [{
        "id": p.id, "title": p.title, "content": p.content,
        "is_approved": p.is_approved,
        "user": {"full_name": p.author.profile.full_name if p.author and p.author.profile else ""},
        "community": {"name": p.community.name if p.community else ""}
    } for p in posts]})

@admin_bp.route('/admin/posts/<int:post_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def update_post_status(post_id):
    post = Post.query.get_or_404(post_id)
    status = request.get_json().get("status")

    if status == "approved":
        post.is_approved = True
    elif status == "rejected":
        db.session.delete(post)
    else:
        return jsonify({"error": "Invalid status"}), 400

    db.session.commit()
    return jsonify({"message": f"Post {status} successfully"})

# ---------------------------- ARTICLES ----------------------------

@admin_bp.route('/admin/articles', methods=['GET'])
@jwt_required()
@role_required("admin")
def list_all_articles():
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return jsonify({"articles": [{
        "id": a.id, "title": a.title, "category": a.category, "created_at": a.created_at,
        "author_id": a.author_id, "is_approved": a.is_approved
    } for a in articles]})

@admin_bp.route('/admin/articles/<int:id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def update_article_status(id):
    article = Article.query.get_or_404(id)
    status = request.get_json().get("status")

    if status == "approved":
        article.is_approved = True
    elif status == "rejected":
        db.session.delete(article)
    else:
        return jsonify({"error": "Invalid status"}), 400

    db.session.commit()
    return jsonify({"message": f"Article {status}"})

# ---------------------------- COMMUNITIES ----------------------------

@admin_bp.route('/admin/communities/pending', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_pending_communities():
    pending = Community.query.filter_by(status="pending").all()
    return jsonify({"communities": [{
        "id": c.id, "name": c.name, "description": c.description,
        "image": c.image, "member_count": c.member_count
    } for c in pending]})

# ---------------------------- VERIFICATION ----------------------------

@admin_bp.route('/admin/verification-requests', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_verification_requests():
    requests = VerificationRequest.query.filter_by(is_resolved=False).all()
    return jsonify([{
        "id": r.id,
        "user_id": r.user.id,
        "full_name": r.user.profile.full_name,
        "license_number": r.user.profile.license_number,
        "region": r.user.profile.region
    } for r in requests])

@admin_bp.route('/admin/verify-user/<int:user_id>', methods=['POST'])
@jwt_required()
@role_required("admin")
def verify_user(user_id):
    user = User.query.get(user_id)
    if not user or not user.profile:
        return jsonify({"error": "User not found"}), 404

    user.profile.is_verified = True

    request_record = VerificationRequest.query.filter_by(user_id=user_id, is_resolved=False).first()
    if request_record:
        request_record.is_resolved = True

    # 🔔 Notify user
    db.session.add(Notification(
        user_id=user.id,
        message="Your verification request has been approved.",
        link="/healthpro/dashboard"
    ))
    send_email(user.email, "Verification Approved", "You have been verified successfully.")

    db.session.commit()
    return jsonify({"message": "User verified"})

# ---------------------------- STATS ----------------------------

@admin_bp.route('/admin/stats', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_admin_stats():
    return jsonify({
        "total_users": User.query.count(),
        "total_articles": Article.query.count(),
        "approved_articles": Article.query.filter_by(is_approved=True).count(),
        "pending_posts": Post.query.filter_by(is_approved=False).count(),
        "pending_communities": Community.query.filter_by(status="pending").count(),
        "pending_verifications": VerificationRequest.query.filter_by(is_resolved=False).count()
    })
