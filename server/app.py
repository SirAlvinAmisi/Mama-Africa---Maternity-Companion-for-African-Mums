from flask import Flask
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from models import *

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    Migrate(app, db)
    
    @app.route('/')
    def index():
        return "Welcome to Mama Afrika!"

    # Profiles
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

    # clinics
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
        
    # Uploads
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
    # Posts
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
    # Comments
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
    

    return app

app = create_app()



if __name__ == "__main__":
    app.run(debug=True)
