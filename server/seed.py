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
    specialists_data = [
        {
            "email": "dr.ouma@mama.africa",
            "full_name": "Dr. Auma Odhiambo",
            "region": "Kisumu",
            "speciality": "Maternal-Fetal Medicine Specialist",
            "profile_picture": "https://i.pinimg.com/736x/97/96/0f/97960f9d817738d322a6b1b02f05c6b7.jpg"
        },
        {
            "email": "dr.njeri@mama.africa",
            "full_name": "Dr. Wanjiru Njeri",
            "region": "Nyeri",
            "speciality": "Obstetrician-Gynecologist",
            "profile_picture": "https://i.pinimg.com/736x/a5/c8/93/a5c893f7179d55435b0e920620c010d3.jpg"
        },
        {
            "email": "dr.sarah@mama.africa",
            "full_name": "Dr. Sarah Were",
            "region": "Nairobi",
            "speciality": "Prenatal Nutritionist",
            "profile_picture": "https://i.pinimg.com/736x/a9/da/1d/a9da1dea6368ebb099100f489cc37cfe.jpg"
        },
        {
            "email": "dr.kimani@mama.africa",
            "full_name": "Dr. Peter Kimani",
            "region": "Nakuru",
            "speciality": "Fertility Specialist",
            "profile_picture": "https://i.pinimg.com/736x/80/6a/3d/806a3d3e057a3f061cabd1d06dfa9d89.jpg"
        },
        {
            "email": "dr.atieno@mama.africa",
            "full_name": "Dr. Mary Atieno",
            "region": "Mombasa",
            "speciality": "Certified Lactation Consultant",
            "profile_picture": "https://i.pinimg.com/736x/56/26/a5/5626a56c7d6fb6880779879c72f52dc9.jpg"
        },
        {
            "email": "dr.kariuki@mama.africa",
            "full_name": "Dr. James Kariuki",
            "region": "Eldoret",
            "speciality": "Pelvic Health Physiotherapist",
            "profile_picture": "https://i.pinimg.com/736x/c2/70/9f/c2709f51a673bd2df3f654d524e2f675.jpg"
        },
        {
            "email": "dr.mwende@mama.africa",
            "full_name": "Dr. Grace Mwende",
            "region": "Machakos",
            "speciality": "High-Risk Pregnancy Specialist",
            "profile_picture": "https://i.pinimg.com/736x/d1/c6/eb/d1c6ebab5103bbdad512f87b937572c6.jpg"
        },
        {
            "email": "dr.otieno@mama.africa",
            "full_name": "Dr. John Otieno",
            "region": "Kisii",
            "speciality": "Neonatologist (Newborn Care)",
            "profile_picture": "https://i.pinimg.com/736x/f0/2c/98/f02c9840ecc8a14e3ec6c7bf2d165977.jpg"
        },
        {
            "email": "dr.nancy@mama.africa",
            "full_name": "Dr. Nancy Gikonyo",
            "region": "Meru",
            "speciality": "Midwife and Maternal Educator",
            "profile_picture": "https://i.pinimg.com/736x/66/a4/46/66a44626a635eb117f81d95b6ebc9309.jpg"
        },
        {
            "email": "dr.chebet@mama.africa",
            "full_name": "Dr. Alice Chebet",
            "region": "Kericho",
            "speciality": "Traditional and Modern Maternal Care Expert",
            "profile_picture": "https://i.pinimg.com/736x/a1/c7/68/a1c768cffec08a7fabe74c55297f22bc.jpg"
        }
    ]

    specialist_users = []

    for spec in specialists_data:
        # Create User
        user = User(email=spec["email"], password_hash="hashed_specialist", role="health_pro")
        db.session.add(user)
        db.session.flush()  # To get user.id immediately

        # Create Profile
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
        ("Postpartum Recovery Basics", "Postpartum"),
        ("Preparing for Childbirth", "Pregnancy"),
        ("Mental Health During Pregnancy", "Mental Health"),
        ("Choosing the Right Hospital", "Healthcare"),
        ("Early Baby Development Milestones", "Newborn Care"),
        ("How to Boost Fertility Naturally", "Fertility"),
    ]

    articles = []
    for specialist in specialist_users:
        selected_articles = random.sample(sample_articles, 2)  # Pick 2 random articles
        for title, category in selected_articles:
            article = Article(
                author_id=specialist.id,
                title=title,
                content=f"This is a helpful article about {category.lower()} authored by {specialist.profile.full_name}.",
                category=category,
                is_approved=True
            )
            articles.append(article)

    db.session.add_all(articles)
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

    # 6. POSTS (Community Posts)
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
            author_id=random.choice(mum_users).id,  # Posts now from Mums, because Articles will be from Doctors
            title=title,
            content=content,
            media_url=None
        )
        posts.append(post)

    db.session.add_all(posts)
    db.session.commit()

   

    # 8. COMMENTS (on Posts)
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

    # 9. QUESTIONS
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

    # 10. CLINICS
    clinics = [
        Clinic(name="MumsCare Clinic", location="Machakos", contact_info="0722123456", recommended_by=specialist_users[0].id),
        Clinic(name="Nakuru Women's Center", location="Nakuru", contact_info="0733556677", recommended_by=specialist_users[1].id),
        Clinic(name="Coast Maternal Care", location="Mombasa", contact_info="0744112233", recommended_by=specialist_users[2].id),
    ]

    db.session.add_all(clinics)
    db.session.commit()

    # 11. COMMUNITIES
    communities = [
        Community(
            name="First-time Mums Support",
            description="A welcoming space for women experiencing pregnancy for the first time.",
            image="https://www.pinterest.com/pin/352125264634581686/"  
        ),
        Community(
            name="High-risk Pregnancy Warriors",
            description="Support network for mothers going through complex or high-risk pregnancies.",
            image="https://www.pinterest.com/pin/114419646777834927/"  # Hospital care
        ),
        Community(
            name="Postpartum Care Group",
            description="Helping mothers heal, recover, and rebuild strength after childbirth.",
            image="https://www.pinterest.com/pin/23432860615799448/"  # Post-birth bonding
        ),
        Community(
            name="Traditional and Modern Mums",
            description="Combining cultural practices with modern healthcare in pregnancy and motherhood.",
            image="https://www.pinterest.com/pin/437060338852687676/"  # Cultural motherhood
        ),
        Community(
            name="Young Mums Circle",
            description="For younger mothers seeking advice, friendship, and empowerment.",
            image="https://www.pinterest.com/pin/347480927517124311/"  # Young mother holding baby
        ),
        Community(
            name="Pregnancy Nutrition and Wellness",
            description="Focused on healthy eating, supplementation, and wellness during pregnancy.",
            image="https://www.pinterest.com/pin/222365300346750755/"  
        ),
        Community(
            name="Prenatal Fitness",
            description="Sharing safe workouts, yoga practices, and physical care tips for expecting mothers.",
            image="https://www.pinterest.com/pin/22869910603664232/"  
        ),
        Community(
            name="Mental Health in Motherhood",
            description="Discussing emotional wellbeing, managing anxiety, and mental health during motherhood.",
            image="https://www.pinterest.com/pin/12877548931189856/"  # Mental health peace
        ),
        Community(
            name="Single Mums Empowerment",
            description="Providing support, resources, and empowerment for single mothers.",
            image="https://www.pinterest.com/pin/418131146674436526/"  # Single mother strength
        ),
        Community(
            name="Professional Motherhood Guidance",
            description="A professional-driven community offering expert advice on maternal and prenatal care.",
            image="https://www.pinterest.com/pin/488148047389664512/"  # Professional guidance
        ),
    ]

    db.session.add_all(communities)
    db.session.commit()

    print("✅ Database seeded successfully.")
