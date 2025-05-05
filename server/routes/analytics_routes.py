from flask import Blueprint, jsonify
from sqlalchemy import func
from models import db, User, Article, Question, PregnancyDetail

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/summary', methods=['GET'])
def summary():
    total_users = db.session.query(func.count(User.id)).scalar()
    roles = db.session.query(User.role, func.count(User.id)).group_by(User.role).all()
    articles = db.session.query(func.count(Article.id)).scalar()
    questions = db.session.query(func.count(Question.id)).scalar()

    return jsonify({
        "total_users": total_users,
        "roles": {r: c for r, c in roles},
        "total_articles": articles,
        "total_questions": questions
    })

@analytics_bp.route('/analytics/pregnancy-trimester', methods=['GET'])
def trimester_distribution():
    trimester_counts = {"first": 0, "second": 0, "third": 0, "post-term": 0}
    pregnancies = PregnancyDetail.query.all()

    for p in pregnancies:
        if p.current_week < 13:
            trimester_counts["first"] += 1
        elif p.current_week < 27:
            trimester_counts["second"] += 1
        elif p.current_week < 41:
            trimester_counts["third"] += 1
        else:
            trimester_counts["post-term"] += 1

    return jsonify(trimester_counts)

@analytics_bp.route('/analytics/questions-by-week', methods=['GET'])
def questions_by_week():
    results = db.session.query(
        func.date_trunc('week', Question.created_at).label('week'),
        func.count(Question.id)
    ).group_by('week').order_by('week').all()

    return jsonify([{"week": str(week.date()), "count": count} for week, count in results])
