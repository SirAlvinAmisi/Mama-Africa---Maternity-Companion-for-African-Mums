from flask import Blueprint, request, jsonify
from models import db, User, Profile, PregnancyDetail, Reminder, Community, MedicalUpload, Question, Article, Post
from flask_jwt_extended import get_jwt_identity, get_jwt
from middleware.auth import role_required
from datetime import datetime, timedelta

mum_bp = Blueprint('mum', __name__)

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

    Reminder.query.filter_by(user_id=user_id).delete()
    reminders = [
        Reminder(user_id=user_id, reminder_text='Initial Prenatal Visit', reminder_date=lmp + timedelta(weeks=8), type='checkup'),
        Reminder(user_id=user_id, reminder_text='Anatomy Scan', reminder_date=lmp + timedelta(weeks=20), type='scan'),
        Reminder(user_id=user_id, reminder_text='Glucose Test', reminder_date=lmp + timedelta(weeks=26), type='test'),
        Reminder(user_id=user_id, reminder_text='Group B Strep Test', reminder_date=lmp + timedelta(weeks=36), type='test'),
    ]
    db.session.add_all(reminders)
    db.session.commit()

    return jsonify({"message": "Pregnancy info saved and reminders set."})

# communities
@mum_bp.route('/mums/communities/<int:id>/join', methods=['POST'])
@role_required("mum")
def join_community(id):
    user_id = get_jwt_identity()
    community = Community.query.get(id)
    if not community:
        return jsonify({"error": "Community not found"}), 404

    if user_id in [u.id for u in community.members]:
        return jsonify({"message": "Already joined"}), 200

    user = User.query.get(user_id)
    community.members.append(user)
    community.member_count += 1
    db.session.commit()

    return jsonify({"message": "Joined community successfully"})

# get community posts
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

# Get pregnancy info
@mum_bp.route('/mums/pregnancy-info', methods=['GET'])
@role_required("mum")
def get_pregnancy_info():
    print("🔐 JWT Claims:", get_jwt())          # <--- debug log
    print("👤 Identity:", get_jwt_identity())
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
        "due_date": pregnancy.due_date.strftime('%Y-%m-%d') if pregnancy.due_date else None,
        "current_week": pregnancy.current_week,
        "last_period_date": pregnancy.last_period_date.strftime('%Y-%m-%d') if pregnancy.last_period_date else None,
        "appointments": appointments
    })

# upload scan   
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

# Get uploaded scans
@mum_bp.route('/mums/scans', methods=['GET'])
@role_required("mum")
def get_uploaded_scans():
    user_id = get_jwt_identity()
    scans = MedicalUpload.query.filter_by(user_id=user_id).order_by(MedicalUpload.uploaded_at.desc()).all()
    return jsonify({
        "uploads": [{
            "id": scan.id,
            "file_url": scan.file_url,
            "notes": scan.notes,
            "uploaded_at": scan.uploaded_at.strftime('%Y-%m-%d')
        } for scan in scans]
    })

# Mom specialist link route
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
