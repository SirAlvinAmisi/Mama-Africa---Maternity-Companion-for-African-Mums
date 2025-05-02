from flask import Blueprint, request, jsonify
from models import db, User, Post, Article
from middleware.auth import role_required
from flask_jwt_extended import jwt_required, get_jwt
from flask_cors import cross_origin

admin_bp = Blueprint('admin', __name__)

# Get All Users
@admin_bp.route('/admin/users', methods=['GET'])
@role_required("admin")
def get_users():
    try:
        users = User.query.all()
        return jsonify({
            "users": [
                {
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
                } for user in users
            ]
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch users: {str(e)}"}), 500

# Toggle User Activation Status
@admin_bp.route('/admin/deactivate_user/<int:user_id>', methods=['PATCH'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@role_required("admin")
@jwt_required()
def toggle_user_status(user_id):
    try:
        user = User.query.get_or_404(user_id)
        user.is_active = not user.is_active
        db.session.commit()
        return jsonify({"message": f"User {'activated' if user.is_active else 'deactivated'}"})
    except Exception as e:
        return jsonify({"error": f"Failed to update user status: {str(e)}"}), 500

# Delete User
@admin_bp.route('/admin/delete_user/<int:user_id>', methods=['DELETE'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@role_required("admin")
@jwt_required()
def delete_user(user_id):
    try:
        print("🔍 DELETE /admin/delete_user/:id - JWT claims:", get_jwt())
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"})
    except Exception as e:
        return jsonify({"error": f"Failed to delete user: {str(e)}"}), 500

# Remove Post Content
@admin_bp.route('/admin/remove_content/<int:content_id>', methods=['DELETE'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@role_required("admin")
@jwt_required()
def remove_content(content_id):
    try:
        post = Post.query.get_or_404(content_id)
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Content removed"})
    except Exception as e:
        return jsonify({"error": f"Failed to remove content: {str(e)}"}), 500

# Approve Post Content
@admin_bp.route('/admin/approve_content/<int:content_id>', methods=['POST'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@role_required("admin")
@jwt_required()
def approve_content(content_id):
    try:
        post = Post.query.get_or_404(content_id)
        post.is_approved = True
        db.session.commit()
        return jsonify({"message": "Content approved"})
    except Exception as e:
        return jsonify({"error": f"Failed to approve content: {str(e)}"}), 500

# Approve Article
@admin_bp.route('/admin/approve_article/<int:article_id>', methods=['POST'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@role_required("admin")
@jwt_required()
def approve_article(article_id):
    try:
        article = Article.query.get_or_404(article_id)
        article.is_approved = True
        db.session.commit()
        return jsonify({"message": "Article approved"})
    except Exception as e:
        return jsonify({"error": f"Failed to approve article: {str(e)}"}), 500

# Manually Approve Health Professional (after license check)
@admin_bp.route('/admin/approve_healthpro/<int:user_id>', methods=['POST'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@role_required("admin")
@jwt_required()
def approve_health_pro(user_id):
    try:
        user = User.query.get_or_404(user_id)
        if user.role != 'health_pro' or not user.profile:
            return jsonify({"error": "Not a valid health professional"}), 400

        user.profile.is_verified = True
        db.session.commit()
        return jsonify({"message": "Health professional manually verified."})
    except Exception as e:
        return jsonify({"error": f"Failed to verify health pro: {str(e)}"}), 500
