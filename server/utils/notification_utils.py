from extensions import socketio
from models import db, Notification
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

def create_and_emit_notification(user_id, message, link=None, room=None):
    # Save to DB
    notification = Notification(
        user_id=user_id,
        message=message,
        link=link,
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.session.add(notification)
    db.session.commit()

    # Emit to Socket.IO room (user or group)
    payload = {
        "message": message,
        "link": link,
        "id": notification.id,
        "created_at": notification.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "is_read": False
    }

    socketio.emit("new_notification", payload, room=room or f"user_{user_id}")
