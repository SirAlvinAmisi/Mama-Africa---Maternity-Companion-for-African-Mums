from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import NutritionBlog, Nutrition

nutrition_bp = Blueprint('nutrition', __name__)

@nutrition_bp.route('/api/nutrition-blogs', methods=['GET'])
def get_blogs():
    blogs = NutritionBlog.query.all()
    data = [
        {
            "id": blog.id,
            "title": blog.title,
            "content": blog.content,
            "image_url": blog.image_url,
            "category": blog.category,
            "author": blog.author,
            "created_at": blog.created_at.strftime("%Y-%m-%d")
        } for blog in blogs
    ]
    return jsonify(data), 200
@nutrition_bp.route('/api/nutrition', methods=['GET'])
@jwt_required()
def get_weekly_nutrition():
    week = int(request.args.get('week', 1))
    print("✅ JWT received:", get_jwt())
    rec = Nutrition.query.filter_by(week=week).first()
    if not rec:
        return jsonify({"error": "No data for that week"}), 404
    return jsonify({
        "week": rec.week,
        "nutrients": rec.nutrients,
        "food_suggestions": rec.food_suggestions
    })

