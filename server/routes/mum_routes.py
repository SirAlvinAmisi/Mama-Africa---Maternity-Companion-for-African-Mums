from flask import Blueprint, request, jsonify
from models import db, User, Profile, PregnancyDetail, Reminder, Community, MedicalUpload, Question, Article, Post, Notification
from flask_jwt_extended import get_jwt_identity, get_jwt
from utils.email_utils import send_email
from middleware.auth import role_required
from datetime import datetime, timedelta

mum_bp = Blueprint('mum', __name__)

# ------------------ Registration & Profile ------------------

@mum_bp.route('/mums/register', methods=['POST'])
def register_mum():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400
    user = User(email=data['email'], role="mum")
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Mum registered successfully"})

@mum_bp.route('/mums/profile', methods=['POST'])
@role_required("mum")
def update_mum_profile():
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

@mum_bp.route('/mums/pregnancy', methods=['POST'])
@role_required("mum")
def add_pregnancy_details():
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
    db.session.commit()

    return jsonify({"message": "Pregnancy info saved."})

@mum_bp.route('/mums/pregnancy-info', methods=['GET'])
@role_required("mum")
def get_pregnancy_info():
    user_id = get_jwt_identity()
    pregnancy = PregnancyDetail.query.filter_by(user_id=user_id).first()
    reminders = Reminder.query.filter_by(user_id=user_id).order_by(Reminder.reminder_date).all()

    if not pregnancy:
        return jsonify({"error": "No pregnancy record found"}), 404

    appointments = [
        {
            "title": r.reminder_text,
            "date": r.reminder_date.strftime('%Y-%m-%d'),
            "type": r.type
        } for r in reminders
    ]
    return jsonify({
        "due_date": pregnancy.due_date.strftime('%Y-%m-%d'),
        "current_week": pregnancy.current_week,
        "last_period_date": pregnancy.last_period_date.strftime('%Y-%m-%d'),
        "appointments": appointments
    })

# ------------------ Reminder Management ------------------

@mum_bp.route('/mums/reminder', methods=['POST'])
@role_required("mum")
def add_custom_reminder():
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        reminder = Reminder(
            user_id=user_id,
            reminder_text=data['reminder_text'],
            reminder_date=datetime.strptime(data['reminder_date'], '%Y-%m-%d').date(),
            type=data.get('type', 'custom')
        )
        db.session.add(reminder)
        db.session.commit()
        return jsonify({"message": "Reminder added successfully."}), 201

    except (KeyError, ValueError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400

@mum_bp.route('/mums/reminders/<int:reminder_id>', methods=['PATCH'])
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
    db.session.commit()
    return jsonify({"message": "Reminder updated successfully."})

@mum_bp.route('/mums/reminders/<int:reminder_id>', methods=['DELETE'])
@role_required("mum")
def delete_reminder(reminder_id):
    reminder = Reminder.query.get_or_404(reminder_id)
    if reminder.user_id != get_jwt_identity():
        return jsonify({"error": "Unauthorized"}), 403
    db.session.delete(reminder)
    db.session.commit()
    return jsonify({"message": "Reminder deleted successfully."})

# ------------------ Community Participation ------------------

@mum_bp.route('/mums/communities', methods=['GET'])
@role_required("mum")
def list_communities():
    communities = Community.query.filter_by(status="approved").all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "description": c.description,
        "image": c.image,
        "member_count": c.member_count
    } for c in communities])

@mum_bp.route('/mums/communities/<int:id>/join', methods=['POST'])
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

@mum_bp.route('/mums/communities/<int:id>/leave', methods=['POST'])
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

# ------------------ Medical Uploads ------------------

@mum_bp.route('/mums/upload_scan', methods=['POST'])
@role_required("mum")
def upload_scan():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get("file_url"):
        return jsonify({"error": "File URL is required"}), 400

    scan = MedicalUpload(
        user_id=user_id,
        file_url=data["file_url"],
        notes=data.get("notes", ""),
        uploaded_at=datetime.utcnow()
    )
    db.session.add(scan)
    db.session.commit()

    return jsonify({"message": "Scan uploaded successfully"}), 201

@mum_bp.route('/mums/scans', methods=['GET'])
@role_required("mum")
def get_uploaded_scans():
    user_id = get_jwt_identity()
    scans = MedicalUpload.query.filter_by(user_id=user_id).order_by(MedicalUpload.uploaded_at.desc()).all()
    return jsonify({
        "uploads": [
            {
                "id": scan.id,
                "file_url": scan.file_url,
                "notes": scan.notes,
                "uploaded_at": scan.uploaded_at.strftime('%Y-%m-%d')
            } for scan in scans
        ]
    })

# ------------------ Questions & Answers ------------------

@mum_bp.route('/mums/questions', methods=['POST'])
@role_required("mum")
def ask_question():
    data = request.get_json()
    user_id = get_jwt_identity()

    if not data.get("question_text"):
        return jsonify({"error": "Question text is required"}), 400

    question = Question(
        user_id=user_id,
        question_text=data['question_text'],
        is_anonymous=data.get("is_anonymous", False)
    )
    db.session.add(question)

    # Notify health professionals
    health_pros = User.query.filter_by(role='health_pro').all()
    for hp in health_pros:
        db.session.add(Notification(
            user_id=hp.id,
            message="New question submitted by a mum.",
            link="/healthpro/questions"
        ))
        send_email(
            hp.email,
            "New Question Submitted",
            "A new question has been posted by a mum. Please log in to respond."
        )

    db.session.commit()
    return jsonify({"message": "Question submitted successfully."}), 201

@mum_bp.route('/mums/questions', methods=['GET'])
@role_required("mum")
def get_mum_questions():
    user_id = get_jwt_identity()
    questions = Question.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": q.id,
        "question_text": q.question_text,
        "answer_text": q.answer_text,
        "answered_by": q.answered_by
    } for q in questions])

# ------------------ Others ------------------

@mum_bp.route('/mums/followed-topics', methods=['GET'])
@role_required("mum")
def get_followed_topics():
    user = User.query.get(get_jwt_identity())
    return jsonify({
        "topics": [
            {
                "id": t.id,
                "name": t.name,
                "description": t.description
            } for t in user.followed_topics
        ]
    })

@mum_bp.route('/healthpros', methods=['GET'])
@role_required("mum")
def get_health_pros():
    health_pros = User.query.filter_by(role="health_pro").all()
    return jsonify({
        "doctors": [
            {
                "id": hp.id,
                "name": hp.profile.full_name if hp.profile else f"Doctor {hp.id}"
            } for hp in health_pros
        ]
    })