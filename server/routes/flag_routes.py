from flask import Blueprint, request, jsonify
from models import db, FlagReport, Post, Article
from flask_jwt_extended import jwt_required, get_jwt_identity

flag_bp = Blueprint('flag', __name__)

@flag_bp.route('/flags', methods=['GET'])
@jwt_required()
def get_all_flags():
    flags = FlagReport.query.order_by(FlagReport.created_at.desc()).all()
    return jsonify({"flags": [{
        "id": f.id,
        "reporter_id": f.reporter_id,
        "content_type": f.content_type,
        "content_id": f.content_id,
        "reason": f.reason,
        "reviewed": f.reviewed
    } for f in flags]})

@flag_bp.route('/flags/<int:flag_id>', methods=['PATCH'])
@jwt_required()
def review_flag(flag_id):
    flag = FlagReport.query.get_or_404(flag_id)
    flag.reviewed = True
    db.session.commit()
    return jsonify({"message": "Flag marked as reviewed"})

@flag_bp.route('/posts/<int:post_id>/flag', methods=['POST'])
@jwt_required()
def flag_post(post_id):
    user_id = get_jwt_identity()  # Get the logged-in user's ID
    post = Post.query.get_or_404(post_id)

    if post.is_flagged:
        return jsonify({"message": "Post is already flagged"}), 400

    post.is_flagged = True
    db.session.commit()

    # Log the flagging action
    flag_report = FlagReport(
        reporter_id=user_id,
        content_type='post',
        content_id=post_id,
        reason=request.json.get('reason', 'No reason provided')
    )
    db.session.add(flag_report)
    db.session.commit()

    return jsonify({"message": "Post flagged successfully"}), 200

@flag_bp.route('/articles/<int:article_id>/flag', methods=['POST'])
@jwt_required()
def flag_article(article_id):
    user_id = get_jwt_identity()  # Get the logged-in user's ID
    article = Article.query.get_or_404(article_id)

    if article.is_flagged:
        return jsonify({"message": "Article is already flagged"}), 400

    article.is_flagged = True
    db.session.commit()

    # Log the flagging action
    flag_report = FlagReport(
        reporter_id=user_id,
        content_type='article',
        content_id=article_id,
        reason=request.json.get('reason', 'No reason provided')
    )
    db.session.add(flag_report)
    db.session.commit()

    return jsonify({"message": "Article flagged successfully"}), 200