# from flask import Blueprint, request, jsonify
# from models import db, User, Post, Article
# from middleware.auth import role_required
# from flask_jwt_extended import jwt_required, get_jwt
# from flask_cors import cross_origin

# admin_bp = Blueprint('admin', __name__)

# # Get All Users
# import traceback

# @admin_bp.route('/admin/users', methods=['GET'])
# @role_required("admin")
# def get_users():
#     try:
#         users = User.query.all()
#         return jsonify({
#             "users": [
#                 {
#                     "id": user.id,
#                     "email": user.email,
#                     "role": user.role,
#                     "is_active": user.is_active,
#                     "created_at": user.created_at,
#                     "profile": {
#                         "full_name": user.profile.full_name if user.profile else "N/A",
#                         "region": user.profile.region if user.profile else "",
#                         "license_number": user.profile.license_number if user.profile else "",
#                         "is_verified": user.profile.is_verified if user.profile else False
#                     }
#                 } for user in users
#             ]
#         })
#     except Exception as e:
#         print("🔴 ERROR fetching users:")
#         traceback.print_exc()
#         return jsonify({"error": f"Failed to fetch users: {str(e)}"}), 500

# # @admin_bp.route('/admin/users', methods=['GET'])
# # @role_required("admin")
# # def get_users():
# #     try:
# #         users = User.query.all()
# #         return jsonify({
# #             "users": [
# #                 {
# #                     "id": user.id,
# #                     "email": user.email,
# #                     "role": user.role,
# #                     "is_active": user.is_active,
# #                     "created_at": user.created_at,
# #                     "profile": {
# #                         "full_name": user.profile.full_name if user.profile else "N/A",
# #                         "region": user.profile.region if user.profile else "",
# #                         "license_number": user.profile.license_number if user.profile else "",
# #                         "is_verified": user.profile.is_verified if user.profile else False
# #                     }
# #                 } for user in users
# #             ]
# #         })
# #     except Exception as e:
# #         return jsonify({"error": f"Failed to fetch users: {str(e)}"}), 500

# # Toggle User Activation Status
# @admin_bp.route('/admin/deactivate_user/<int:user_id>', methods=['PATCH'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @role_required("admin")
# @jwt_required()
# def toggle_user_status(user_id):
#     try:
#         user = User.query.get_or_404(user_id)
#         user.is_active = not user.is_active
#         db.session.commit()
#         return jsonify({"message": f"User {'activated' if user.is_active else 'deactivated'}"})
#     except Exception as e:
#         return jsonify({"error": f"Failed to update user status: {str(e)}"}), 500

# # Delete User
# @admin_bp.route('/admin/delete_user/<int:user_id>', methods=['DELETE', 'OPTIONS'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @role_required("admin")
# @jwt_required()
# def delete_user(user_id):
#     try:
#         print("🔍 DELETE /admin/delete_user/:id - JWT claims:", get_jwt())
#         user = User.query.get_or_404(user_id)
#         db.session.delete(user)
#         db.session.commit()
#         return jsonify({"message": "User deleted"})
#     except Exception as e:
#         return jsonify({"error": f"Failed to delete user: {str(e)}"}), 500

# # Remove Post Content
# @admin_bp.route('/admin/remove_content/<int:content_id>', methods=['DELETE', 'OPTIONS'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @role_required("admin")
# @jwt_required()
# def remove_content(content_id):
#     try:
#         post = Post.query.get_or_404(content_id)
#         db.session.delete(post)
#         db.session.commit()
#         return jsonify({"message": "Content removed"})
#     except Exception as e:
#         return jsonify({"error": f"Failed to remove content: {str(e)}"}), 500

# # Approve Post Content
# @admin_bp.route('/admin/approve_content/<int:content_id>', methods=['POST'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @role_required("admin")
# @jwt_required()
# def approve_content(content_id):
#     try:
#         post = Post.query.get_or_404(content_id)
#         post.is_approved = True
#         db.session.commit()
#         return jsonify({"message": "Content approved"})
#     except Exception as e:
#         return jsonify({"error": f"Failed to approve content: {str(e)}"}), 500

# # Approve Article
# @admin_bp.route('/admin/approve_article/<int:article_id>', methods=['POST'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @role_required("admin")
# @jwt_required()
# def approve_article(article_id):
#     try:
#         article = Article.query.get_or_404(article_id)
#         article.is_approved = True
#         db.session.commit()
#         return jsonify({"message": "Article approved"})
#     except Exception as e:
#         return jsonify({"error": f"Failed to approve article: {str(e)}"}), 500

# # Manually Approve Health Professional (after license check)
# @admin_bp.route('/admin/approve_healthpro/<int:user_id>', methods=['POST'])
# @cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
# @role_required("admin")
# @jwt_required()
# def approve_health_pro(user_id):
#     try:
#         user = User.query.get_or_404(user_id)
#         if user.role != 'health_pro' or not user.profile:
#             return jsonify({"error": "Not a valid health professional"}), 400

#         user.profile.is_verified = True
#         db.session.commit()
#         return jsonify({"message": "Health professional manually verified."})
#     except Exception as e:
#         return jsonify({"error": f"Failed to verify health pro: {str(e)}"}), 500
from flask import Blueprint, request, jsonify
from models import db, User, Post, Article
from flask_jwt_extended import get_jwt, verify_jwt_in_request, jwt_required
from flask_cors import cross_origin
# from flask_jwt_extended import JWTDecodeError
from jwt.exceptions import DecodeError as JWTDecodeError
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import Unauthorized
import traceback

admin_bp = Blueprint('admin', __name__)

# def is_admin():
#     verify_jwt_in_request()
#     claims = get_jwt()
#     return claims.get("role", "").lower() == "admin"
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
# @admin_bp.route('/admin/delete_user/<int:user_id>', methods=['DELETE', 'OPTIONS'])
# @cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
# def delete_user(user_id):
#     if request.method == 'OPTIONS':
#         return preflight_ok()

#     if not is_admin():
#         return jsonify({"error": "Admin access only"}), 403

#     user = User.query.get_or_404(user_id)
#     db.session.delete(user)
#     db.session.commit()
#     return jsonify({"message": "User deleted"})

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

