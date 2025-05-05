from flask import Blueprint, jsonify, request
from models import MedicalUpload, Reminder
from flask_jwt_extended import get_jwt_identity
from middleware.auth import role_required

media_bp = Blueprint('media', __name__)

@media_bp.route('/uploads', methods=['GET'])
def get_uploads():
    uploads = MedicalUpload.query.all()
    return jsonify({"uploads": [
        {
            "id": u.id,
            "file_url": u.file_url,
            "file_type": u.file_type,
            "notes": u.notes
        } for u in uploads
    ]})

@media_bp.route('/mums/reminders', methods=['GET'])
@role_required("mum")
def get_reminders():
    identity = get_jwt_identity()
    reminders = Reminder.query.filter_by(user_id=identity).all()
    return jsonify({"reminders": [{"text": r.reminder_text, "date": r.reminder_date} for r in reminders]})

@media_bp.route('/mums/reminders', methods=['POST'])
@role_required("mum")
def add_reminder():
    identity = get_jwt_identity()
    data = request.get_json()
    new_reminder = Reminder(
        user_id=identity,
        reminder_text=data.get('reminder_text'),
        reminder_date=data.get('reminder_date')
    )
    db.session.add(new_reminder)
    db.session.commit()
    return jsonify({"message": "Reminder added successfully."})

@media_bp.route('/mums/upload_scan', methods=['POST'])
@role_required("mum")
def upload_scan():
    data = request.get_json()
    identity = get_jwt_identity()
    upload = MedicalUpload(
        user_id=identity,
        file_url=data['file_url'],
        file_type="scan",
        notes=data['notes']
    )
    db.session.add(upload)
    db.session.commit()
    return jsonify({"message": "Scan uploaded"})