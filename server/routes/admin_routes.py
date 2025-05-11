# server/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from models import db, User, Post, Article, Community, VerificationRequest, Notification, Profile, Comment, FlagReport
from flask_jwt_extended import get_jwt, verify_jwt_in_request, jwt_required
from flask_cors import cross_origin, CORS
from jwt.exceptions import ExpiredSignatureError
from jwt.exceptions import DecodeError as JWTDecodeError
from flask_jwt_extended.exceptions import NoAuthorizationError
from utils.notification_utils import create_and_emit_notification
from werkzeug.exceptions import Unauthorized
from middleware.auth import role_required
from utils.email_utils import send_email
from datetime import datetime

admin_bp = Blueprint('admin', __name__)
# CORS(admin_bp, origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
CORS(admin_bp, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5000",
    "http://127.0.0.1:5000"
], supports_credentials=True)


# ====Middleware to check if the user is an admin============
@admin_bp.before_request
def check_admin():
    if request.method == 'OPTIONS':
        return preflight_ok()

    try:
        verify_jwt_in_request()
        claims = get_jwt()
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

# ----------------------------View USERS ----------------------------
@admin_bp.route('/admin/users', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
def get_users():
    if request.method == 'OPTIONS':
        return preflight_ok()

    users = User.query.order_by(User.created_at.desc()).all()
    filtered_users = []
    
    for u in users:
        filtered_users.append(u)

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
    } for u in filtered_users]})


# ----------------------------Add USERS ----------------------------
@admin_bp.route('/admin/add_user', methods=['POST'])
@jwt_required()
@role_required("admin")
def add_user():
    data = request.get_json()
    required_fields = ['email', 'role', 'full_name']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing required fields: {', '.join(required_fields)}"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User with this email already exists"}), 400

    try:
        new_user = User(
            email=data['email'],
            role=data['role'],
            is_active=True,
            created_at=datetime.utcnow()
        )
        new_user.set_password("TempPassword123!")
        db.session.add(new_user)

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

# ----------------------------Verify USERS ----------------------------
@admin_bp.route('/admin/verify-user/<int:user_id>', methods=['POST'])
@jwt_required()
@role_required("admin")
def verify_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.profile:
        profile = Profile(user_id=user_id, full_name="", is_verified=True)
        db.session.add(profile)
    else:
        user.profile.is_verified = True

    VerificationRequest.query.filter_by(user_id=user_id, is_resolved=False).update({'is_resolved': True})

    # Real-time notification via SocketIO
    create_and_emit_notification(
        user_id=user.id,
        message="✅ You have been verified as a Health Professional.",
        link="/healthpro/dashboard",
        room=f"user_{user.id}"
    )

    # Fallback notification
    db.session.add(Notification(
        user_id=user.id,
        message="Your account has been verified by an administrator.",
        link="/healthpro/dashboard"
    ))

    db.session.commit()
    return jsonify({"message": "User verified successfully"})

# ----------------------------Approve USERS ----------------------------
@admin_bp.route('/admin/approve_healthpro/<int:user_id>', methods=['POST'])
@jwt_required()
@role_required('admin')
def approve_health_pro(user_id):
    user = User.query.get_or_404(user_id)

    if user.role != 'health_pro' or not user.profile:
        return jsonify({"error": "Invalid health professional"}), 400

    user.profile.is_verified = True

    # Real-time notification via SocketIO
    create_and_emit_notification(
        user_id=user.id,
        message="✅ You have been verified as a Health Professional.",
        link="/healthpro/dashboard",
        room=f"user_{user.id}"
    )

    # Fallback notification
    db.session.add(Notification(
        user_id=user.id,
        message="Your account has been verified by an administrator.",
        link="/healthpro/dashboard"
    ))

    db.session.commit()
    return jsonify({"message": f"{user.profile.full_name} verified successfully"}), 200



# ----------------------------Promote USERS to admin----------------------------
@admin_bp.route('/admin/promote/<int:user_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def promote_user_to_admin(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.role = "admin"
    db.session.commit()

    return jsonify({"message": f"User {user.email} promoted to admin"}), 200

# ----------------------------Deactivate/delete USERS ----------------------------
@admin_bp.route('/admin/deactivate/<int:user_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def deactivate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_active = False
    db.session.commit()

    return jsonify({"message": f"User {user.email} deactivated"}), 200


@admin_bp.route('/admin/activate/<int:user_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def activate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.is_active = True
    db.session.commit()

    return jsonify({"message": f"User {user.email} activated"}), 200

# ---------------------------- NOTIFICATIONS ----------------------------
@admin_bp.route('/admin/notifications', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_admin_notifications():
    try:
        health_pros = User.query.filter_by(role='health_pro', is_validated=False).all()
        pending_articles = Article.query.filter_by(is_approved=False).all()

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


# ---------------------------- FLAGGED POSTS REVIEW ----------------------------
@admin_bp.route('/admin/posts/<int:post_id>', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_single_post(post_id):
    post = Post.query.get_or_404(post_id)
    if not post:
        print(f"🚫 Post ID {post_id} not found in DB.")
        return jsonify({"error": "Post not found"}), 404
    return jsonify({
        "post": {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "status": "flagged" if post.is_flagged else "approved" if post.is_approved else "pending",
            "media_url": post.media_url,
            "media_type": post.media_type,
            "created_at": post.created_at.isoformat(),
            "violation_reason": post.violation_reason,
            "user": {
                "id": post.author.id if post.author else None,
                "full_name": post.author.profile.full_name if post.author and post.author.profile else "Anonymous"
            },
            "community": {
                "id": post.community.id if post.community else None,
                "name": post.community.name if post.community else "Unknown"
            }
        }
    }), 200

@admin_bp.route('/admin/posts', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_flagged_posts():
    try:
        flagged_posts = Post.query.filter_by(is_flagged=True).order_by(Post.created_at.desc()).all()

        return jsonify({
            "posts": [{
                "id": p.id,
                "title": p.title,
                "content": p.content,
                "media_url": p.media_url,
                "media_type": p.media_type,
                "created_at": p.created_at.isoformat(),
                "violation_reason": p.violation_reason,
                "community": {
                    "id": p.community.id if p.community else None,
                    "name": p.community.name if p.community else "Unknown"
                },
                "user": {
                    "id": p.author.id if p.author else None,
                    "full_name": p.author.profile.full_name if p.author and p.author.profile else "Anonymous"
                }
            } for p in flagged_posts]
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch flagged posts: {str(e)}"}), 500

@admin_bp.route('/admin/posts/<int:post_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def update_post_status(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        data = request.get_json()
        status = data.get("status")

        if status == "approved":
            post.is_flagged = False
            post.is_approved = True
            post.violation_reason = None
        elif status == "rejected":
            db.session.add(Notification(
                user_id=post.author_id,
                message=f"Your post titled '{post.title[:40]}' was removed due to: {post.violation_reason or 'policy violation'}",
                link="/my-posts" 
        ))
            db.session.delete(post)
        else:
            return jsonify({"error": "Invalid status. Use 'approved' or 'rejected'."}), 400

        db.session.commit()
        return jsonify({"message": f"Post {status} successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update post: {str(e)}"}), 500


# ----------------------------Create Category----------------------------
@admin_bp.route('/admin/create_category', methods=['POST'])
@jwt_required()
@role_required("admin")
def create_category():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Category name required"}), 400

    from models import Category
    if Category.query.filter_by(name=name).first():
        return jsonify({"error": "Category already exists"}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({"message": f"Category '{name}' created successfully"}), 201

@admin_bp.route('/admin/categories', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_categories():
    from models import Category
    categories = Category.query.order_by(Category.id.desc()).all()
    return jsonify({
        "categories": [{"id": c.id, "name": c.name} for c in categories]
    })

# ----------------------------Get articles----------------------------
@admin_bp.route('/admin/articles', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_pending_articles():
    try:
        articles = Article.query.filter_by(is_approved=False).order_by(Article.created_at.desc()).all()

        return jsonify({
            "articles": [{
                "id": a.id,
                "title": a.title,
                "content": a.content,
                "is_approved": a.is_approved,
                "is_flagged": a.is_flagged,
                "created_at": a.created_at.isoformat()
            } for a in articles]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------Approve Article----------------------------
@admin_bp.route('/admin/approve_article/<int:article_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def approve_article(article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({"error": "Article not found"}), 404

    article.is_approved = True
    db.session.commit()

    return jsonify({"message": f"Article '{article.title}' approved"}), 200

# ----------------------------Flag Article----------------------------
@admin_bp.route('/admin/flag_article/<int:article_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def flag_article(article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({"error": "Article not found"}), 404

    article.is_flagged = True
    db.session.commit()

    return jsonify({"message": f"Article '{article.title}' flagged"}), 200

# ----------------------------delete Article----------------------------
@admin_bp.route('/admin/delete_article/<int:article_id>', methods=['DELETE'])
@jwt_required()
@role_required("admin")
def delete_article(article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({"error": "Article not found"}), 404

    db.session.delete(article)
    db.session.commit()

    return jsonify({"message": f"Article '{article.title}' deleted"}), 200

# ----------------------------View and Delete Post----------------------------
@admin_bp.route('/admin/delete_post/<int:post_id>', methods=['DELETE'])
@jwt_required()
@role_required("admin")
def delete_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post deleted"}), 200

# ----------------------------Create Community----------------------------
@admin_bp.route('/admin/create_community', methods=['POST'])
@jwt_required()
@role_required("admin")
def create_community():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description", "")
    image = data.get("image", "")

    if not name:
        return jsonify({"error": "Community name required"}), 400

    new_community = Community(name=name, description=description, image=image, status="approved")
    db.session.add(new_community)
    db.session.commit()

    return jsonify({"message": f"Community '{name}' created"}), 201

# ----------------------------Reset Password----------------------------
@admin_bp.route('/admin/reset_password', methods=['POST'])
@jwt_required()
@role_required("admin")
def reset_password():
    data = request.get_json()
    email = data.get("email")
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    temp_password = "Temp1234Reset!"
    user.set_password(temp_password)
    db.session.commit()

    send_email(
        to=email,
        subject="Your Password Has Been Reset",
        body=f"Your temporary password is: {temp_password}\nPlease log in and change it immediately."
    )

    return jsonify({"message": f"Temporary password sent to {email}"}), 200

# ----------------------------Approve Community----------------------------
@admin_bp.route('/admin/approve_community/<int:community_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def approve_community(community_id):
    community = Community.query.get(community_id)
    if not community:
        return jsonify({"error": "Community not found"}), 404

    community.status = "approved"
    db.session.commit()
    return jsonify({"message": f"Community '{community.name}' approved"}), 200

# ----------------------------Pending Community----------------------------
@admin_bp.route('/admin/communities/pending', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_pending_communities():
    try:
        pending = Community.query.filter_by(status="pending").all()
        return jsonify({
            "communities": [{
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "image": c.image,
                "status": c.status
            } for c in pending]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/admin/comments/<int:comment_id>', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_flagged_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    user = User.query.get(comment.user_id)

    return jsonify({
        "comment": {
            "id": comment.id,
            "content": comment.content,
            "created_at": comment.created_at.isoformat(),
            "user": {
                "id": user.id,
                "full_name": user.profile.full_name if user.profile else "Anonymous"
            }
        }
    }), 200

@admin_bp.route('/admin/comments/<int:comment_id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def update_comment_status(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    data = request.get_json()
    status = data.get("status")

    if status == "approved":
        comment.is_flagged = False
    elif status == "rejected":
        db.session.delete(comment)
    else:
        return jsonify({"error": "Invalid status. Use 'approved' or 'rejected'."}), 400

    db.session.commit()
    return jsonify({"message": f"Comment {status} successfully"}), 200


@admin_bp.route('/admin/cleanup-bad-flags', methods=['DELETE'])
@jwt_required()
@role_required("admin")
def cleanup_bad_flag_reports():
    bad_flags = FlagReport.query.filter(FlagReport.content_id == None).all()
    count = len(bad_flags)

    for flag in bad_flags:
        db.session.delete(flag)

    db.session.commit()
    return jsonify({"message": f"Removed {count} invalid flag reports"}), 200
