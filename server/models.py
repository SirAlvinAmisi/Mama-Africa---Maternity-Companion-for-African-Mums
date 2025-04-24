# from app import db
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()
 
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'admin', 'health_pro', 'mum'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    profile = db.relationship("Profile", backref="user", uselist=False)
    pregnancy = db.relationship("PregnancyDetail", backref="user", uselist=False)
    uploads = db.relationship("MedicalUpload", backref="user", lazy=True)
    posts = db.relationship("Post", backref="author", lazy=True)
    comments = db.relationship("Comment", backref="user", lazy=True)
    reminders = db.relationship("Reminder", backref="user", lazy=True)
    questions = db.relationship("Question", backref="asker", foreign_keys='Question.user_id', lazy=True)
    answered_questions = db.relationship("Question", backref="responder", foreign_keys='Question.answered_by', lazy=True)
    clinics = db.relationship("Clinic", backref="recommender", lazy=True)

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(120))
    dob = db.Column(db.Date)
    region = db.Column(db.String(100))
    profile_picture = db.Column(db.String(200))
    bio = db.Column(db.Text)

class PregnancyDetail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    last_period_date = db.Column(db.Date)
    due_date = db.Column(db.Date)
    current_week = db.Column(db.Integer)
    pregnancy_status = db.Column(db.String(50))  # 'active', 'completed'

class MedicalUpload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_url = db.Column(db.String(200))
    file_type = db.Column(db.String(50))  # scan, test result, etc.
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255))
    content = db.Column(db.Text)
    media_url = db.Column(db.String(200))
    is_medical = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(100))  # e.g., nutrition, mental_health
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    comments = db.relationship("Comment", backref="post", lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reminder_text = db.Column(db.String(255))
    reminder_date = db.Column(db.DateTime)
    type = db.Column(db.String(50))  # 'checkup', 'scan', etc.

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_text = db.Column(db.Text)
    is_anonymous = db.Column(db.Boolean, default=False)
    answered_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    answer_text = db.Column(db.Text, nullable=True)

class Clinic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    location = db.Column(db.String(150))
    contact_info = db.Column(db.String(150))
    recommended_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
