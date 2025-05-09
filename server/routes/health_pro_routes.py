from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, User, Article, Clinic, Question, Profile, VerificationRequest, Reminder, Notification
from flask_jwt_extended import get_jwt_identity, jwt_required
from middleware.auth import role_required
from utils.email_utils import send_email
from extensions import socketio
from dateutil.parser import isoparse

health_bp = Blueprint('health_pro', __name__)

# 1. GET all health professionals
@health_bp.route('/healthpros', methods=['GET'])
def get_healthpros():
    specialists = User.query.filter_by(role='health_pro').all()
    results = []
    for specialist in specialists:
        profile = specialist.profile
        results.append({
            "id": specialist.id,
            "full_name": profile.full_name,
            "speciality": profile.bio,
            "region": profile.region,
            "profile_picture": profile.profile_picture,
            "articles": [
                {
                    "title": article.title,
                    "category": article.category
                } for article in specialist.posts if article.is_medical and article.is_approved
            ]
        })
    return jsonify({"specialists": results})

# 2. GET single health pro
@health_bp.route('/healthpros/<int:id>', methods=['GET'])
def get_healthpro_by_id(id):
    specialist = User.query.filter_by(id=id, role='health_pro').first()
    if not specialist:
        return jsonify({"error": "Health professional not found"}), 404
    profile = specialist.profile
    return jsonify({
        "health_professional": {
            "id": specialist.id,
            "full_name": profile.full_name,
            "speciality": profile.bio,
            "region": profile.region,
            "profile_picture": profile.profile_picture,
            "articles": [
                {
                    "title": article.title,
                    "category": article.category
                } for article in specialist.posts if article.is_medical and article.is_approved
            ]
        }
    })

# 3. GET current health pro info
@health_bp.route('/healthpros/me', methods=['GET'])
@role_required("health_pro")
def health_pro_me():
    user = User.query.get(int(get_jwt_identity()))
    return {"email": user.email, "created_at": user.created_at}

# 4. POST update profile
@health_bp.route('/healthpros/profile', methods=['POST'])
@role_required("health_pro")
def update_healthpro_profile():
    data = request.get_json()
    user = User.query.get(get_jwt_identity())
    if not user.profile:
        user.profile = Profile(user_id=user.id)
    user.profile.bio = data.get('bio')
    user.profile.region = data.get('region')
    user.profile.profile_picture = data.get('profile_picture')
    db.session.commit()
    return jsonify({"message": "Profile updated"})

# 5. GET/POST articles
@health_bp.route('/healthpros/articles', methods=['GET', 'POST','OPTIONS'])
@role_required("health_pro")
def health_pro_articles():
    if request.method == 'OPTIONS':
        return '', 200  # respond to preflight check
    identity = get_jwt_identity()
    if request.method == 'GET':
        articles = Article.query.filter_by(author_id=identity).all()
        return jsonify({
            "articles": [
                {
                    "id": a.id,
                    "title": a.title,
                    "content": a.content,
                    "category": a.category,
                    "is_approved": a.is_approved,
                    "created_at": a.created_at
                } for a in articles
            ]
        })
    data = request.get_json()
    article = Article(
        author_id=identity,
        title=data['title'],
        content=data['content'],
        category=data['category'],
        is_approved=False
    )
    db.session.add(article)
    db.session.commit()
    return jsonify({"message": "Article submitted for approval"}), 201

# 6. PATCH/DELETE articles
@health_bp.route('/healthpros/articles/<int:article_id>', methods=['PATCH', 'DELETE', 'OPTIONS'])
@role_required("health_pro")
def update_or_delete_article(article_id):
    if request.method == 'OPTIONS':
        return '', 200  # respond to preflight check
    article = Article.query.get_or_404(article_id)
    if article.author_id != get_jwt_identity():
        return jsonify({"error": "Unauthorized"}), 403
    if request.method == 'PATCH':
        data = request.get_json()
        article.title = data.get('title', article.title)
        article.content = data.get('content', article.content)
        article.category = data.get('category', article.category)
        db.session.commit()
        return jsonify({"message": "Article updated"})
    db.session.delete(article)
    db.session.commit()
    return jsonify({"message": "Article deleted"})

# 7. GET unanswered questions
@health_bp.route('/healthpros/questions', methods=['GET'])
@role_required("health_pro")
def get_healthpro_questions():
    questions = Question.query.filter_by(doctor_id=None).all()
    return jsonify({
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "user_id": q.user_id,
                "is_anonymous": q.is_anonymous
            } for q in questions
        ]
    })

# 8. POST answer question
@health_bp.route('/healthpros/answers', methods=['POST'])
@role_required("health_pro")
def health_pro_answer():
    data = request.get_json()
    question = Question.query.get_or_404(data['question_id'])
    question.answer_text = data['answer_text']
    question.answered_by = get_jwt_identity()
    db.session.commit()
    return jsonify({"message": "Answer submitted"})

# 9. GET answered questions by me
@health_bp.route('/healthpros/my-answers', methods=['GET'])
@role_required("health_pro")
def get_my_answers():
    my_id = get_jwt_identity()
    answered = Question.query.filter_by(answered_by=my_id).all()
    return jsonify([{
        "id": q.id,
        "question_text": q.question_text,
        "answer_text": q.answer_text,
        "answered_at": q.updated_at.strftime('%Y-%m-%d') if q.updated_at else "N/A"
    } for q in answered])

# 10. POST clinic recommendation
@health_bp.route('/healthpros/recommendations', methods=['POST'])
@role_required("health_pro")
def recommend_clinic():
    data = request.get_json()
    identity = get_jwt_identity()
    clinic = Clinic(
        name=data['name'],
        location=data['location'],
        contact_info=data['contact_info'],
        recommended_by=identity
    )
    db.session.add(clinic)
    db.session.commit()
    return jsonify({"message": "Clinic recommendation added"})

# 11. POST flag article
@health_bp.route('/healthpros/flag_article/<int:article_id>', methods=['POST'])
@role_required("health_pro")
def flag_article(article_id):
    article = Article.query.get_or_404(article_id)
    article.flagged = True
    db.session.commit()
    return jsonify({"message": "Article flagged for review"})

# 12. POST verification request
@health_bp.route('/healthpro/request-verification', methods=['POST'])
@jwt_required()
@role_required("health_pro")
def request_verification():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
       
        if not user or not user.profile:
            return jsonify({"error": "Incomplete profile"}), 422

        profile = user.profile
        print("DEBUG PROFILE:", profile.full_name, profile.region)
        print(f"🔍 Request from: {user.email}, Role: {user.role}, FullName: '{profile.full_name}', Region: '{profile.region}'")

        if not profile.full_name or not profile.region:
            return jsonify({"error": "Full name and region are required in profile"}), 422

        existing = VerificationRequest.query.filter_by(user_id=current_user_id, is_resolved=False).first()
        if existing:
            return jsonify({"message": "Verification already requested"}), 400

        # Save verification request
        vr = VerificationRequest(user_id=current_user_id)
        db.session.add(vr)
        db.session.flush()  # To access vr.id before commit

        # Notify all admins
        for admin in User.query.filter_by(role="admin").all():
            db.session.add(Notification(
                user_id=admin.id,
                message=f"{profile.full_name} requested verification.",
                link="/admin/verification-requests"
            ))
            try:
                send_email(admin.email, "Verification Request", f"{profile.full_name} has requested verification.")
            except Exception as e:
                print("Email send failed:", e)

        # Emit via SocketIO
        from extensions import socketio
        socketio.emit('verification_request', {
            "user_id": current_user_id,
            "full_name": profile.full_name,
            "region": profile.region,
            "license_number": profile.license_number or "N/A",
            "request_id": vr.id
        })

        db.session.commit()
        return jsonify({"message": "Verification requested successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# 13. GET verification status
@health_bp.route('/healthpros/verification-status', methods=['GET'])
@role_required("health_pro")
def get_verification_status():
    user = User.query.get(get_jwt_identity())
    if not user or not user.profile:
        return jsonify({"error": "Profile not found"}), 404
    return jsonify({"is_verified": user.profile.is_verified})

# 14. GET/POST reminders
@health_bp.route('/healthpros/reminders', methods=['POST'])
@jwt_required()
@role_required("health_pro")
def add_healthpro_reminder():
    data = request.get_json()
    reminder_date = datetime.strptime(data.get("reminder_date"), '%Y-%m-%d')
    if reminder_date < datetime.utcnow():
        return jsonify({"error": "Cannot set reminder in the past"}), 400
    db.session.add(Reminder(
        user_id=get_jwt_identity(),
        reminder_text=data.get("reminder_text"),
        reminder_date=reminder_date,
        type="event"
    ))
    db.session.commit()
    return jsonify({"message": "Reminder added successfully"})

@health_bp.route('/healthpros/reminders', methods=['GET'])
@role_required("health_pro")
def get_healthpro_reminders():
    reminders = Reminder.query.filter_by(user_id=get_jwt_identity()).all()
    return jsonify([{
        "text": r.reminder_text,
        "date": r.reminder_date.strftime('%Y-%m-%d'),
        "type": r.type
    } for r in reminders])

# 15. GET flagged articles
@health_bp.route('/healthpros/flagged-articles', methods=['GET'])
@role_required("health_pro")
def get_flagged_articles():
    articles = Article.query.filter_by(flagged=True, author_id=get_jwt_identity()).all()
    return jsonify([{
        "id": a.id,
        "title": a.title,
        "status": "flagged"
    } for a in articles])

# 16. GET/patch notifications
@health_bp.route('/healthpros/notifications', methods=['GET'])
@role_required("health_pro")
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([{
        "id": n.id,
        "message": n.message,
        "link": n.link,
        "is_read": n.is_read,
        "created_at": n.created_at.strftime("%Y-%m-%d %H:%M")
    } for n in notifications])

@health_bp.route('/healthpros/notifications/<int:id>/read', methods=['PATCH'])
@role_required("health_pro")
def mark_notification_read(id):
    notif = Notification.query.filter_by(id=id, user_id=get_jwt_identity()).first_or_404()
    notif.is_read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read"})

# 17. GET stats
@health_bp.route('/healthpros/events', methods=['GET', 'POST', 'OPTIONS'])
@jwt_required()
@role_required("health_pro")
def create_event():
    if request.method == 'OPTIONS':
        return '', 200  # ✅ Respond to CORS preflight

    user_id = get_jwt_identity()

    if request.method == 'GET':
        reminders = Reminder.query.filter_by(user_id=user_id).all()
        return jsonify({
            "events": [
                {
                    "id": r.id,
                    "title": r.reminder_text,
                    "datetime": r.reminder_date.isoformat(),
                    "type": r.type
                } for r in reminders
            ]
        })

    if request.method == 'POST':
        try:
            data = request.get_json()
            print(" Incoming data:", data) 
            
            title = data['title']
            event_type = data['type']
            # dt = datetime.fromisoformat(data['datetime'])  # ISO format from frontend
            dt = isoparse(data['datetime']).replace(tzinfo=None) 

            if dt < datetime.utcnow():
                return jsonify({"error": "Cannot schedule event in the past"}), 400

            reminder = Reminder(
                user_id=user_id,
                reminder_text=title,
                reminder_date=dt,
                type=event_type
            )
            db.session.add(reminder)
            db.session.commit()

            return jsonify({
                "event": {
                    "id": reminder.id,
                    "title": reminder.reminder_text,
                    "datetime": reminder.reminder_date.isoformat(),
                    "type": reminder.type
                }
            }), 201

        except Exception as e:
            print("❌ ERROR:", e) 
            return jsonify({"error": str(e)}), 500



# @health_bp.route('/healthpros/events', methods=['GET'])
# @jwt_required()
# @role_required("health_pro")
# def get_my_events():
#     user_id = get_jwt_identity()
#     reminders = Reminder.query.filter_by(user_id=user_id).all()

#     return jsonify({
#         "events": [
#             {
#                 "id": r.id,
#                 "title": r.reminder_text,
#                 "datetime": r.reminder_date.isoformat(),
#                 "type": r.type
#             } for r in reminders
#         ]
#     })
