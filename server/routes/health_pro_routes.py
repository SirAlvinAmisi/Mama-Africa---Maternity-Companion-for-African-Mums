from flask import Blueprint, request, jsonify
from models import db, User, Article, Clinic, Question, Profile, VerificationRequest
from flask_jwt_extended import get_jwt_identity, jwt_required
from middleware.auth import role_required
# from extensions import socketio 
# from app import socketio

health_bp = Blueprint('health_pro', __name__)

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

@health_bp.route('/healthpros/<int:id>', methods=['GET'])
def get_healthpro_by_id(id):
    specialist = User.query.filter_by(id=id, role='health_pro').first()
    if not specialist:
        return jsonify({"error": "Health professional not found"}), 404

    profile = specialist.profile
    result = {
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
    return jsonify({"health_professional": result})


@health_bp.route('/healthpros/me', methods=['GET'])
@role_required("health_pro")
def health_pro_me():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    return {"email": user.email, "created_at": user.created_at}

@health_bp.route('/healthpros/articles', methods=['GET', 'POST'])
@role_required("health_pro")
def health_pro_articles():
    identity = get_jwt_identity()

    if request.method == 'GET':
        articles = Article.query.filter_by(author_id=int(identity)).all()
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
        author_id=int(identity),
        title=data['title'],
        content=data['content'],
        category=data['category'],
        is_approved=False
    )
    db.session.add(article)
    db.session.commit()
    return jsonify({"message": "Article submitted for approval"}), 201

@health_bp.route('/healthpros/questions', methods=['GET'])
@role_required("health_pro")
def get_healthpro_questions():
    questions = Question.query.filter_by(answered_by=None).all()
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

@health_bp.route('/healthpros/answers', methods=['POST'])
@role_required("health_pro")
def health_pro_answer():
    data = request.get_json()
    question = Question.query.get_or_404(data['question_id'])
    question.answer_text = data['answer_text']
    question.answered_by = get_jwt_identity()
    db.session.commit()
    return jsonify({"message": "Answer submitted"})

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

@health_bp.route('/healthpros/flag_article/<int:article_id>', methods=['POST'])
@role_required("health_pro")
def flag_article(article_id):
    article = Article.query.get_or_404(article_id)
    article.flagged = True
    db.session.commit()
    # Optionally send notification to admin (e.g., via Notification model)
    return jsonify({"message": "Article flagged for review"})

@health_bp.route('/healthpro/request-verification', methods=['POST'])
@jwt_required()
@role_required("health_pro")
def request_verification():
    from app import socketio
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or not current_user.profile:
        return jsonify({"error": "User not found"}), 404

    existing_request = VerificationRequest.query.filter_by(
        user_id=current_user_id, is_resolved=False).first()

    if existing_request:
        return jsonify({"message": "Verification already requested."}), 400

    new_request = VerificationRequest(user_id=current_user_id)
    db.session.add(new_request)
    db.session.commit()

    socketio.emit('verification_request', {
        "user_id": current_user_id,
        "full_name": current_user.profile.full_name,
        "region": current_user.profile.region,
        "license_number": current_user.profile.license_number
    })

    return jsonify({"message": "Verification requested successfully."})
