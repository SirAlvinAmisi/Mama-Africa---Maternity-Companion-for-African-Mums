from flask import Blueprint, request, jsonify
from models import db, FlagReport
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