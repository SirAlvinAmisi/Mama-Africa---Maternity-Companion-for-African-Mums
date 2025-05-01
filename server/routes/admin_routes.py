from flask import Blueprint, request, jsonify
from models import db, User, Post, Article
from middleware.auth import role_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['GET'])
@role_required("admin")
def get_users():
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
                    "full_name": user.profile.full_name if user.profile else "N/A"
                }
            } for user in users
        ]
    })

@admin_bp.route('/admin/deactivate_user/<int:user_id>', methods=['PATCH'])
@role_required("admin")
def deactivate_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    return jsonify({"message": "User deactivated"})

@admin_bp.route('/admin/delete_user/<int:user_id>', methods=['DELETE'])
@role_required("admin")
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})

@admin_bp.route('/admin/remove_content/<int:content_id>', methods=['DELETE'])
@role_required("admin")
def remove_content(content_id):
    post = Post.query.get_or_404(content_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Content removed"})

@admin_bp.route('/admin/approve_content/<int:content_id>', methods=['POST'])
@role_required("admin")
def approve_content(content_id):
    post = Post.query.get_or_404(content_id)
    post.is_approved = True
    db.session.commit()
    return jsonify({"message": "Content approved"})

@admin_bp.route('/admin/approve_article/<int:article_id>', methods=['POST'])
@role_required("admin")
def approve_article(article_id):
    article = Article.query.get_or_404(article_id)
    article.is_approved = True
    db.session.commit()
    return jsonify({"message": "Article approved"})