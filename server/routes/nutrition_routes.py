from flask import Blueprint, jsonify
from models import NutritionBlog

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
