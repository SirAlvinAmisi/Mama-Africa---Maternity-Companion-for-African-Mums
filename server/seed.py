from app import db, app
from models import User, Profile, PregnancyDetail, MedicalUpload, Post, Comment, Reminder, Question, Clinic
from datetime import datetime, timedelta

with app.app_context():
    db.drop_all()
    db.create_all()

    # Users
    admin = User(email="admin@mama.africa", password_hash="hashed_admin", role="admin")
    doctor = User(email="doc@mama.africa", password_hash="hashed_doc", role="health_pro")
    mum = User(email="mum@mama.africa", password_hash="hashed_mum", role="mum")

    db.session.add_all([admin, doctor, mum])
    db.session.commit()

    # Profiles
    profile_admin = Profile(user_id=admin.id, full_name="Admin Z", region="Nairobi", bio="Platform admin")
    profile_doc = Profile(user_id=doctor.id, full_name="Dr. Karanja", region="Kisumu", bio="Obstetrician")
    profile_mum = Profile(user_id=mum.id, full_name="Amina M.", region="Mombasa", bio="Expecting mum")

    # Pregnancy
    pregnancy = PregnancyDetail(
        user_id=mum.id,
        last_period_date=datetime.now() - timedelta(days=60),
        due_date=datetime.now() + timedelta(days=180),
        current_week=9,
        pregnancy_status="active"
    )

    # Upload
    upload = MedicalUpload(
        user_id=mum.id,
        file_url="/uploads/scan1.jpg",
        file_type="scan",
        notes="8-week ultrasound"
    )

    # Post
    post = Post(
        author_id=doctor.id,
        title="Nutrition Tips for the 1st Trimester",
        content="Local vegetables like sukuma wiki are great...",
        is_medical=True,
        is_approved=True,
        category="nutrition"
    )

    # Comment
    comment = Comment(post_id=1, user_id=mum.id, content="This is super helpful, thank you!")

    # Reminder
    reminder = Reminder(
        user_id=mum.id,
        reminder_text="Ultrasound checkup",
        reminder_date=datetime.now() + timedelta(days=7),
        type="checkup"
    )

    # Question
    question = Question(
        user_id=mum.id,
        question_text="Is it safe to eat mango during pregnancy?",
        is_anonymous=True,
        answered_by=doctor.id,
        answer_text="Yes, mangoes are rich in Vitamin A and safe in moderation."
    )

    # Clinic
    clinic = Clinic(
        name="MumsCare Clinic",
        location="Machakos",
        contact_info="0722123456",
        recommended_by=doctor.id
    )

    db.session.add_all([
        profile_admin, profile_doc, profile_mum,
        pregnancy, upload, post, comment,
        reminder, question, clinic
    ])
    db.session.commit()

    print("✅ Database seeded successfully.")
