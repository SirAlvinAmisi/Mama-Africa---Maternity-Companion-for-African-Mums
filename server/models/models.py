from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

#Join table for many-to-many relationship
community_members = db.Table('community_members',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('community_id', db.Integer, db.ForeignKey('community.id'))
)   

# User Management
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # password_hash = db.Column(db.String(128), nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

    role = db.Column(db.String(50), nullable=False)  # 'admin', 'health_pro', 'mum'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Password handling
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Relationships
    profile = db.relationship("Profile", backref="user", uselist=False)
    pregnancy = db.relationship("PregnancyDetail", backref="user", uselist=False)
    uploads = db.relationship("MedicalUpload", backref="user", lazy=True)
    posts = db.relationship("Post", backref="author", lazy=True)
    articles = db.relationship("Article", backref="author", lazy=True)
    comments = db.relationship("Comment", backref="user", lazy=True)
    reminders = db.relationship("Reminder", backref="user", lazy=True)
    questions = db.relationship("Question", backref="asker", foreign_keys='Question.user_id', lazy=True)
    answered_questions = db.relationship("Question", backref="responder", foreign_keys='Question.answered_by', lazy=True)
    clinics = db.relationship("Clinic", backref="recommender", lazy=True)


# Profile & Pregnancy
# class Profile(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     full_name = db.Column(db.String(120))
#     dob = db.Column(db.Date)
#     region = db.Column(db.String(100))
#     profile_picture = db.Column(db.String(200))
#     bio = db.Column(db.Text)
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150))
    bio = db.Column(db.Text)
    region = db.Column(db.String(100))  # This is your county field
    role = db.Column(db.String(50))  # 'health_pro', 'mum'
    profile_picture = db.Column(db.String(200))  # Avatar URL
    license_number = db.Column(db.String(100), nullable=True)  # Only for doctors
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class PregnancyDetail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    last_period_date = db.Column(db.Date)
    due_date = db.Column(db.Date)
    current_week = db.Column(db.Integer)
    pregnancy_status = db.Column(db.String(50))  # 'active', 'completed'


# Uploads
class MedicalUpload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_url = db.Column(db.String(200))
    file_type = db.Column(db.String(50))  # scan, test result, etc.
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)


# Content Models
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    community_id = db.Column(db.Integer, db.ForeignKey('community.id'), nullable=True)  # optional
    title = db.Column(db.String(255))
    content = db.Column(db.Text)
    media_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    comments = db.relationship("Comment", backref="post", lazy=True)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Health professional
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(200))  # Optional: video, images
    category = db.Column(db.String(100))   # e.g., Nutrition, Mental Health, Exercise
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    comments = db.relationship("Comment", backref="article", lazy=True)


# Comment Model (supports both Posts and Articles)
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=True)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=True)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# Reminders
class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reminder_text = db.Column(db.String(255))
    reminder_date = db.Column(db.DateTime)
    type = db.Column(db.String(50))  # 'checkup', 'scan', etc.

# Questions
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_text = db.Column(db.Text)
    is_anonymous = db.Column(db.Boolean, default=False)
    answered_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    answer_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# Clinics
class Clinic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    location = db.Column(db.String(150))
    contact_info = db.Column(db.String(150))
    recommended_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


# Communities
class Community(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))
    member_count = db.Column(db.Integer, default=0) 
    posts = db.relationship('Post', backref='community', lazy=True)
    members = db.relationship('User', secondary='community_members', backref='joined_communities')
 
# Nutrition Blogs
class NutritionBlog(db.Model):
    __tablename__ = 'nutrition_blogs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(50))  # e.g., expert, seasonal, concern
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author = db.Column(db.String(100))
