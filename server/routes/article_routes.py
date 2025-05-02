from flask import Blueprint, request, jsonify
from models import Article
from sqlalchemy import desc

article_bp = Blueprint('article', __name__)

@article_bp.route('/articles', methods=['GET'])
def get_articles():
    limit = request.args.get('limit', default=None, type=int)
    query = Article.query.filter_by(is_approved=True).order_by(desc(Article.created_at))
    articles = query.limit(limit).all() if limit else query.all()
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

@article_bp.route('/parenting-articles')
def get_parenting_articles():
    articles = Article.query.filter_by(category='Parenting Development', is_approved=True).all()
    return jsonify({"articles": [a.serialize() for a in articles]})

@article_bp.route('/baby-articles')
def get_baby_articles():
    articles = Article.query.filter_by(category='Baby Corner', is_approved=True).all()
    return jsonify({"articles": [a.serialize() for a in articles]})
