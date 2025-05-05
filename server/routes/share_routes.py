from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, SharedContent
from datetime import datetime

share_bp = Blueprint('share', __name__)

@share_bp.route('/shares', methods=['POST'])
@jwt_required()
def share_content():
    data = request.get_json()
    shared = SharedContent(
        user_id=get_jwt_identity(),
        content_type=data['content_type'],
        content_id=data['content_id'],
        shared_with=data['shared_with'],
        shared_at=datetime.utcnow()
    )
    db.session.add(shared)
    db.session.commit()
    return jsonify({"message": "Content shared"}), 201