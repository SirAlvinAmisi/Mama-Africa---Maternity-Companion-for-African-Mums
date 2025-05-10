from flask import Blueprint, jsonify, request, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from models.models import db, Post, User, Comment
import os

post_bp = Blueprint('post', __name__)

# Allowed media extensions
def allowed_file(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


# Create a post in a community
@post_bp.route('/communities/<int:community_id>/posts', methods=['POST'])
@jwt_required()
def create_post(community_id):
    user_id = int(get_jwt_identity())
    title = request.form.get('title', '').strip()
    content = request.form.get('content', '').strip()
    media_url = media_type = None

    if 'media' in request.files:
        media_file = request.files['media']
        if media_file and allowed_file(media_file.filename):
            filename = secure_filename(f"{datetime.utcnow().timestamp()}_{media_file.filename}")
            upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            filepath = os.path.join(upload_folder, filename)
            media_file.save(filepath)
            media_url = f"/uploads/{filename}"
            media_type = 'video' if filename.lower().endswith(('mp4', 'mov')) else 'image'

    new_post = Post(
        title=title,
        content=content,
        media_url=media_url,
        media_type=media_type,
        author_id=user_id,
        community_id=community_id
    )

    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        "message": "Post created successfully",
        "post": {
            "id": new_post.id,
            "title": new_post.title,
            "content": new_post.content,
            "media_url": new_post.media_url,
            "media_type": new_post.media_type,
            "created_at": new_post.created_at.isoformat()
        }
    }), 201


# Like or unlike a post
@post_bp.route('/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def toggle_post_like(post_id):
    user_id = int(get_jwt_identity())
    post = Post.query.get_or_404(post_id)
    user = User.query.get(user_id)

    liked = False
    if user in post.likers:
        post.likers.remove(user)
    else:
        post.likers.append(user)
        liked = True

    db.session.commit()
    return jsonify({"liked": liked, "like_count": len(post.likers)})


# Comment on a post (or reply)
@post_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def comment_on_post(post_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    comment = Comment(
        user_id=user_id,
        post_id=post_id,
        content=data.get('content'),
        parent_comment_id=data.get('parent_comment_id')
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify({"message": "Comment added", "comment_id": comment.id}), 201


# Like or unlike a comment
@post_bp.route('/comments/<int:comment_id>/like', methods=['POST'])
@jwt_required()
def toggle_comment_like(comment_id):
    user_id = int(get_jwt_identity())
    comment = Comment.query.get_or_404(comment_id)
    user = User.query.get(user_id)

    liked = False
    if user in comment.likers:
        comment.likers.remove(user)
    else:
        comment.likers.append(user)
        liked = True

    db.session.commit()
    return jsonify({"liked": liked, "like_count": len(comment.likers)})


# Delete a post
@post_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    if post.author_id != int(get_jwt_identity()):
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"}), 200


# Delete a comment
@post_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    if comment.user_id != int(get_jwt_identity()):
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted"}), 200


# Get posts in a community (last 30 days) with comments and replies
@post_bp.route('/communities/<int:community_id>/posts', methods=['GET'])
@jwt_required(optional=True)
def get_community_posts(community_id):
    user_id = get_jwt_identity()
    cutoff = datetime.utcnow() - timedelta(days=30)

    posts = Post.query.filter_by(community_id=community_id)\
                      .filter(Post.created_at >= cutoff)\
                      .order_by(Post.created_at.desc())\
                      .all()

    post_list = []
    for post in posts:
        author = User.query.get(post.author_id)
        comment_count = Comment.query.filter_by(post_id=post.id).count()
        like_count = len(post.likers)
        liked_by_user = user_id in {u.id for u in post.likers} if user_id else False

        author_name = (
            author.profile.full_name
            if author and author.profile and author.profile.full_name
            else "Anonymous"
        )

        comments_data = []
        top_level_comments = Comment.query.filter_by(post_id=post.id, parent_comment_id=None).all()

        for comment in top_level_comments:
            comment_author = User.query.get(comment.user_id)
            replies_data = []
            replies = Comment.query.filter_by(parent_comment_id=comment.id).all()

            for reply in replies:
                reply_author = User.query.get(reply.user_id)
                replies_data.append({
                    "id": reply.id,
                    "content": reply.content,
                    "created_at": reply.created_at.isoformat(),
                    "user_id": reply.user_id,
                    "user_name": reply_author.profile.full_name if reply_author and reply_author.profile else "Anonymous",
                    "like_count": len(reply.likers),
                    "liked_by_user": user_id in {u.id for u in reply.likers} if user_id else False,
                })

            comments_data.append({
                "id": comment.id,
                "content": comment.content,
                "created_at": comment.created_at.isoformat(),
                "user_id": comment.user_id,
                "user_name": comment_author.profile.full_name if comment_author and comment_author.profile else "Anonymous",
                "like_count": len(comment.likers),
                "liked_by_user": user_id in {u.id for u in comment.likers} if user_id else False,
                "replies": replies_data
            })

        post_list.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "media_url": post.media_url,
            "media_type": post.media_type,
            "created_at": post.created_at.isoformat(),
            "user_name": author_name,
            "author_id": post.author_id,
            "like_count": like_count,
            "comment_count": comment_count,
            "liked_by_user": liked_by_user,
            "comments": comments_data
        })

    return jsonify(post_list), 200


# Get logged-in user's own posts (last 30 days)
@post_bp.route('/my-posts', methods=['GET'])
@jwt_required()
def get_my_posts():
    user_id = int(get_jwt_identity())
    cutoff = datetime.utcnow() - timedelta(days=30)

    posts = Post.query.filter_by(author_id=user_id)\
                      .filter(Post.created_at >= cutoff)\
                      .order_by(Post.created_at.desc())\
                      .all()

    post_list = []
    for post in posts:
        comment_count = Comment.query.filter_by(post_id=post.id).count()
        like_count = len(post.likers)

        post_list.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "media_url": post.media_url,
            "media_type": post.media_type,
            "created_at": post.created_at.isoformat(),
            "like_count": like_count,
            "comment_count": comment_count
        })

    return jsonify(post_list), 200
