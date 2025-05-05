from flask import Blueprint, request, jsonify
from models import db, User, Post, Article, Community, VerificationRequest
from flask_jwt_extended import get_jwt, verify_jwt_in_request, jwt_required
from flask_cors import cross_origin
# from flask_jwt_extended import JWTDecodeError
from jwt.exceptions import DecodeError as JWTDecodeError
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import Unauthorized
import traceback
from middleware.auth import role_required
# from app import socketio

admin_bp = Blueprint('admin', __name__)

def is_admin():
    try:
        verify_jwt_in_request()
        claims = get_jwt()
        return claims.get("role", "").lower() == "admin"
    except (NoAuthorizationError, JWTDecodeError, Unauthorized):
        # You can log here if you like
        return False
# 🧾 Utility for preflight responses
def preflight_ok():
    return jsonify({"message": "Preflight OK"}), 200


# ✅ Get All Users
@admin_bp.route('/admin/users', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
def get_users():
    if request.method == 'OPTIONS':
        return preflight_ok()

    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    users = User.query.all()
    return jsonify({
        "users": [{
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "profile": {
                "full_name": user.profile.full_name if user.profile else "N/A",
                "region": user.profile.region if user.profile else "",
                "license_number": user.profile.license_number if user.profile else "",
                "is_verified": user.profile.is_verified if user.profile else False
            }
        } for user in users]
    })


# ✅ Deactivate or Activate User
@admin_bp.route('/admin/deactivate_user/<int:user_id>', methods=['PATCH', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
def toggle_user_status(user_id):
    if request.method == 'OPTIONS':
        return preflight_ok()

    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({"message": f"User {'activated' if user.is_active else 'deactivated'}"})

# ✅ Delete User
@admin_bp.route('/admin/delete_user/<int:user_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
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
        print("❌ DELETE USER ERROR:")
        traceback.print_exc()
        return jsonify({"error": "Server error", "details": str(e)}), 500
    
# ✅ Remove Content (Post)
@admin_bp.route('/admin/remove_content/<int:content_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
def remove_content(content_id):
    if request.method == 'OPTIONS':
        return preflight_ok()

    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    post = Post.query.get_or_404(content_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Content removed"})


# ✅ Approve Post Content
@admin_bp.route('/admin/approve_content/<int:content_id>', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
def approve_content(content_id):
    if request.method == 'OPTIONS':
        return preflight_ok()

    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    post = Post.query.get_or_404(content_id)
    post.is_approved = True
    db.session.commit()
    return jsonify({"message": "Content approved"})

@admin_bp.route('/admin/articles', methods=['GET', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"]
)
@jwt_required()
def list_all_articles():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    articles = Article.query.order_by(Article.created_at.desc()).all()
    return jsonify({"articles": [
        {
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "category": a.category,
            "created_at": a.created_at,
            "author_id": a.author_id,
            "is_approved": a.is_approved
        } for a in articles
    ]})


@admin_bp.route('/admin/articles/<int:id>', methods=['PATCH', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@jwt_required()
def update_article_status(id):
    data = request.get_json()
    action = data.get("status")

    article = Article.query.get_or_404(id)

    if action == "approved":
        article.is_approved = True
        db.session.commit()
        return jsonify({"message": "Article approved"})
    
    elif action == "rejected":
        db.session.delete(article)
        db.session.commit()
        return jsonify({"message": "Article rejected and deleted"})
    
    return jsonify({"error": "Invalid action"}), 400

# ✅ Approve Article
@admin_bp.route('/admin/approve_article/<int:article_id>', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
def approve_article(article_id):
    if request.method == 'OPTIONS':
        return preflight_ok()

    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    article = Article.query.get_or_404(article_id)
    article.is_approved = True
    db.session.commit()
    return jsonify({"message": "Article approved"})


# ✅ Approve Health Professional Manually
@admin_bp.route('/admin/approve_healthpro/<int:user_id>', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
def approve_health_pro(user_id):
    if request.method == 'OPTIONS':
        return preflight_ok()

    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    user = User.query.get_or_404(user_id)
    if user.role != 'health_pro' or not user.profile:
        return jsonify({"error": "Invalid health professional"}), 400

    user.profile.is_verified = True
    db.session.commit()
    return jsonify({"message": "Health professional verified"})

# ✅ Get All Posts
# @admin_bp.route('/admin/posts', methods=['GET', 'OPTIONS'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @jwt_required()
# def list_all_posts():
#     if request.method == 'OPTIONS':
#         return preflight_ok()

#     posts = Post.query.order_by(Post.created_at.desc()).all()
#     return jsonify({"posts": [
#         {
#             "id": p.id,
#             "title": p.title,
#             "content": p.content,
#             "media_url": p.media_url,
#             "created_at": p.created_at,
#             "author_id": p.author_id,
#             "community_id": p.community_id,
#             "is_approved": getattr(p, "is_approved", False)
#         } for p in posts
#     ]})
@admin_bp.route('/admin/posts', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_pending_posts():
    pending_posts = Post.query.filter(Post.is_approved == False).all()
    return jsonify({
        "posts": [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "is_approved": post.is_approved,
                "user": {
                    # "full_name": post.user.full_name if post.user else ""
                    "full_name": post.author.profile.full_name if post.author and post.author.profile else ""
                },
                "community": {
                    "name": post.community.name if post.community else ""
                }
            }
            for post in pending_posts
        ]
    })

@admin_bp.route('/admin/posts/<int:post_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def update_post_status(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json()
    status = data.get("status")

    if status == "approved":
        post.is_approved = True
    elif status == "rejected":
        post.is_approved = False
    else:
        return jsonify({"error": "Invalid status"}), 400

    db.session.commit()
    return jsonify({"message": f"Post {status} successfully"})

# # ✅ Approve or Reject Post
# @admin_bp.route('/admin/posts/<int:id>', methods=['PATCH'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @jwt_required()
# def update_post_status(id):
#     data = request.get_json()
#     action = data.get("status")

#     post = Post.query.get_or_404(id)
#     if action == "approved":
#         post.is_approved = True
#         db.session.commit()
#         return jsonify({"message": "Post approved"})
#     elif action == "rejected":
#         db.session.delete(post)
#         db.session.commit()
#         return jsonify({"message": "Post rejected and deleted"})
#     return jsonify({"error": "Invalid action"}), 400

# ✅ Get Pending Communities    
@admin_bp.route('/admin/communities/pending', methods=['GET', 'OPTIONS'])
@cross_origin(
    origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"]
)
@jwt_required()
def get_pending_communities():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    if not is_admin():
        return jsonify({"error": "Admin access only"}), 403

    pending = Community.query.filter_by(status="pending").all()
    return jsonify({
        "communities": [
            {
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "image": c.image,
                "member_count": c.member_count
            } for c in pending
        ]
    })

@admin_bp.route('/admin/verification-requests', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_verification_requests():
    requests = VerificationRequest.query.filter_by(is_resolved=False).all()
    return jsonify([
        {
            "id": req.id,
            "user_id": req.user.id,
            "full_name": req.user.profile.full_name,
            "license_number": req.user.profile.license_number,
            "region": req.user.profile.region
        } for req in requests
    ])

@admin_bp.route('/admin/verify-user/<int:user_id>', methods=['POST'])
@jwt_required()
@role_required("admin")
def verify_user(user_id):
    user = User.query.get(user_id)
    if not user or not user.profile:
        return jsonify({"error": "User not found"}), 404

    user.profile.is_verified = True

    # mark the verification request as resolved
    vr = VerificationRequest.query.filter_by(user_id=user_id, is_resolved=False).first()
    if vr:
        vr.is_resolved = True

    db.session.commit()
    return jsonify({"message": "User verified successfully."})
