from app import db, app
from models import *
from datetime import datetime, timedelta
import random

with app.app_context():
    db.drop_all()
    db.create_all()

    # 1. ADMIN
    admin = User(email="admin@mama.africa", password_hash="hashed_admin", role="admin")
    db.session.add(admin)
    db.session.commit()

    # 2. HEALTH SPECIALISTS
    specialists = [
        ("dr.ouma@mama.africa", "Dr. Ouma Odhiambo", "Kisumu", "Maternal-Fetal Medicine Specialist"),
        ("dr.njeri@mama.africa", "Dr. Wanjiru Njeri", "Nyeri", "Obstetrician-Gynecologist"),
        ("dr.sarah@mama.africa", "Dr. Sarah Were", "Nairobi", "Prenatal Nutritionist"),
        ("dr.kimani@mama.africa", "Dr. Peter Kimani", "Nakuru", "Fertility Specialist"),
        ("dr.atieno@mama.africa", "Dr. Mary Atieno", "Mombasa", "Certified Lactation Consultant"),
        ("dr.kariuki@mama.africa", "Dr. James Kariuki", "Eldoret", "Pelvic Health Physiotherapist"),
        ("dr.mwende@mama.africa", "Dr. Grace Mwende", "Machakos", "High-Risk Pregnancy Specialist"),
        ("dr.otieno@mama.africa", "Dr. John Otieno", "Kisii", "Neonatologist (Newborn Care)"),
        ("dr.nancy@mama.africa", "Dr. Nancy Gikonyo", "Meru", "Midwife and Maternal Educator"),
        ("dr.chebet@mama.africa", "Dr. Alice Chebet", "Kericho", "Traditional and Modern Maternal Care Expert"),
    ]

    specialist_users = []
    specialist_profiles = []

    for email, name, region, bio in specialists:
        user = User(email=email, password_hash="hashed_specialist", role="health_pro")
        db.session.add(user)
        db.session.flush()
        specialist_users.append(user)
        profile = Profile(user_id=user.id, full_name=name, region=region, bio=bio)
        specialist_profiles.append(profile)

    db.session.add_all(specialist_profiles)
    db.session.commit()

    # 3. MUMS
    mums = [
        ("amina@mama.africa", "Amina Mohamed", "Mombasa", "First-time mum, excited and curious!"),
        ("lucy@mama.africa", "Lucy Kamau", "Nakuru", "Expecting my second baby, managing toddlers too!"),
        ("fatma@mama.africa", "Fatma Hussein", "Garissa", "Navigating traditional practices with modern care."),
        ("janet@mama.africa", "Janet Wanjiru", "Nairobi", "Career mum balancing office and motherhood."),
        ("mary@mama.africa", "Mary Atieno", "Kisumu", "22 years old, first pregnancy."),
        ("beatrice@mama.africa", "Beatrice Nyambura", "Eldoret", "Third pregnancy, previous high-risk case."),
    ]

    mum_users = []
    mum_profiles = []

    for email, name, region, bio in mums:
        user = User(email=email, password_hash="hashed_mum", role="mum")
        db.session.add(user)
        db.session.flush()
        mum_users.append(user)
        profile = Profile(user_id=user.id, full_name=name, region=region, bio=bio)
        mum_profiles.append(profile)

    db.session.add_all(mum_profiles)
    db.session.commit()

    # 4. PREGNANCY DETAILS
    pregnancy_records = [
        (mum_users[0].id, 8),
        (mum_users[1].id, 18),
        (mum_users[2].id, 25),
        (mum_users[3].id, 32),
        (mum_users[4].id, 12),
        (mum_users[5].id, 22),
    ]

    pregnancies = []
    for user_id, weeks in pregnancy_records:
        pregnancies.append(
            PregnancyDetail(
                user_id=user_id,
                last_period_date=datetime.now() - timedelta(weeks=weeks),
                due_date=datetime.now() + timedelta(weeks=(40 - weeks)),
                current_week=weeks,
                pregnancy_status="active"
            )
        )
    db.session.add_all(pregnancies)
    db.session.commit()

    # 5. MEDICAL UPLOADS
    uploads = [
        MedicalUpload(user_id=user.id, file_url=f"/uploads/scan_week{preg.current_week}.jpg", file_type="ultrasound", notes=f"Scan for week {preg.current_week}") 
        for user, preg in zip(mum_users, pregnancies)
    ]
    db.session.add_all(uploads)
    db.session.commit()

    # 6. POSTS
    post_titles = [
        ("Foods to Avoid During Pregnancy", "Avoid raw fish, unpasteurized milk, excess caffeine."),
        ("Common Signs You Need Immediate Medical Attention", "Bleeding, severe headaches, loss of fetal movement."),
        ("Benefits of Light Exercise While Pregnant", "Yoga, swimming, and walking are safe."),
        ("Managing High Blood Pressure in Pregnancy", "Pre-eclampsia risk management tips."),
        ("Dealing with Morning Sickness Naturally", "Ginger tea, small frequent meals help."),
        ("Importance of Iron and Folic Acid Supplements", "Prevent anemia and neural tube defects."),
        ("Understanding High-risk Pregnancies", "Who is at risk and how to manage."),
        ("Safe Herbal Remedies and Dangers", "Some herbs are unsafe. Consult before use."),
        ("Lactation Preparation Before Delivery", "Colostrum benefits and early breastfeeding."),
        ("Planning Your Delivery: What to Expect", "Options: normal delivery, C-section, birthing plans."),
        ("Vaccines You Need During Pregnancy", "Tetanus, flu vaccine are important."),
        ("How to Prepare Your Body for Breastfeeding", "Nipple care, good latch techniques."),
        ("Common Myths about Labor Pain", "Facts vs fiction about pain and labor."),
        ("Importance of Mental Health in Pregnancy", "Managing anxiety and depression."),
        ("Exercise After Cesarean Delivery: When and How", "Safe postnatal rehab practices."),
        ("Newborn Care Basics: First Week Tips", "Umbilical care, feeding schedules."),
        ("How Nutrition Affects Baby’s Brain Development", "Omega-3 fatty acids and folate."),
    ]

    posts = []
    for idx, (title, content) in enumerate(post_titles):
        post = Post(
            author_id=random.choice(specialist_users).id,
            title=title,
            content=content,
            is_medical=True,
            is_approved=True,
            category="health" if idx % 2 == 0 else "nutrition"
        )
        posts.append(post)

    db.session.add_all(posts)
    db.session.commit()

    # 7. COMMENTS
    comments = []
    for post in posts:
        selected_mums = random.sample(mum_users, 3)
        for mum in selected_mums:
            comments.append(
                Comment(post_id=post.id, user_id=mum.id, content=random.choice([
                    "This is really helpful, thanks!",
                    "I didn't know this. Very informative!",
                    "I will share this with my friend too!",
                    "This clears up so many myths!",
                    "Appreciate the advice!"
                ]))
            )

    db.session.add_all(comments)
    db.session.commit()

    # 8. QUESTIONS
    questions = []
    sample_questions = [
        ("Can I fast during pregnancy?", "It depends, but consult your doctor before fasting."),
        ("Is cramping normal in second trimester?", "Mild cramping is normal but check if severe."),
        ("Can I travel by bus during 8 months?", "Yes, if short trips. Avoid bumpy rides."),
        ("How much water should I drink?", "About 2-3 liters daily."),
        ("Can I eat street food?", "Only if hygienic. Risk of food poisoning."),
        ("Is sleeping on my back dangerous?", "After 20 weeks, try sleeping on the side."),
    ]

    for idx, (q_text, a_text) in enumerate(sample_questions):
        questions.append(
            Question(
                user_id=mum_users[idx % len(mum_users)].id,
                question_text=q_text,
                is_anonymous=bool(idx % 2),
                answered_by=random.choice(specialist_users).id,
                answer_text=a_text
            )
        )

    db.session.add_all(questions)
    db.session.commit()

    # 9. CLINICS
    clinics = [
        Clinic(name="MumsCare Clinic", location="Machakos", contact_info="0722123456", recommended_by=specialist_users[0].id),
        Clinic(name="Nakuru Women's Center", location="Nakuru", contact_info="0733556677", recommended_by=specialist_users[1].id),
        Clinic(name="Coast Maternal Care", location="Mombasa", contact_info="0744112233", recommended_by=specialist_users[2].id),
    ]

    db.session.add_all(clinics)
    db.session.commit()
    
    # 10. Communities 
    communities = [
        Community(name="First-time Mums Support", description="A community for first pregnancies."),
        Community(name="High-risk Pregnancy Warriors", description="Sharing journeys and support."),
        Community(name="Postpartum Care Group", description="Tips for recovery after delivery."),
        Community(name="Traditional and Modern Mums", description="Balancing cultural practices with modern medicine."),
        Community(name="Young Mums Circle", description="For mothers under 25."),
    ]

    db.session.add_all(communities)
    db.session.commit()


    print("✅ Database seeded successfully.")
