from flask import Blueprint, jsonify
from models import Profile, Post, Comment, Notification
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

base_bp = Blueprint('base', __name__)

@base_bp.route('/')
def index():
    return "Welcome to Mama Afrika!"

@base_bp.route('/profile', methods=['GET'])
def get_profile():
    users = Profile.query.all()
    # users = Profile.query.filter(
    #     (Profile.role != 'health_pro') | (Profile.is_verified == True)
    # ).all()

    return jsonify({"users": [
        {
            "id": user.id,
            "full_name": user.full_name,
            "region": user.region,
            "bio": user.bio, 
            "role": user.role,
            "profile_picture": user.profile_picture,
        } for user in users
    ]})

@base_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify({"posts": [
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "is_medical": post.is_medical,
            "is_approved": post.is_approved,
            "category": post.category
        } for post in posts
    ]})

@base_bp.route('/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.all()
    return jsonify({"comments": [
        {
            "id": c.id,
            "post_id": c.post_id,
            "user_id": c.user_id,
            "content": c.content
        } for c in comments
    ]})

@base_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifs = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([{
        "message": n.message,
        "created_at": n.created_at.strftime('%Y-%m-%d %H:%M'),
        "is_read": n.is_read
    } for n in notifs])
