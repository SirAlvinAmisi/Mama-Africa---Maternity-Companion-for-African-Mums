from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification
from middleware.auth import role_required

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([{
        "id": n.id,
        "message": n.message,
        "link": n.link,
        "is_read": n.is_read,
        "created_at": n.created_at.strftime("%Y-%m-%d %H:%M:%S")
    } for n in notifications])

@notification_bp.route('/notifications/<int:id>/read', methods=['PATCH'])
@jwt_required()
def mark_as_read(id):
    notification = Notification.query.get_or_404(id)
    if notification.user_id != get_jwt_identity():
        return jsonify({"error": "Unauthorized"}), 403
    notification.is_read = True
    db.session.commit()
    return jsonify({"message": "Marked as read."})
