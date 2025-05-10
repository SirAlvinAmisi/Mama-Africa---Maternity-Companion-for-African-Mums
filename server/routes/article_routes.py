from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Article, User, Profile
from sqlalchemy import desc

article_bp = Blueprint('article', __name__)

@article_bp.route('/articles', methods=['GET'])
def get_articles():
    articles = Article.query.join(User).join(Profile).filter(
        Article.is_approved == True,
        User.role == 'health_pro',
        Profile.is_verified == True
    ).order_by(desc(Article.created_at)).all()

    return jsonify({
        "articles": [{
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "category": a.category,
            "created_at": a.created_at.isoformat(),
            "author": a.author.profile.full_name if a.author and a.author.profile else "Unknown"
        } for a in articles]
    }), 200


@article_bp.route('/articles', methods=['POST'])
@jwt_required()
def post_article():
    data = request.get_json()
    title = data.get('title')
    category = data.get('category')
    content = data.get('content')

    article = Article(
        title=title,
        category=category,
        content=content,
        author_id=get_jwt_identity()
    )
    db.session.add(article)
    db.session.commit()

    return jsonify({"message": "Article created"}), 201

@article_bp.route('/articles/author/<int:author_id>', methods=['GET'])
def get_articles_by_author(author_id):
    articles = Article.query.filter_by(author_id=author_id, is_approved=True).all()
    return jsonify({"articles": [
        {
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "category": a.category,
            "created_at": a.created_at,
            "author_id": a.author_id
        } for a in articles
    ]})

@article_bp.route('/articles/<int:id>', methods=['GET'])
def get_article_by_id(id):
    article = Article.query.get(id)
    if not article or not article.is_approved:
        return {"error": "Article not found"}, 404
    return jsonify({"article": {
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "category": article.category,
        "created_at": article.created_at,
        "author_id": article.author_id
    }})

@article_bp.route('/parenting-articles', methods=['GET'])
def get_parenting_articles():
    articles = Article.query.filter_by(category='Parenting Development', is_approved=True).all()
    return jsonify({"articles": [a.serialize() for a in articles]})

@article_bp.route('/baby-articles', methods=['GET'])
def get_baby_articles():
    articles = Article.query.filter_by(category='Baby Corner', is_approved=True).all()
    return jsonify({"articles": [a.serialize() for a in articles]})

@article_bp.route('/articles/flagged', methods=['GET'])
@jwt_required()
def get_flagged_articles():
    flagged_articles = Article.query.filter_by(is_flagged=True).all()
    articles_data = [
        {
            "id": article.id,
            "title": article.title,
            "content": article.content,
            "is_flagged": article.is_flagged,
            "is_approved": article.is_approved,
        }
        for article in flagged_articles
    ]
    return jsonify({"flagged_articles": articles_data}), 200
