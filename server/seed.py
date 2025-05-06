from app import db, app
from models import *
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
        ("amina@mama.africa", "Amina Mohamed", "Mombasa", "First-time mum, excited and curious!", "https://i.pinimg.com/736x/6e/c7/aa/6ec7aa67461bec0c0c9c73287d6187b1.jpg"),
        ("lucy@mama.africa", "Lucy Kamau", "Nakuru", "Expecting my second baby, managing toddlers too!", "https://i.pinimg.com/736x/9e/7e/de/9e7edeee91c24eaab1354ba5b4af110d.jpg"),
        ("fatma@mama.africa", "Fatma Hussein", "Garissa", "Navigating traditional practices with modern care.", "https://i.pinimg.com/736x/47/01/58/47015880ed8125bae343548574dbf7a6.jpg"),
        ("janet@mama.africa", "Janet Wanjiru", "Nairobi", "Career mum balancing office and motherhood.", "https://i.pinimg.com/736x/bf/c3/98/bfc398f8e8269342bda0e18dd2707283.jpg"),
        ("mary@mama.africa", "Mary Atieno", "Kisumu", "22 years old, first pregnancy.", "https://i.pinimg.com/736x/c1/e4/72/c1e4724cb114074ab925ddab8f9ea73f.jpg"),
        ("beatrice@mama.africa", "Beatrice Nyambura", "Eldoret", "Third pregnancy, previous high-risk case.", "https://i.pinimg.com/736x/69/05/0f/69050f9c018e5cf0aabf06c4367c9069.jpg"),
    ]

    mum_users = []
    mum_profiles = []

    for email, name, region, bio, pic in mums:
        user = User(email=email, password_hash="hashed_mum", role="mum")
        db.session.add(user)
        db.session.flush()
        mum_users.append(user)
        profile = Profile(user_id=user.id, full_name=name, region=region, bio=bio, profile_picture=pic)
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
        Clinic(
            name="MumsCare Clinic", 
            location="Machakos", 
            contact_info="0722123456", 
            recommended_by=specialist_users[0].id
        ),
        Clinic(
            name="Nakuru Women's Center", 
            location="Nakuru", 
            contact_info="0733556677", 
            recommended_by=specialist_users[1].id
            ),
        Clinic(
            name="Coast Maternal Care", 
            location="Mombasa", 
            contact_info="0744112233", 
            recommended_by=specialist_users[2].id
            ),
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
    
    #12 Nutrion Blog
    sample_blogs = [
    # Seasonal Blogs
        NutritionBlog(
            title="Iron-Rich Foods for Second Trimester",
            content="Explore iron-packed foods to boost blood levels during your second trimester...",
            image_url="https://example.com/iron.jpg",
            category="seasonal",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Hydration Essentials in the Third Trimester",
            content="Water isn't the only thing! Learn hydrating foods to prepare for delivery...",
            image_url="https://example.com/hydration.jpg",
            category="seasonal",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Protein Sources for Early Pregnancy",
            content="A balanced intake of legumes, eggs, and fish builds baby’s foundation...",
            image_url="https://example.com/protein.jpg",
            category="seasonal",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Vitamins for Each Trimester",
            content="Your body’s nutritional needs change each trimester—here’s what to focus on.",
            image_url="https://example.com/vitamins.jpg",
            category="seasonal",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Boosting Energy Naturally in Pregnancy",
            content="Combat fatigue with energy-sustaining foods ideal for pregnancy...",
            image_url="https://example.com/energy.jpg",
            category="seasonal",
            author="Mama Africa Health Team"
        ),

        # Expert Blogs
        NutritionBlog(
            title="Ask the Expert: Daily Supplements During Pregnancy",
            content="Dr. Nyambura answers your top supplement questions...",
            image_url="https://example.com/supplements.jpg",
            category="expert",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Interview: Local Midwives Share Nutritional Wisdom",
            content="Traditional meets modern nutrition advice in this village midwives’ roundtable...",
            image_url="https://example.com/midwives.jpg",
            category="expert",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Prenatal Nutrition for Vegetarians",
            content="Worried about missing out on nutrients? Here’s a vegetarian-safe plan...",
            image_url="https://example.com/vegetarian.jpg",
            category="expert",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Balancing Cravings and Nutrients",
            content="Dr. Nyambura discusses managing cravings without compromising health.",
            image_url="https://example.com/cravings.jpg",
            category="expert",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Understanding Food Labels When Pregnant",
            content="What’s hidden in packaged foods? Learn how to read food labels wisely...",
            image_url="https://example.com/labels.jpg",
            category="expert",
            author="Mama Africa Health Team"
        ),

        # Concern Blogs
        NutritionBlog(
            title="Morning Sickness and Nutrition Hacks",
            content="Discover small meals that ease nausea while still giving baby nutrients...",
            image_url="https://example.com/morningsickness.jpg",
            category="concern",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Managing Weight Gain During Pregnancy",
            content="Learn about healthy weight gain goals and portion control ideas.",
            image_url="https://example.com/weight.jpg",
            category="concern",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Foods That Cause Discomfort and Alternatives",
            content="Avoid bloating and indigestion by replacing problem foods with gentler choices...",
            image_url="https://example.com/discomfort.jpg",
            category="concern",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="Coping with Food Aversions",
            content="Can’t stand once-loved meals? Try these substitution hacks backed by nutritionists.",
            image_url="https://example.com/aversions.jpg",
            category="concern",
            author="Mama Africa Health Team"
        ),
        NutritionBlog(
            title="What To Eat If You’re Diagnosed With Gestational Diabetes",
            content="Low GI meals and balanced carbs become key. Here’s a starter meal plan.",
            image_url="https://example.com/gestationaldiabetes.jpg",
            category="concern",
            author="Mama Africa Health Team"
        ),
    ]

    db.session.bulk_save_objects(sample_blogs)
    db.session.commit()

    # 13. MESSAGES
    messages = []

    # Create a few messages between mums and health professionals
    for i in range(10):
        sender = random.choice(mum_users)
        receiver = random.choice(specialist_users)
        messages.append(
            Message(
                sender_id=sender.id,
                receiver_id=receiver.id,
                message=f"Hello doctor, I have a concern about week {random.randint(6, 36)} of pregnancy.",
            )
        )
        # Optional: doctor replies
        messages.append(
            Message(
                sender_id=receiver.id,
                receiver_id=sender.id,
                message=f"Hi {sender.profile.full_name}, I recommend coming in for a scan. Stay hydrated.",
            )
        )

    db.session.add_all(messages)
    db.session.commit() 

    # 13. BABY WEEK UPDATES
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
        BabyWeekUpdate(
            week_number=2,
            baby_size_analogy="grain of rice",
            development_note="The fertilized egg is moving to the uterus.",
            mama_tip="Avoid stress and heavy lifting.",
            proverb="Patience can cook a stone.",
            nutrition_tip="Hydrate well and eat small frequent meals.",
            midwife_question="Have you scheduled your first prenatal visit?"
        ),
        BabyWeekUpdate(
            week_number=3,
            baby_size_analogy="poppy seed",
            development_note="The embryo implants into the uterus lining.",
            mama_tip="Avoid caffeine and alcohol.",
            proverb="Rain does not fall on one roof alone.",
            nutrition_tip="Continue taking prenatal vitamins daily.",
            midwife_question="Any cramping or spotting noticed?"
        ),
        BabyWeekUpdate(
            week_number=4,
            baby_size_analogy="mustard seed",
            development_note="Neural tube starts forming.",
            mama_tip="Get enough rest and avoid medications without consulting.",
            proverb="Wisdom is like a baobab tree; no one individual can embrace it.",
            nutrition_tip="Add sources of folate and omega-3s.",
            midwife_question="Do you need help selecting a clinic?"
        ),
        BabyWeekUpdate(
            week_number=5,
            baby_size_analogy="apple seed",
            development_note="Heart starts beating and circulatory system forms.",
            mama_tip="Note any symptoms and discuss them early.",
            proverb="Even the best cooking pot will not produce food.",
            nutrition_tip="Increase intake of B vitamins.",
            midwife_question="Have you chosen a birth plan yet?"
        )
    ]
    db.session.add_all(baby_updates)

    # 14. TOPICS + FOLLOWED TOPICS
    topics = [
        Topic(name="Nutrition during 2nd trimester", description="Focus on iron and protein-rich foods."),
        Topic(name="What to expect during labor", description="Signs and stages of labor."),
        Topic(name="Postpartum mental health", description="Managing emotions after birth."),
    ]
    db.session.add_all(topics)
    db.session.commit()

    # Link mums to topics if they exist
    if len(mum_users) >= 3:
        mum_users[0].followed_topics.append(topics[0])
        mum_users[1].followed_topics.append(topics[1])
        mum_users[2].followed_topics.append(topics[2])
        db.session.commit()

    # 15. FLAG REPORT
    if len(posts) > 0:
        flagged = FlagReport(
            reporter_id=mum_users[0].id,
            content_type="post",
            content_id=posts[0].id,
            reason="Possibly misleading about herbal remedies.",
            reviewed=False
        )
        db.session.add(flagged)
        db.session.commit()

    # 16. SHARED CONTENT
    if len(articles) > 0:
        share = SharedContent(
            user_id=mum_users[1].id,
            content_type="article",
            content_id=articles[0].id,
            shared_with="family",
            shared_at=datetime.utcnow()
        )
        db.session.add(share)
    db.session.commit()
    
    # 17. REMINDERS (based on pregnancy week)
    reminders = []

    for mum, preg in zip(mum_users, pregnancies):
        base_date = datetime.now()

        # First Reminder - Antenatal Checkup (7 days ahead)
        reminders.append(Reminder(
            user_id=mum.id,
            reminder_text=f"Antenatal checkup for week {preg.current_week + 1}",
            reminder_date=(base_date + timedelta(days=7)).date(),
            type="checkup"
        ))

        # Second Reminder - Ultrasound Scan (2 weeks ahead)
        reminders.append(Reminder(
            user_id=mum.id,
            reminder_text=f"Ultrasound scan scheduled around week {preg.current_week + 3}",
            reminder_date=(base_date + timedelta(days=14)).date(),
            type="scan"
        ))

        # Third Reminder - Nutrition Support Session (1 week ahead)
        reminders.append(Reminder(
            user_id=mum.id,
            reminder_text="Attend your virtual nutrition support session",
            reminder_date=(base_date + timedelta(days=10)).date(),
            type="support"
        ))

        # Fourth Reminder - Community Group Check-in
        reminders.append(Reminder(
            user_id=mum.id,
            reminder_text="Check in with your trimester group for updates and questions",
            reminder_date=(base_date + timedelta(days=5)).date(),
            type="community"
        ))

    db.session.add_all(reminders)
    db.session.commit()

    # 18. VERIFICATION REQUESTS (from some health professionals)
    verifications = [
        VerificationRequest(user_id=spec.id, is_resolved=False)
        for spec in specialist_users[:5]  # Just the first 5 requesting
    ]
    db.session.add_all(verifications)
    db.session.commit()

    # 19. NOTIFICATIONS (new messages and scan reminders)
    notifications = []

    for mum in mum_users[:3]:  # First 3 mums get sample notifications
        notifications.append(Notification(
            user_id=mum.id,
            message="You have a new message from your assigned doctor.",
            link="/messages",
            is_read=False
        ))
        notifications.append(Notification(
            user_id=mum.id,
            message="Your next scan is scheduled for next week.",
            link="/reminders",
            is_read=False
        ))

    db.session.add_all(notifications)
    db.session.commit()
    
    # 20. CERTIFICATIONS (for all specialists)
    certifications = [
        Certification(
            user_id=spec.id,
            file_url=f"/certs/{spec.profile.full_name.replace(' ', '_')}.pdf",
            file_type="license",
            is_verified=False
        )
        for spec in specialist_users
    ]
    db.session.add_all(certifications)
    db.session.commit()


    print("✅ Database seeded successfully.")