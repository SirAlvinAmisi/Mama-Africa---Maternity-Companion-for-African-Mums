from app import db, app
from models import *
from models.models import Nutrition
from datetime import datetime, timedelta
import random
from sqlalchemy import text

with app.app_context():
    db.drop_all()
    db.create_all()

    # 1. ADMIN
    admin = User(email="admin@mama.africa", password_hash="hashed_admin", role="admin")
    db.session.add(admin)
    db.session.commit()

    # 2. HEALTH SPECIALISTS
    specialists_data = [
        {
            "email": "dr.ouma@mama.africa",
            "full_name": "Dr. Auma Odhiambo",
            "region": "Kisumu",
            "speciality": "Maternal-Fetal Medicine Specialist",
            "profile_picture": "https://i.pinimg.com/736x/97/96/0f/97960f9d817738d322a6b1b02f05c6b7.jpg"
        },
        # … the other 9 specialists …
    ]

    specialist_users = []
    for spec in specialists_data:
        user = User(email=spec["email"], password_hash="hashed_specialist", role="health_pro")
        db.session.add(user)
        db.session.flush()  # assign user.id
        profile = Profile(
            user_id=user.id,
            full_name=spec["full_name"],
            region=spec["region"],
            bio=spec["speciality"],
            profile_picture=spec["profile_picture"]
        )
        db.session.add(profile)
        specialist_users.append(user)
    db.session.commit()

    # 3. ARTICLES for each specialist
    sample_articles = [
        ("Nutrition Tips During Pregnancy", "Pregnancy"),
        ("Managing High Blood Pressure", "Health"),
        # … other articles …
    ]
    articles = []
    for specialist in specialist_users:
        for title, category in random.sample(sample_articles, 2):
            articles.append(Article(
                author_id=specialist.id,
                title=title,
                content=f"This is a helpful article about {category.lower()} authored by {specialist.profile.full_name}.",
                category=category,
                is_approved=True
            ))
    db.session.add_all(articles)
    db.session.commit()

    # 4. MUMS
    mums = [
        ("amina@mama.africa", "Amina Mohamed", "Mombasa", "First-time mum, excited and curious!", "https://i.pinimg.com/736x/6e/c7/aa/6ec7aa67461bec0c0c9c73287d6187b1.jpg"),
        # … other mums …
    ]
    mum_users = []
    for email, name, region, bio, pic in mums:
        user = User(email=email, password_hash="hashed_mum", role="mum")
        db.session.add(user)
        db.session.flush()
        Profile(user_id=user.id, full_name=name, region=region, bio=bio, profile_picture=pic)
        mum_users.append(user)
    db.session.commit()

    # 5. PREGNANCY DETAILS
    pregnancy_records = [
        (mum_users[0].id, 8),
        # … other records …
    ]
    pregnancies = []
    for user_id, weeks in pregnancy_records:
        pregnancies.append(PregnancyDetail(
            user_id=user_id,
            last_period_date=datetime.now() - timedelta(weeks=weeks),
            due_date=datetime.now() + timedelta(weeks=(40 - weeks)),
            current_week=weeks,
            pregnancy_status="active"
        ))
    db.session.add_all(pregnancies)
    db.session.commit()

    # 6. REMINDERS
    all_reminders = []
    for user, preg in zip(mum_users, pregnancies):
        lmp = preg.last_period_date
        # … build the Reminder(...) entries …
    db.session.add_all(all_reminders)
    db.session.commit()

    # 7. MEDICAL UPLOADS
    uploads = [
        MedicalUpload(
            user_id=user.id,
            file_url=f"/uploads/scan_week{preg.current_week}.jpg",
            file_type="ultrasound",
            notes=f"Scan for week {preg.current_week}"
        )
        for user, preg in zip(mum_users, pregnancies)
    ]
    db.session.add_all(uploads)
    db.session.commit()

    # 8. POSTS (Community Posts)
    post_titles = [
        ("Foods to Avoid During Pregnancy", "Avoid raw fish, unpasteurized milk, excess caffeine."),
        # … other posts …
    ]
    posts = [Post(author_id=random.choice(mum_users).id, title=title, content=content) for title, content in post_titles]
    db.session.add_all(posts)
    db.session.commit()

    # 9. COMMENTS (on Posts)
    comments = []
    for post in posts:
        for mum in random.sample(mum_users, 3):
            comments.append(Comment(post_id=post.id, user_id=mum.id, content=random.choice([
                "This is really helpful, thanks!",
                "I didn't know this. Very informative!",
                "Appreciate the advice!"
            ])))
    db.session.add_all(comments)
    db.session.commit()

    # 10. QUESTIONS
    sample_questions = [
        ("Can I fast during pregnancy?", "It depends, but consult your doctor before fasting."),
        # … other questions …
    ]
    questions = []
    for idx, (q_text, a_text) in enumerate(sample_questions):
        questions.append(Question(
            user_id=mum_users[idx % len(mum_users)].id,
            question_text=q_text,
            is_anonymous=bool(idx % 2),
            answered_by=random.choice(specialist_users).id,
            answer_text=a_text
        ))
    db.session.add_all(questions)
    db.session.commit()

    # 11. CLINICS
    clinics = [
        Clinic(name="MumsCare Clinic", location="Machakos", contact_info="0722123456", recommended_by=specialist_users[0].id),
        # … other clinics …
    ]
    db.session.add_all(clinics)
    db.session.commit()

    # 12. COMMUNITIES
    communities = [
        Community(name="First-time Mums Support", description="A welcoming space for women experiencing pregnancy for the first time.", image="https://www.pinterest.com/pin/352125264634581686/"),
        # … other communities …
    ]
    db.session.add_all(communities)
    db.session.commit()

    # 13. NUTRITION (Weekly Recommendations)
    nutrition_entries = []
    for w in range(1, 41):
        nutrition_entries.append(Nutrition(
            week=w,
            nutrients={
                "iron": "27mg",
                "calcium": "1000mg",
                "folate": "600μg"
            },
            food_suggestions=[
                "Dark leafy greens",
                "Lean red meat",
                "Fortified cereals"
            ]
        ))
    db.session.add_all(nutrition_entries)
    db.session.commit()

    # 14. NUTRITION BLOGS
    sample_blogs = [
        NutritionBlog(title="Iron-Rich Foods for Second Trimester", content="Explore iron-packed foods to boost blood levels during your second trimester...", image_url="https://example.com/iron.jpg", category="seasonal", author="Mama Africa Health Team"),
        # … other blogs …
    ]
    db.session.bulk_save_objects(sample_blogs)
    db.session.commit()

    # 15. MESSAGES
    messages = []
    for i in range(10):
        sender = random.choice(mum_users)
        receiver = random.choice(specialist_users)
        messages.append(Message(sender_id=sender.id, receiver_id=receiver.id, message=f"Hello doctor, I have a concern about week {random.randint(6, 36)} of pregnancy."))
        messages.append(Message(sender_id=receiver.id, receiver_id=sender.id, message=f"Hi {sender.profile.full_name}, I recommend coming in for a scan. Stay hydrated."))
    db.session.add_all(messages)
    db.session.commit()

    # 16. BABY WEEK UPDATES
    baby_updates = [
        BabyWeekUpdate(
            week_number=1,
            baby_size_analogy="tiny sesame seed",
            development_note="Cell division starts and hormonal signals are sent.",
            mama_tip="Start taking folic acid if you haven't.",
            proverb="A good beginning makes a good ending.",
            nutrition_tip="Eat leafy greens, eggs, and fortified cereals.",
            midwife_question="Do you know your last period date?"
        ),
        # … other week updates …
    ]
    db.session.add_all(baby_updates)
    db.session.commit()

    # 17. TOPICS + FOLLOWED TOPICS
    topics = [
        Topic(name="Nutrition during 2nd trimester", description="Focus on iron and protein-rich foods."),
        # … other topics …
    ]
    db.session.add_all(topics)
    db.session.commit()
    # Example follows:
    mum_users[0].followed_topics.append(topics[0])
    db.session.commit()

    # 18. FLAG REPORTS
    flagged = FlagReport(reporter_id=mum_users[0].id, content_type="post", content_id=posts[0].id, reason="Possibly misleading about herbal remedies.", reviewed=False)
    db.session.add(flagged)
    db.session.commit()

    # 19. SHARED CONTENT
    shared = SharedContent(user_id=mum_users[1].id, content_type="article", content_id=articles[0].id, shared_with="family", shared_at=datetime.utcnow())
    db.session.add(shared)
    db.session.commit()

    # 20. VERIFICATION REQUESTS
    verification_requests = [
        VerificationRequest(user_id=specialist_users[i].id, is_resolved=False)
        for i in range(3)
    ]
    db.session.add_all(verification_requests)
    db.session.commit()

    print("✅ Database seeded successfully.")
