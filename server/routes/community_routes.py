from flask import Blueprint, jsonify, request
from models import db, Community, Post
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt 

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

@community_bp.route('/communities/<int:id>', methods=['PATCH', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173"], supports_credentials=True)
@jwt_required()
def update_community_status(id):
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    community = Community.query.get_or_404(id)
    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["approved", "rejected"]:
        return jsonify({"error": "Invalid status"}), 400

    community.status = new_status
    db.session.commit()

    return jsonify({"message": f"Community {new_status} successfully."})