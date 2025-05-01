from flask import Blueprint, jsonify
from models import Community, Post

community_bp = Blueprint('community', __name__)

@community_bp.route('/communities', methods=['GET'])
def get_communities():
    communities = Community.query.all()
    return jsonify({"communities": [
        {
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "image": c.image,
            "members": c.member_count
        } for c in communities
    ]})

@community_bp.route('/communities/<int:id>', methods=['GET'])
def get_community(id):
    community = Community.query.get(id)
    if not community:
        return {"error": "Community not found"}, 404
    return jsonify({"community": {
        "id": community.id,
        "name": community.name,
        "description": community.description,
        "image": community.image,
        "member_count": community.member_count
    }})

@community_bp.route('/communities/<int:id>/posts', methods=['GET'])
def get_community_posts(id):
    posts = Post.query.filter_by(community_id=id).all()
    return jsonify({"posts": [
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "author_id": p.author_id
        } for p in posts
    ]})
