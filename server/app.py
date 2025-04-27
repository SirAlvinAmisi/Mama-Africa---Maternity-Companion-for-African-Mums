from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import timedelta
from dotenv import load_dotenv
from functools import wraps
import os
from models import *

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    #configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = "super-secret-key"  # Replace with secure value in prod
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for now

    
    # First we need to check role of the user
    def role_required(required_role):
        def decorator(f):
            @wraps(f)
            @jwt_required()
            def wrapper(*args, **kwargs):
                identity = get_jwt_identity()
                if identity['role'] != required_role:
                    return jsonify({"error": "Unauthorized"}), 403
                return f(*args, **kwargs)
            return wrapper
        return decorator
    
    # =============== API Endpoints ======================================
    # Index
    @app.route('/')
    def index():
        return "Welcome to Mama Afrika!"

    # All Profiles
    @app.route('/profile')
    def get_profile():
        users = Profile.query.all()
        return {
            "users": [
                {
                    "id": user.id,
                    "full_name": user.full_name,
                    "region": user.region,
                    "bio": user.bio
                } for user in users
            ]
        }

    # Health Professionals 
    @app.route('/healthpros', methods=['GET'])
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

    
    # Communities
    @app.route('/communities', methods=['GET'])
    def get_communities():
        communities = Community.query.all()
        return {
            "communities": [
                {
                    "id": c.id,
                    "name": c.name,
                    "description": c.description
                } for c in communities
            ]
        }
    

    # all clinics
    @app.route('/clinics')
    def get_clinics():
        clinics = Clinic.query.all()
        return {
            "clinics": [
                {
                    "id": clinic.id,
                    "name": clinic.name,
                    "location": clinic.location,
                    "contact_info": clinic.contact_info
                } for clinic in clinics
            ]
        }
        
    # all Uploads (might require authentication to add later)
    @app.route('/uploads')
    def get_uploads():
        uploads = MedicalUpload.query.all()
        return {
            "uploads": [
                {
                    "id": upload.id,
                    "file_url": upload.file_url,
                    "file_type": upload.file_type,
                    "notes": upload.notes
                } for upload in uploads
            ]
        }
        
    # All Posts
    @app.route('/posts')
    def get_posts():
        posts = Post.query.all()
        return {
            "posts": [
                {
                    "id": post.id,
                    "title": post.title,
                    "content": post.content,
                    "is_medical": post.is_medical,
                    "is_approved": post.is_approved,
                    "category": post.category
                } for post in posts
            ]
        }
    # all Comments
    @app.route('/comments')
    def get_comments():
        comments = Comment.query.all()
        return {
            "comments": [
                {
                    "id": comment.id,
                    "post_id": comment.post_id,
                    "user_id": comment.user_id,
                    "content": comment.content
                } for comment in comments
            ]
        }
    
    @app.route('/articles', methods=['GET'])
    def get_articles():
        articles = Article.query.filter_by(is_approved=True).all()
        return {
            "articles": [
                {
                    "id": article.id,
                    "title": article.title,
                    "content": article.content,
                    "category": article.category,
                    "created_at": article.created_at,
                    "author_id": article.author_id
                } for article in articles
            ]
        }
    
    # ========= Authentication and User Management ================
    # Signup
    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already registered"}), 400
        user = User(email=data['email'], role=data['role'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered"}), 201

    # Login
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            token = create_access_token(identity={"id": user.id, "role": user.role})
            return jsonify(access_token=token)
        return jsonify({"error": "Invalid credentials"}), 401

    # individual user profile
    @app.route('/me', methods=['GET'])
    @jwt_required()
    def get_me():
        identity = get_jwt_identity()
        user = User.query.get(identity['id'])
        return {
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at
        }

    # Admin add user
    @app.route('/admin/add_user', methods=['POST'])
    @role_required("admin")
    def add_user():
        data = request.get_json()
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "User already exists"}), 400
        user = User(email=data['email'], role=data['role'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": f"{data['role']} added"}), 201

    # Admin delete user   
    @app.route('/admin/deactivate_user/<int:user_id>', methods=['PATCH'])
    @role_required("admin")
    def deactivate_user(user_id):
        user = User.query.get_or_404(user_id)
        user.is_active = False
        db.session.commit()
        return jsonify({"message": "User deactivated"})

    # Admin remove content
    @app.route('/admin/remove_content/<int:content_id>', methods=['DELETE'])
    @role_required("admin")
    def remove_content(content_id):
        post = Post.query.get_or_404(content_id)
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Content removed"})

    # Admin approve content
    @app.route('/admin/approve_content/<int:content_id>', methods=['POST'])
    @role_required("admin")
    def approve_content(content_id):
        post = Post.query.get_or_404(content_id)
        post.is_approved = True
        db.session.commit()
        return jsonify({"message": "Content approved"})

    # Admin add category
    @app.route('/admin/add_category', methods=['POST'])
    @role_required("admin")
    def add_category():
        data = request.get_json()
        return jsonify({"message": f"Category '{data['category']}' recorded (stub)"}), 200
    
    #Admin to approve Articles
    @app.route('/admin/approve_article/<int:article_id>', methods=['POST'])
    @role_required("admin")
    def approve_article(article_id):
        article = Article.query.get_or_404(article_id)
        article.is_approved = True
        db.session.commit()
        return jsonify({"message": "Article approved"}), 200
    
    # Health Professionals Registration 
    @app.route('/healthpros/register', methods=['POST'])
    def register_health_pro():
        data = request.get_json()
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "User already exists"}), 400
        user = User(email=data['email'], role="health_pro")
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Health Professional registered"}), 201

    # Health Professionals Profile
    @app.route('/healthpros/me', methods=['GET'])
    @role_required("health_pro")
    def health_pro_me():
        identity = get_jwt_identity()
        user = User.query.get(identity['id'])
        return {"email": user.email, "created_at": user.created_at}

    # Health Professionals Post article
    @app.route('/healthpros/articles', methods=['POST'])
    @role_required("health_pro")
    def health_pro_article():
        data = request.get_json()
        identity = get_jwt_identity()
        article = Article(
            author_id=identity['id'],
            title=data['title'],
            content=data['content'],
            category=data['category'],
            is_approved=False  # Articles must be approved first
        )
        db.session.add(article)
        db.session.commit()
        return jsonify({"message": "Article submitted for approval"}), 201
    
    # Health Professionals Answer questions
    @app.route('/healthpros/answers', methods=['POST'])
    @role_required("health_pro")
    def health_pro_answer():
        data = request.get_json()
        question = Question.query.get_or_404(data['question_id'])
        question.answer_text = data['answer_text']
        question.answered_by = get_jwt_identity()['id']
        db.session.commit()
        return jsonify({"message": "Answer submitted"}), 200
    
    # Health Professionals Recommendations
    @app.route('/healthpros/recommendations', methods=['POST'])
    @role_required("health_pro")
    def recommend_clinic():
        data = request.get_json()
        identity = get_jwt_identity()
        clinic = Clinic(name=data['name'], location=data['location'],
                        contact_info=data['contact_info'], recommended_by=identity['id'])
        db.session.add(clinic)
        db.session.commit()
        return jsonify({"message": "Clinic recommendation added"}), 201

    # Mums registration
    @app.route('/mums/register', methods=['POST'])
    def register_mum():
        data = request.get_json()
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "User already exists"}), 400
        user = User(email=data['email'], role="mum")
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "Mum registered successfully"}), 201
    
    # Mums Profile
    @app.route('/mums/profile', methods=['POST'])
    @role_required("mum")
    def update_mum_profile():
        data = request.get_json()
        identity = get_jwt_identity()
        profile = Profile(user_id=identity['id'], full_name=data['full_name'],
                          region=data['region'], bio=data.get('bio'))
        db.session.add(profile)
        db.session.commit()
        return jsonify({"message": "Profile created"}), 201
    
    # Mums Update Profile
    @app.route('/mums/pregnancy', methods=['POST'])
    @role_required("mum")
    def add_pregnancy_details():
        data = request.get_json()
        identity = get_jwt_identity()
        pregnancy = PregnancyDetail(
            user_id=identity['id'],
            last_period_date=data['last_period_date'],
            due_date=data['due_date'],
            current_week=data['current_week'],
            pregnancy_status=data['pregnancy_status']
        )
        db.session.add(pregnancy)
        db.session.commit()
        return jsonify({"message": "Pregnancy details added"}), 201
    
    # Mums Get Pregnancy Details
    @app.route('/mums/fetal_development', methods=['GET'])
    @role_required("mum")
    def fetal_development():
        return jsonify({"tip": "Your baby is growing strong — eat healthy!"})
    
    # Mums Get Reminders
    @app.route('/mums/reminders', methods=['GET'])
    @role_required("mum")
    def get_reminders():
        identity = get_jwt_identity()
        reminders = Reminder.query.filter_by(user_id=identity['id']).all()
        return {"reminders": [{"text": r.reminder_text, "date": r.reminder_date} for r in reminders]}

    # Mums upload medical files
    @app.route('/mums/upload_scan', methods=['POST'])
    @role_required("mum")
    def upload_scan():
        data = request.get_json()
        identity = get_jwt_identity()
        upload = MedicalUpload(user_id=identity['id'], file_url=data['file_url'],
                               file_type="scan", notes=data['notes'])
        db.session.add(upload)
        db.session.commit()
        return jsonify({"message": "Scan uploaded"}), 201

    # Mums ask questions
    @app.route('/mums/questions', methods=['POST'])
    @role_required("mum")
    def ask_question():
        data = request.get_json()
        identity = get_jwt_identity()
        question = Question(user_id=identity['id'], question_text=data['question_text'],
                            is_anonymous=data.get('is_anonymous', False))
        db.session.add(question)
        db.session.commit()
        return jsonify({"message": "Question posted"}), 201
   
    # Mums view answers and articles
    @app.route('/mums/content', methods=['GET'])
    @role_required("mum")
    def view_content():
        posts = Post.query.all()
        articles = Article.query.filter_by(is_approved=True).all()
        return {
            "posts": [{"title": p.title, "content": p.content} for p in posts],
            "articles": [{"title": a.title, "content": a.content, "category": a.category} for a in articles]
    }

    return app

app = create_app()



if __name__ == "__main__":
    app.run(debug=True)