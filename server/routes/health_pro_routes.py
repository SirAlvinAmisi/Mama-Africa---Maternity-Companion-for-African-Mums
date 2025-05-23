# server/routes/health_pro_routes.py
from datetime import datetime
from flask import Blueprint, request, jsonify
from models import db, User, Article, Clinic, Question, Profile, VerificationRequest, Reminder, Notification, Comment, Post, MedicalUpload
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename
import os
from flask import current_app
from middleware.auth import role_required
from utils.email_utils import send_email
from extensions import socketio
from dateutil.parser import isoparse
from flask_cors import cross_origin
health_bp = Blueprint('health_pro', __name__)

# 1. GET all health professionals
@health_bp.route('/healthpros', methods=['GET'])
def get_healthpros():
    # specialists = User.query.filter_by(role='health_pro').all()
    specialists = User.query.filter_by(role='health_pro').join(Profile).filter(Profile.is_verified == True).all()
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
    # specialist = User.query.filter_by(id=id, role='health_pro').first()
    specialist = User.query.filter_by(id=id, role='health_pro').join(Profile).filter(Profile.is_verified == True).first()
    if not specialist or not specialist.profile or not specialist.profile.is_verified:
        return jsonify({"error": "Health professional not verified"}), 403

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
# @health_bp.route('/healthpros/me', methods=['GET'])
# @role_required("health_pro")
# def health_pro_me():
#     user = User.query.get(int(get_jwt_identity()))
#     return {"email": user.email, "created_at": user.created_at}
@health_bp.route('/healthpros/me', methods=['GET'])
@role_required("health_pro")
def health_pro_me():
    user = User.query.get(int(get_jwt_identity()))
    return {
        "email": user.email,
        "created_at": user.created_at,
        "full_name": user.profile.full_name if user.profile else "",
        "region": user.profile.region if user.profile else "",
        "is_verified": user.profile.is_verified if user.profile else False
    }


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
# @health_bp.route('/healthpros/articles', methods=['GET', 'POST','OPTIONS'])
# @role_required("health_pro")
@health_bp.route('/healthpros/articles', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"], supports_credentials=True)
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
    doctor_id = get_jwt_identity()
    questions = Question.query.filter_by(doctor_id=doctor_id).all()

    return jsonify({
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "user_id": q.user_id,
                "is_anonymous": q.is_anonymous,
                "answer_text": q.answer_text,
                "is_answered": q.is_answered,
                "date": q.created_at.strftime('%Y-%m-%d'),
                "question": q.question_text,
                "answered": bool(q.answer_text),
                "answer": q.answer_text or "",
                "user": "Anonymous" if q.is_anonymous else (
                    User.query.get(q.user_id).profile.full_name if User.query.get(q.user_id) else "Unknown"
                ),
                "answeredBy": User.query.get(q.doctor_id).profile.full_name if q.doctor_id else None
            }
            for q in questions
        ]
    })



# 8. POST answer question
@health_bp.route('/healthpros/answers', methods=['POST'])
@role_required("health_pro")
def health_pro_answer():
    data = request.get_json()
    question = Question.query.get_or_404(data['question_id'])
    
    # Update answer info
    question.answer_text = data['answer_text']
    question.answered_by = get_jwt_identity()
    question.is_answered = True

    db.session.commit()

    # Optional: send notification to mum
    from utils.notification_utils import create_and_emit_notification

    if question.user_id:
        create_and_emit_notification(
            user_id=question.user_id,
            message="Your question has been answered by a doctor!",
            link="/mum/questions",
            room=f"user_{question.user_id}"
        )

    return jsonify({
        "message": "Answer submitted",
        "question": {
            "id": question.id,
            "question_text": question.question_text,
            "answer": question.answer_text,
            "answered": True
        }
    })


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

        if not profile.full_name or not profile.region or not profile.license_number:
            return jsonify({"error": "Full name, region, and license number required"}), 422

        existing = VerificationRequest.query.filter_by(user_id=current_user_id, is_resolved=False).first()
        if existing:
            return jsonify({"message": "Verification already requested"}), 400

        # Save verification request
        vr = VerificationRequest(user_id=current_user_id)
        db.session.add(vr)
        db.session.flush()

        # ✅ Create DB notifications & emit socket event
        from utils.notification_utils import create_and_emit_notification
        from utils.email_utils import send_email

        admins = User.query.filter_by(role="admin").all()
        for admin in admins:
            create_and_emit_notification(
                user_id=admin.id,
                message=f"Verification request from {profile.full_name} ({profile.license_number}) in {profile.region}",
                link="/admin/verification-requests",
                room="admin"
            )
            try:
                send_email(
                    admin.email,
                    "Verification Request",
                    f"{profile.full_name} ({profile.license_number}) in {profile.region} has requested verification."
                )
            except Exception as e:
                print("Email send failed:", e)

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


@health_bp.route("/healthpro/group-posts-with-comments", methods=["GET"])
@cross_origin(origins=["https://mama-africa.onrender.com", "http://localhost:5173", "http://127.0.0.1:5173"])
@jwt_required()
@role_required("health_pro")
def get_group_posts_with_comments():
    from models import Post, Comment, User, Community

    posts = Post.query \
        .join(User, Post.author_id == User.id) \
        .join(Profile, Profile.user_id == User.id) \
        .add_columns(
            Post.id.label("post_id"),
            Post.content,
            Post.media_url,
            Post.media_type,
            Post.created_at,
            Profile.full_name.label("user_name"),  # ✅ Correct usage
            Community.name.label("group_name"),
        )\
        .order_by(Post.created_at.desc()) \
        .all()

    post_map = {}
    for row in posts:
        post_id = row.post_id
        if post_id not in post_map:
            post_map[post_id] = {
                "id": post_id,
                "content": row.content,
                "media_url": row.media_url,
                "media_type": row.media_type,
                "created_at": row.created_at,
                "user_name": row.user_name,
                "group_name": row.group_name,
                "comments": [],
            }

    # Fetch comments (with user info)
    comments = Comment.query \
        .join(User, Comment.user_id == User.id) \
        .add_columns(
            Comment.id,
            Comment.content,
            Comment.created_at,
            Comment.post_id,
            User.name.label("user_name")
        ) \
        .order_by(Comment.created_at.asc()) \
        .all()

    for c in comments:
        comment_data = {
            "id": c.id,
            "content": c.content,
            "created_at": c.created_at,
            "user_name": c.user_name,
        }
        if c.post_id in post_map:
            post_map[c.post_id]["comments"].append(comment_data)

    return jsonify({"posts": list(post_map.values())}), 200



@health_bp.route('/upload_scan', methods=['POST'])
@jwt_required()
@role_required("health_pro")
def upload_scan():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        upload_folder = os.path.join(current_app.root_path, 'static/uploads')
        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Construct file URL (adjust depending on static route)
        file_url = f"/static/uploads/{filename}"
        user_id = get_jwt_identity()

        upload = MedicalUpload(
            user_id=user_id,
            doctor_id=user_id,
            file_url=file_url,
            file_type=file.content_type,
            notes=request.form.get("description")
        )
        db.session.add(upload)
        db.session.commit()

        return jsonify({"message": "Scan uploaded successfully", "scan": {
            "id": upload.id,
            "file_url": file_url,
            "file_type": upload.file_type,
            "notes": upload.notes,
            "uploaded_at": upload.uploaded_at.strftime("%Y-%m-%d %H:%M")
        }}), 201

@health_bp.route('/scans', methods=['GET'])
@jwt_required()
@role_required("health_pro")
def get_uploaded_scans():
    doctor_id = get_jwt_identity()
    scans = MedicalUpload.query.filter_by(doctor_id=doctor_id).order_by(MedicalUpload.uploaded_at.desc()).all()
    return jsonify({
        "scans": [{
            "id": scan.id,
            "file_url": scan.file_url,
            "file_type": scan.file_type,
            "description": scan.notes,
            "uploaded_at": scan.uploaded_at.strftime("%Y-%m-%d %H:%M")
        } for scan in scans]
    }), 200

@health_bp.route('/scans/<int:doctor_id>', methods=['GET'])
def get_scans_by_health_pro_id(doctor_id):
    scans = MedicalUpload.query.filter_by(doctor_id=doctor_id).order_by(MedicalUpload.uploaded_at.desc()).all()
    return jsonify({
        "uploads": [{
            "id": scan.id,
            "file_url": scan.file_url,
            "file_type": scan.file_type,
            "description": scan.notes,
            "uploaded_at": scan.uploaded_at.strftime("%Y-%m-%d %H:%M")
        } for scan in scans]
    }), 200
