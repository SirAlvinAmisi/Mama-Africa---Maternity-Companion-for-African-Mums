from flask import Blueprint, jsonify, request
from models import db, Community, Post, User, FlagReport
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request, get_jwt
from datetime import datetime, timedelta
from middleware.auth import role_required
from routes.flag_routes import detect_violation 
from functools import wraps


community_bp = Blueprint('community', __name__)

def allow_roles_for_posting(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role", "").strip().lower()
            if role not in [r.lower() for r in allowed_roles]:
                return jsonify({"error": f"Posting not allowed for role: {role}"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

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
        "created_at": comment.created_at.isoformat() + "Z",
        "replies": [serialize_comment(reply) for reply in sorted(comment.replies, key=lambda x: x.created_at)]
    }

# Get all communities
@community_bp.route('/communities', methods=['GET'])
@jwt_required(optional=True)
def get_communities():
    identity = get_jwt_identity()
    user_id = int(identity) if identity else None

    approved_communities = Community.query.filter_by(status="approved").all()

    return jsonify({
        "communities": [{
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "image": c.image,
            "member_count": len(c.members),
            "is_member": user_id in {u.id for u in c.members} if user_id else False
        } for c in approved_communities]
    }), 200


# Get community by id
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
                "created_at": p.created_at.isoformat() + "Z",
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

    member_ids = {u.id for u in community.members}
    print("📍Before join:", list(member_ids))

    if user_id in member_ids:
        return jsonify({
            "success": False,
            "message": "You are already a member of this community.",
            "is_member": True,
            "member_count": len(member_ids)
        }), 400

    community.members.append(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Successfully joined community.",
        "is_member": True,
        "member_count": len(community.members)
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

@community_bp.route('/communities/<int:id>', methods=['PATCH'])
@jwt_required()
@role_required("admin")
def update_community_status(id):
    try:
        community = Community.query.get(id)
        if not community:
            return jsonify({"error": "Community not found"}), 404

        data = request.get_json()
        status = data.get("status")

        if status not in ["approved", "rejected"]:
            return jsonify({"error": "Invalid status value"}), 400

        community.status = status
        db.session.commit()

        return jsonify({"message": f"Community '{community.name}' marked as {status}."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@community_bp.route('/communities/<int:id>/posts', methods=['POST'])
@jwt_required()
@allow_roles_for_posting("mum", "admin", "health_pro")
def create_community_post(id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    community = Community.query.get_or_404(id)

    content = request.form.get("content", "").strip()
    media = request.files.get("media")

    if not content and not media:
        return jsonify({"error": "Post must contain text or media."}), 400

    # Handle file saving here (assume media_url, media_type are set accordingly)
    media_url, media_type = None, None
    if media:
        # Save media and set `media_url` and `media_type`
        # (Assuming you have a save_media_file utility or equivalent)
        from utilities.community_media_utils import save_community_media
        media_url, media_type = save_community_media(media)

    new_post = Post(
        content=content,
        media_url=media_url,
        media_type=media_type,
        community_id=community.id,
        author_id=user_id
    )

    # ✅ Flag if banned word detected
    violation_reason = detect_violation(content)
    if violation_reason:
        return jsonify({"error": violation_reason}), 400
    if violation_reason:
        new_post.is_flagged = True
        new_post.violation_reason = violation_reason
        flag = FlagReport(
            reporter_id=user_id,
            content_type='post',
            content_id=new_post.id,  # will be set after flush
            reason=violation_reason
        )
        db.session.add(flag)

    db.session.add(new_post)
    db.session.commit()

    return jsonify({"message": "Post created successfully", "id": new_post.id}), 201