from . import db
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Boolean, Table
from werkzeug.security import generate_password_hash, check_password_hash

# --- Association Tables ---
community_members = db.Table('community_members',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('community_id', db.Integer, db.ForeignKey('community.id'))
)

mum_topic_follow = db.Table('mum_topic_follow',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('topic_id', db.Integer, db.ForeignKey('topic.id'))
)

# --- User & Profile ---
class User(db.Model):
    id = db.Column(Integer, primary_key=True)
    email = db.Column(String(120), unique=True, nullable=False)
    password_hash = db.Column(Text, nullable=False)
    role = db.Column(String(50), nullable=False)  # 'admin', 'health_pro', 'mum'
    is_active = db.Column(Boolean, default=True)
    created_at = db.Column(DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    profile = db.relationship("Profile", backref="user", uselist=False, cascade="all, delete-orphan")
    pregnancy = db.relationship("PregnancyDetail", backref="user", uselist=False, cascade="all, delete-orphan")
    uploads = db.relationship("MedicalUpload", backref="user", cascade="all, delete-orphan")
    certifications = db.relationship("Certification", backref="user", cascade="all, delete-orphan")
    posts = db.relationship("Post", backref="author", cascade="all, delete-orphan")
    articles = db.relationship("Article", backref="author", cascade="all, delete-orphan")
    comments = db.relationship("Comment", backref="user", cascade="all, delete-orphan")
    reminders = db.relationship("Reminder", backref="user", cascade="all, delete-orphan")
    questions = db.relationship("Question", backref="asker", foreign_keys='Question.user_id', cascade="all, delete-orphan")
    answered_questions = db.relationship("Question", backref="responder", foreign_keys='Question.answered_by', cascade="all, delete-orphan")
    clinics = db.relationship("Clinic", backref="recommender", cascade="all, delete-orphan")
    messages_sent = db.relationship("Message", foreign_keys='Message.sender_id', backref="sender", cascade="all, delete-orphan")
    messages_received = db.relationship("Message", foreign_keys='Message.receiver_id', backref="receiver", cascade="all, delete-orphan")
    flags = db.relationship("FlagReport", backref="reporter", cascade="all, delete-orphan")
    shared_content = db.relationship("SharedContent", backref="user", cascade="all, delete-orphan")

    joined_communities = db.relationship("Community", secondary=community_members, back_populates="members")
    followed_topics = db.relationship("Topic", secondary=mum_topic_follow, back_populates="followers")

class Profile(db.Model):
    id = db.Column(Integer, primary_key=True)
    full_name = db.Column(String(150))
    bio = db.Column(Text)
    region = db.Column(String(100))  # County
    role = db.Column(String(50))     # 'health_pro', 'mum'
    profile_picture = db.Column(String(200))
    license_number = db.Column(String(100))  # For health professionals
    is_verified = db.Column(Boolean, default=False)
    user_id = db.Column(Integer, ForeignKey('user.id'))

# --- Pregnancy Tracking ---
class PregnancyDetail(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'), nullable=False)
    last_period_date = db.Column(Date)
    due_date = db.Column(Date)
    current_week = db.Column(Integer)
    pregnancy_status = db.Column(String(50))  # 'active', 'completed'

class Reminder(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'))
    reminder_text = db.Column(String(255))
    reminder_date = db.Column(DateTime)
    type = db.Column(String(50))  # 'checkup', 'scan', etc.

# --- Content ---
class Post(db.Model):
    id = db.Column(Integer, primary_key=True)
    author_id = db.Column(Integer, ForeignKey('user.id'))
    community_id = db.Column(Integer, ForeignKey('community.id'))
    title = db.Column(String(255))
    content = db.Column(Text)
    media_url = db.Column(String(200))
    created_at = db.Column(DateTime, default=datetime.utcnow)
    is_approved = db.Column(Boolean, default=False)

    comments = db.relationship("Comment", backref="post", cascade="all, delete-orphan")

class Article(db.Model):
    id = db.Column(Integer, primary_key=True)
    author_id = db.Column(Integer, ForeignKey('user.id'))
    title = db.Column(String(255))
    content = db.Column(Text)
    media_url = db.Column(String(200))
    category = db.Column(String(100))  # Nutrition, Mental Health...
    is_approved = db.Column(Boolean, default=False)
    flagged = db.Column(Boolean, default=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)

    comments = db.relationship("Comment", backref="article", cascade="all, delete-orphan")

class Comment(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'))
    post_id = db.Column(Integer, ForeignKey('post.id'))
    article_id = db.Column(Integer, ForeignKey('article.id'))
    content = db.Column(Text)
    created_at = db.Column(DateTime, default=datetime.utcnow)

class Question(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'))
    question_text = db.Column(Text)
    is_anonymous = db.Column(Boolean, default=False)
    answered_by = db.Column(Integer, ForeignKey('user.id'))
    answer_text = db.Column(Text)
    created_at = db.Column(DateTime, default=datetime.utcnow)

# --- Supplementary ---
class MedicalUpload(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'))
    file_url = db.Column(String(200))
    file_type = db.Column(String(50))
    uploaded_at = db.Column(DateTime, default=datetime.utcnow)
    notes = db.Column(Text)

class Certification(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'))
    file_url = db.Column(String(200))
    file_type = db.Column(String(100))
    uploaded_at = db.Column(DateTime, default=datetime.utcnow)
    is_verified = db.Column(Boolean, default=False)

class Clinic(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(150))
    location = db.Column(String(150))
    contact_info = db.Column(String(150))
    recommended_by = db.Column(Integer, ForeignKey('user.id'))

# --- Community, Topics, Flags ---
class Community(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(100), nullable=False)
    description = db.Column(String(255))
    image = db.Column(String(255))
    trimester = db.Column(Integer, nullable=True)
    member_count = db.Column(Integer, default=0)
    status = db.Column(db.String(50), default="pending")

    posts = db.relationship('Post', backref='community', cascade="all, delete-orphan")
    members = db.relationship('User', secondary=community_members, back_populates="joined_communities")

class Topic(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(100), nullable=False)
    description = db.Column(String(255))

    followers = db.relationship('User', secondary=mum_topic_follow, back_populates="followed_topics")

class FlagReport(db.Model):
    id = db.Column(Integer, primary_key=True)
    reporter_id = db.Column(Integer, ForeignKey('user.id'))
    content_type = db.Column(String(50))  # 'post', 'article', etc.
    content_id = db.Column(Integer)
    reason = db.Column(Text)
    reviewed = db.Column(Boolean, default=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)

# --- Weekly Baby Updates ---
class BabyWeekUpdate(db.Model):
    id = db.Column(Integer, primary_key=True)
    week_number = db.Column(Integer, nullable=False)
    baby_size_analogy = db.Column(String(100))
    development_note = db.Column(Text)
    mama_tip = db.Column(Text)
    proverb = db.Column(String(255))
    nutrition_tip = db.Column(Text)
    midwife_question = db.Column(Text)

# --- Nutrition Blog ---
class NutritionBlog(db.Model):
    id = db.Column(Integer, primary_key=True)
    title = db.Column(String(150), nullable=False)
    content = db.Column(Text, nullable=False)
    image_url = db.Column(String(255))
    category = db.Column(String(50))
    created_at = db.Column(DateTime, default=datetime.utcnow)
    author = db.Column(String(100))

# --- Messaging ---
class Message(db.Model):
    id = db.Column(Integer, primary_key=True)
    sender_id = db.Column(Integer, ForeignKey('user.id'))
    receiver_id = db.Column(Integer, ForeignKey('user.id'))
    message = db.Column(Text)
    created_at = db.Column(DateTime, default=datetime.utcnow)

# --- Content Sharing ---
class SharedContent(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'))
    content_type = db.Column(String(50))  # 'post', 'article'
    content_id = db.Column(Integer)
    shared_with = db.Column(String(255))
    shared_at = db.Column(DateTime, default=datetime.utcnow)
    
# --- Verifications ---
class VerificationRequest(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, db.ForeignKey('user.id'), nullable=False)  # the health pro
    is_resolved = db.Column(Boolean, default=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)

    user = db.relationship('User')

# --- Notifications ---
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    message = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255))  # Optional: link to article, question, etc.
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reminder_text = db.Column(db.String(255), nullable=False)
    reminder_date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(50), default='custom')  # e.g., test, checkup, support, etc.
