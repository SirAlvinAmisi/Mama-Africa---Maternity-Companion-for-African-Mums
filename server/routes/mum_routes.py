from flask import Blueprint, request, jsonify, current_app
from models import db, User, Profile, PregnancyDetail, Reminder, Community, MedicalUpload, Question, Article, Post, Notification, Nutrition
from flask_jwt_extended import get_jwt_identity, get_jwt, verify_jwt_in_request, jwt_required
from middleware.auth import role_required
from datetime import datetime, timedelta
from utils.notification_utils import create_and_emit_notification
import os
from werkzeug.utils import secure_filename

mum_bp = Blueprint('mum', __name__, url_prefix='/mums')

# ------------------ Registration & Profile ------------------

@mum_bp.route('/register', methods=['POST', 'OPTIONS'])
def register_mum():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400
    user = User(email=data['email'], role="mum")
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Mum registered successfully"})

@mum_bp.route('/profile', methods=['POST', 'OPTIONS'])
@role_required("mum")
def update_mum_profile():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    identity = get_jwt_identity()
    existing_profile = Profile.query.filter_by(user_id=identity).first()
    if not existing_profile:
        existing_profile = Profile(user_id=identity)
    existing_profile.region = data['region']
    existing_profile.bio = data.get('bio')
    db.session.add(existing_profile)
    db.session.commit()
    return jsonify({"message": "Profile created"})

# ------------------ Pregnancy Info ------------------

@mum_bp.route('/pregnancy', methods=['POST', 'OPTIONS'])
@role_required("mum")
def add_pregnancy_details():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json()
    user_id = get_jwt_identity()

    lmp = datetime.strptime(data['last_period_date'], '%Y-%m-%d')
    edd = lmp + timedelta(days=280)
    current_week = (datetime.utcnow() - lmp).days // 7
    pregnancy_status = "active" if current_week < 40 else "completed"

    existing = PregnancyDetail.query.filter_by(user_id=user_id).first()
    if not existing:
        existing = PregnancyDetail(user_id=user_id)
        db.session.add(existing)

    existing.last_period_date = lmp
    existing.due_date = edd
    existing.current_week = current_week
    existing.pregnancy_status = pregnancy_status

    # Add standard reminders
    standard_reminders = [
        ("Initial prenatal checkup", lmp + timedelta(weeks=6), "checkup"),
        ("First antenatal visit", lmp + timedelta(weeks=8), "checkup"),
        ("Dating ultrasound", lmp + timedelta(weeks=12), "scan"),
        ("Supplements and nutrition check", lmp + timedelta(weeks=16), "support"),
        ("Anatomy scan", lmp + timedelta(weeks=20), "scan"),
        ("Diabetes screening", lmp + timedelta(weeks=24), "test"),
        ("Tetanus vaccination & iron check", lmp + timedelta(weeks=28), "support"),
        ("Fetal position + growth check", lmp + timedelta(weeks=32), "scan"),
        ("Final prep & birth plan", lmp + timedelta(weeks=36), "checkup"),
        ("Final ANC review", lmp + timedelta(weeks=38), "checkup"),
    ]

    if not Reminder.query.filter_by(user_id=user_id).first():
        for text, date, rtype in standard_reminders:
            db.session.add(Reminder(
                user_id=user_id,
                reminder_text=text,
                reminder_date=date.date(),
                type=rtype
            ))

    db.session.commit()
    return jsonify({"message": "Pregnancy info saved."})

@mum_bp.route('/pregnancy-info', methods=['GET', 'OPTIONS'])
@role_required("mum")
def get_pregnancy_info():
    if request.method == 'OPTIONS':
        return '', 204

    user_id = get_jwt_identity()
    pregnancy = PregnancyDetail.query.filter_by(user_id=user_id).first()
    reminders = Reminder.query.filter_by(user_id=user_id).order_by(Reminder.reminder_date).all()

    if not pregnancy:
        return jsonify({"error": "No pregnancy record found"}), 404

    appointments = [
        {
            "title": r.reminder_text,
            "date": r.reminder_date.strftime('%Y-%m-%d'),
            "time": r.reminder_time.strftime('%H:%M') if r.reminder_time else None,
            "type": r.type
        } for r in reminders
    ]

    overdue_message = None
    if pregnancy.current_week > 40:
        overdue_message = "You're beyond 40 weeks — please consult your healthcare provider. You may have already delivered."

    return jsonify({
        "due_date": pregnancy.due_date.strftime('%Y-%m-%d'),
        "current_week": pregnancy.current_week,
        "last_period_date": pregnancy.last_period_date.strftime('%Y-%m-%d'),
        "appointments": appointments,
        "overdue_message": overdue_message
    })

# ------------------ Reminder Management ------------------

@mum_bp.route('/reminders', methods=['GET'])
@role_required("mum")
def get_reminders():
    user_id = get_jwt_identity()
    reminders = Reminder.query.filter_by(user_id=user_id).order_by(Reminder.reminder_date).all()
    print("📦 REMINDERS:", reminders)

    events = []
    for r in reminders:
        date_part = r.reminder_date.strftime('%Y-%m-%d')
        time_part = r.reminder_time.strftime('%H:%M') if r.reminder_time else '00:00'
        datetime_str = f"{date_part}T{time_part}"
        events.append({
            "id": r.id,
            "title": r.reminder_text,
            "type": r.type,
            "datetime": datetime_str
        })
    return jsonify({"events": events})

@mum_bp.route('/reminder', methods=['POST', 'OPTIONS'])
@role_required("mum")
def add_custom_reminder():
    if request.method == 'OPTIONS':
        return '', 204
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        reminder_time = datetime.strptime(data['reminder_time'], '%H:%M').time() if data.get('reminder_time') else None
        reminder = Reminder(
            user_id=user_id,
            reminder_text=data['reminder_text'],
            reminder_date=datetime.strptime(data['reminder_date'], '%Y-%m-%d').date(),
            reminder_time=reminder_time,
            type=data.get('type', 'custom')
        )
        db.session.add(reminder)
        db.session.commit()
        db.session.add(reminder)
        db.session.commit()
        return jsonify({
            "event": {
                "id": reminder.id,
                "title": reminder.reminder_text,
                "type": reminder.type,
                "datetime": f"{reminder.reminder_date}T{reminder.reminder_time or '00:00'}"
            }
    }), 201
    except (KeyError, ValueError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400

@mum_bp.route('/reminders/<int:reminder_id>', methods=['PATCH'])
@role_required("mum")
def update_reminder(reminder_id):
    data = request.get_json()
    reminder = Reminder.query.get_or_404(reminder_id)
    if reminder.user_id != get_jwt_identity():
        return jsonify({"error": "Unauthorized"}), 403
    if 'reminder_text' in data:
        reminder.reminder_text = data['reminder_text']
    if 'reminder_date' in data:
        reminder.reminder_date = datetime.strptime(data['reminder_date'], '%Y-%m-%d')
    if 'reminder_time' in data:
        reminder.reminder_time = datetime.strptime(data['reminder_time'], '%H:%M').time()
    db.session.commit()
    return jsonify({"message": "Reminder updated successfully."})

@mum_bp.route('/reminders/<int:reminder_id>', methods=['DELETE'])
@role_required("mum")
def delete_reminder(reminder_id):
    reminder = Reminder.query.get_or_404(reminder_id)
    if reminder.user_id != get_jwt_identity():
        return jsonify({"error": "Unauthorized"}), 403
    db.session.delete(reminder)
    db.session.commit()
    return jsonify({"message": "Reminder deleted successfully."})

# ------------------ Scans ------------------
@mum_bp.route('/upload_scan', methods=['POST', 'OPTIONS'])
@role_required("mum")
def upload_scan():
    if request.method == 'OPTIONS':
        return '', 204

    user_id = get_jwt_identity()
    file = request.files.get('file')
    file_url = request.form.get('file_url')
    notes = request.form.get('notes', '')
    doctor_id = request.form.get('doctor_id')

    if not file_url and not file:
        return jsonify({"error": "Either file or file URL is required"}), 400

    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        file_url = f"/static/avatars/{filename}"

    scan = MedicalUpload(
        user_id=user_id,
        file_url=file_url,
        notes=notes,
        uploaded_at=datetime.utcnow(),
        doctor_id=doctor_id
    )
    db.session.add(scan)

    from utils.notification_utils import create_and_emit_notification
    from models import Question

    doctor = User.query.get(doctor_id)

    # Notify doctor and create question entry
    if doctor and doctor.role == "health_pro":
        create_and_emit_notification(
            user_id=doctor.id,
            message="You received a new scan upload.",
            link="/healthpro/scans",
            room=f"user_{doctor.id}"
        )

        # Create corresponding Q&A record so it appears in their Q&A dashboard
        scan_question = Question(
            user_id=user_id,
            doctor_id=doctor.id,
            question_text=f"[Scan Upload] {notes or 'Scan was uploaded with no notes.'}",
            is_anonymous=True,
            is_answered=False
        )
        db.session.add(scan_question)

    db.session.commit()
    return jsonify({"message": "Scan uploaded successfully"}), 201

# @mum_bp.route('/upload_scan', methods=['POST', 'OPTIONS'])
# @role_required("mum")
# def upload_scan():
#     if request.method == 'OPTIONS':
#         return '', 204
#     user_id = get_jwt_identity()
#     file = request.files.get('file')
#     file_url = request.form.get('file_url')
#     notes = request.form.get('notes', '')
#     doctor_id = request.form.get('doctor_id')
#     if not file_url and not file:
#         return jsonify({"error": "Either file or file URL is required"}), 400
#     if file:
#         filename = secure_filename(file.filename)
#         save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
#         file.save(save_path)
#         file_url = f"/static/avatars/{filename}"
#     scan = MedicalUpload(
#         user_id=user_id,
#         file_url=file_url,
#         notes=notes,
#         uploaded_at=datetime.utcnow(),
#         doctor_id=doctor_id
#     )
#     db.session.add(scan)

#     # Notify the doctor
#     from utils.notification_utils import create_and_emit_notification

#     doctor = User.query.get(doctor_id)
#     if doctor and doctor.role == "health_pro":
#         create_and_emit_notification(
#             user_id=doctor.id,
#             message="You received a new scan upload.",
#             link="/healthpro/scans",
#             room=f"user_{doctor.id}"
#         )

#     db.session.commit()
#     return jsonify({"message": "Scan uploaded successfully"}), 201


@mum_bp.route('/scans', methods=['GET', 'OPTIONS'])
@role_required("mum")
def get_uploaded_scans():
    if request.method == 'OPTIONS':
        return '', 204

    user_id = get_jwt_identity()
    scans = MedicalUpload.query.filter_by(user_id=user_id).order_by(MedicalUpload.uploaded_at.desc()).all()

    return jsonify({
        "uploads": [
            {
                "id": scan.id,
                "file_url": scan.file_url,
                "notes": scan.notes,
                "uploaded_at": scan.uploaded_at.strftime('%Y-%m-%d'),
                "doctor_name": (
                    scan.doctor.profile.full_name if scan.doctor and scan.doctor.profile else "Not sent"
                )
            } for scan in scans
        ]
    })


# ------------------ Community ------------------

@mum_bp.route('/communities', methods=['GET', 'OPTIONS'])
@role_required("mum")
def list_communities():
    if request.method == 'OPTIONS':
        return '', 204
    communities = Community.query.filter_by(status="approved").all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "description": c.description,
        "image": c.image,
        "member_count": c.member_count
    } for c in communities])

@mum_bp.route('/communities/<int:id>/join', methods=['POST'])
@role_required("mum")
def join_community(id):
    user_id = get_jwt_identity()
    community = Community.query.get(id)
    if not community:
        return jsonify({"error": "Community not found"}), 404
    user = User.query.get(user_id)
    if user in community.members:
        return jsonify({"message": "Already joined"}), 200
    community.members.append(user)
    community.member_count += 1
    db.session.commit()
    return jsonify({"message": "Joined community successfully"})

@mum_bp.route('/communities/<int:id>/leave', methods=['POST'])
@role_required("mum")
def leave_community(id):
    user_id = get_jwt_identity()
    community = Community.query.get(id)
    if not community:
        return jsonify({"error": "Community not found"}), 404
    user = User.query.get(user_id)
    if user in community.members:
        community.members.remove(user)
        community.member_count = max(0, community.member_count - 1)
        db.session.commit()
        return jsonify({"message": "Left community successfully"})
    return jsonify({"error": "User was not a member"}), 400

@mum_bp.route('/communities/joined', methods=['GET'])
@role_required('mum')
def get_joined_communities():
    user = User.query.get(get_jwt_identity())
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "description": c.description,
        "image": c.image,
        "member_count": c.member_count
    } for c in user.communities])

# ------------------ Questions ------------------
@mum_bp.route('/questions', methods=['GET', 'POST', 'PATCH', 'OPTIONS'])
@role_required("mum")
def handle_questions():
    if request.method == 'OPTIONS':
        return '', 204

    verify_jwt_in_request()
    role_data = get_jwt()
    if role_data.get("role") != "mum":
        return jsonify({"error": "Unauthorized role"}), 403

    user_id = get_jwt_identity()

    if request.method == 'GET':
        questions = Question.query.filter_by(user_id=user_id).all()
        return jsonify([
            {
                "id": q.id,
                "question_text": q.question_text,
                "answer_text": q.answer_text,
                "doctor_id": q.doctor_id,
                "doctor_name": User.query.get(q.doctor_id).profile.full_name if q.doctor_id else "N/A"
            } for q in questions
        ])

    if request.method == 'POST':
        data = request.get_json()
        if not data.get("question_text") or not data.get("doctor_id"):
            return jsonify({"error": "Both question text and doctor_id are required."}), 400
        question = Question(
            user_id=user_id,
            question_text=data['question_text'],
            is_anonymous=data.get("is_anonymous", False),
            doctor_id=data["doctor_id"]
        )
        db.session.add(question)
        doctor = User.query.get(data["doctor_id"])
        if doctor and doctor.role == 'health_pro':
            create_and_emit_notification(
                user_id=doctor.id,
                message="New question directed to you.",
                link="/healthpro/questions",
                room=f"user_{doctor.id}"
            )
        db.session.commit()
        return jsonify({"message": "Question submitted successfully."}), 201

    if request.method == 'PATCH':
        data = request.get_json()
        question_id = data.get("id")
        new_text = data.get("question_text")
        if not question_id or not new_text:
            return jsonify({"error": "Both question ID and new text are required."}), 400
        question = Question.query.filter_by(id=question_id, user_id=user_id).first()
        if not question:
            return jsonify({"error": "Question not found or unauthorized."}), 404
        question.question_text = new_text
        db.session.commit()
        return jsonify({"message": "Question updated successfully."})


# ------------------ Nutrition ------------------

@mum_bp.route('/nutrition', methods=['GET', 'OPTIONS'])
@role_required("mum")
def get_weekly_nutrition():
    week = request.args.get('week', type=int)
    if not week or not (1 <= week <= 40):
        return jsonify({"error": "Invalid or missing week"}), 400
    entry = Nutrition.query.filter_by(week=week).first()
    if not entry:
        return jsonify({"error": "No data for this week"}), 404
    return jsonify({
        "week": entry.week,
        "nutrients": entry.nutrients,
        "food_suggestions": entry.food_suggestions
    })
