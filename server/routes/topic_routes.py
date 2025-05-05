from flask import Blueprint, request, jsonify
from models import db, Topic, User
from flask_jwt_extended import jwt_required, get_jwt_identity

topic_bp = Blueprint('topic', __name__)

@topic_bp.route('/topics', methods=['GET'])
def get_topics():
    topics = Topic.query.all()
    return jsonify({"topics": [{"id": t.id, "name": t.name, "description": t.description} for t in topics]})

@topic_bp.route('/topics/follow/<int:topic_id>', methods=['POST'])
@jwt_required()
def follow_topic(topic_id):
    user = User.query.get(get_jwt_identity())
    topic = Topic.query.get_or_404(topic_id)
    if topic not in user.followed_topics:
        user.followed_topics.append(topic)
        db.session.commit()
    return jsonify({"message": f"Followed topic '{topic.name}'"})

@topic_bp.route('/topics/unfollow/<int:topic_id>', methods=['DELETE'])
@jwt_required()
def unfollow_topic(topic_id):
    user = User.query.get(get_jwt_identity())
    topic = Topic.query.get_or_404(topic_id)
    if topic in user.followed_topics:
        user.followed_topics.remove(topic)
        db.session.commit()
    return jsonify({"message": f"Unfollowed topic '{topic.name}'"})
