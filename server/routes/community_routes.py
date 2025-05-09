from flask import Blueprint, jsonify, request
from models import db, Community, Post, User
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

community_bp = Blueprint('community', __name__)

# Recursive comment serializer
def serialize_comment(comment):
    return {
        "id": comment.id,
        "content": comment.content,
        "user_id": comment.user_id,
        "user_name": comment.user.profile.full_name if comment.user and comment.user.profile else "Anonymous",
        "parent_id": comment.parent_comment_id,
        "reply_to_user_id": comment.parent.user_id if comment.parent else None,
        "reply_to_user_name": comment.parent.user.profile.full_name if comment.parent and comment.parent.user and comment.parent.user.profile else "Anonymous",
        "created_at": comment.created_at.isoformat(),
        "replies": [serialize_comment(reply) for reply in sorted(comment.replies, key=lambda x: x.created_at)]
    }

# Get all communities
@community_bp.route('/communities', methods=['GET'])
@jwt_required(optional=True)
def get_communities():
    identity = get_jwt_identity()
    print("JWT identity in /communities:", identity)
    user_id = int(identity) if identity else None

    communities = Community.query.all()
    return jsonify({
        "communities": [
            {
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "image": c.image,
                "member_count": len(c.members),
                "is_member": user_id in {u.id for u in c.members} if user_id else False
            } for c in communities
        ]
    })


# Get community details
@community_bp.route('/communities/<int:id>', methods=['GET'])
@jwt_required(optional=True)
def get_community(id):
    identity = get_jwt_identity()
    user_id = int(identity) if identity else None

    community = Community.query.get(id)
    if not community:
        return {"error": "Community not found"}, 404

    is_member = user_id in {u.id for u in community.members} if user_id else False

    response = {
        "id": community.id,
        "name": community.name,
        "description": community.description,
        "image": community.image,
        "member_count": len(community.members),
        "is_member": is_member
    }

    if not is_member:
        return jsonify({"community": response, "message": "Join this community to see more."}), 200

    return jsonify({"community": response}), 200


# Get posts in a community (last 30 days, newest first)
@community_bp.route('/communities/<int:id>/posts', methods=['GET'])
@jwt_required(optional=True)
def get_community_posts(id):
    identity = get_jwt_identity()
    user_id = int(identity) if identity else None
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    cutoff = datetime.utcnow() - timedelta(days=30)
    posts = Post.query.filter_by(community_id=id)\
                      .filter(Post.created_at >= cutoff)\
                      .order_by(Post.created_at.desc())\
                      .paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "content": p.content,
                "author_id": p.author_id,
                "user_name": (
                    p.author.profile.full_name
                    if p.author and p.author.profile and p.author.profile.full_name
                    else "Anonymous"
                ),
                "media_url": p.media_url,
                "media_type": p.media_type,
                "created_at": p.created_at.isoformat(),
                "like_count": len(p.likers),
                "liked_by_user": user_id in {u.id for u in p.likers} if user_id else False,
                "comment_count": len(p.comments),
                "comments": [
                    serialize_comment(c) for c in p.comments if c.parent_comment_id is None
                ]
            }
            for p in posts.items
        ],
        "total": posts.total,
        "pages": posts.pages,
        "current_page": posts.page
    })


# Join community
@community_bp.route('/communities/<int:community_id>/join', methods=['POST'])
@jwt_required()
def join_community(community_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    community = Community.query.get_or_404(community_id)

    if user in community.members:
        return jsonify({"error": "Already a member"}), 400

    community.members.append(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Successfully joined community",
        "member_count": len(community.members),
        "is_member": True
    }), 200


# Leave community
@community_bp.route('/communities/<int:community_id>/leave', methods=['POST'])
@jwt_required()
def leave_community(community_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    community = Community.query.get_or_404(community_id)

    if user not in community.members:
        return jsonify({"error": "Not a member"}), 400

    community.members.remove(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Successfully left community",
        "member_count": len(community.members),
        "is_member": False
    }), 200
