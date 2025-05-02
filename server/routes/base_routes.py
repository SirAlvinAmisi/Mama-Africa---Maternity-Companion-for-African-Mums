from flask import Blueprint, jsonify
from models import Profile, Post, Comment

base_bp = Blueprint('base', __name__)

@base_bp.route('/')
def index():
    return "Welcome to Mama Afrika!"

@base_bp.route('/profile')
def get_profile():
    users = Profile.query.all()
    return jsonify({"users": [
        {
            "id": user.id,
            "full_name": user.full_name,
            "region": user.region,
            "bio": user.bio
        } for user in users
    ]})

@base_bp.route('/posts')
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

@base_bp.route('/comments')
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
