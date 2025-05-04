from flask import Blueprint, request, jsonify
from models import db, Message  # Ensure Message model exists
from flask_jwt_extended import jwt_required, get_jwt_identity

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chats', methods=['GET'])
@jwt_required()
def get_chats():
    user_id = request.args.get('user_id', type=int)
    receiver_id = request.args.get('receiver_id', type=int)

    if not user_id or not receiver_id:
        return jsonify({"error": "Missing user_id or receiver_id"}), 400

    messages = Message.query.filter(
        ((Message.sender_id == user_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == user_id))
    ).order_by(Message.created_at.desc()).all()

    return jsonify([{
        "id": m.id,
        "message": m.message,
        "sender_id": m.sender_id,
        "receiver_id": m.receiver_id,
        "created_at": m.created_at
    } for m in messages])

@chat_bp.route('/chats', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json()
    sender_id = get_jwt_identity()
    receiver_id = data.get("receiverId")
    message_text = data.get("message")

    if not receiver_id or not message_text:
        return jsonify({"error": "Missing receiverId or message"}), 400

    new_message = Message(sender_id=sender_id, receiver_id=receiver_id, message=message_text)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({
        "id": new_message.id,
        "message": new_message.message,
        "sender_id": new_message.sender_id,
        "receiver_id": new_message.receiver_id,
        "created_at": new_message.created_at
    }), 201
