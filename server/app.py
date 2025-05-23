import os
import logging
import eventlet
import eventlet.wsgi
from flask import Flask, jsonify, request, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, decode_token
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room
from dotenv import load_dotenv
from models import db
# 🔥 Ensure all models are imported so Flask-Migrate sees them
from models import (
    User, Profile, PregnancyDetail, Post, Article, Comment, Question,
    MedicalUpload, Certification, Clinic, Community, Topic, FlagReport,
    BabyWeekUpdate, NutritionBlog, Nutrition, Message, SharedContent,
    VerificationRequest, Notification, Reminder, Category
)

from routes import register_routes
from extensions import socketio, mail
from flask_jwt_extended import exceptions as jwt_exceptions

# Load environment variables
load_dotenv()

# Enable logging
logging.basicConfig(level=logging.DEBUG)

# Define path to frontend build directory
frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "client"))
dist_folder = os.path.join(frontend_folder, "dist")


def create_app():
    app = Flask(__name__, static_folder=dist_folder, static_url_path="/")
    app.config.from_object('config.Config')
    app.logger.info("\U0001F517 Connected to database: %s", app.config["SQLALCHEMY_DATABASE_URI"])

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    mail.init_app(app)

    # CORS setup
    CORS(app,
        supports_credentials=True,
        origins=[
            "https://mama-africa.onrender.com",
            "http://localhost:5173",
            "http://localhost:5000",
            "http://127.0.0.1:5173"
        ],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"])

    # Socket.IO setup
    socketio.init_app(app, cors_allowed_origins=[
        "https://mama-africa.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5000"
    ])

    # Serve frontend
    @app.route("/", defaults={"filename": ""})
    @app.route("/<path:filename>")
    def index(filename):
        if not filename:
            filename = "index.html"
        return send_from_directory(dist_folder, filename)

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(dist_folder, "index.html")

    register_routes(app)

    # JWT error handling
    @app.errorhandler(jwt_exceptions.NoAuthorizationError)
    @app.errorhandler(jwt_exceptions.JWTDecodeError)
    @app.errorhandler(jwt_exceptions.WrongTokenError)
    @app.errorhandler(jwt_exceptions.RevokedTokenError)
    @app.errorhandler(jwt_exceptions.FreshTokenRequired)
    @app.errorhandler(jwt_exceptions.UserLookupError)
    @app.errorhandler(jwt_exceptions.CSRFError)
    def handle_jwt_errors(e):
        app.logger.error("JWT error: %s", str(e))
        return jsonify({"error": "JWT error", "message": str(e)}), 401
    
        # Automatically apply migrations on startup (for Render free tier)
    from flask_migrate import upgrade
    with app.app_context():
        try:
            upgrade()
            app.logger.info("✅ Database migration applied.")
        except Exception as e:
            app.logger.error(f"⚠️ Database migration failed: {e}")
        # One-time fallback: Create tables manually (bypass Alembic)
    with app.app_context():
        try:
            db.create_all()
            app.logger.info("✅ Tables created successfully with db.create_all()")
        except Exception as e:
            app.logger.error(f"❌ Manual table creation failed: {e}")
        # ✅ Seed admin if not exists
        try:
            from werkzeug.security import generate_password_hash
            if not User.query.filter_by(email="admin@mama.africa").first():
                admin = User(
                    email="admin@mama.africa",
                    password_hash=generate_password_hash("Admin123!"),
                    role="admin",
                    is_active=True,
                    is_validated=True
                )
                db.session.add(admin)
                db.session.commit()
                app.logger.info("✅ Admin user seeded.")
            else:
                app.logger.info("✅ Admin already exists.")
        except Exception as e:
            app.logger.error(f"❌ Admin seeding failed: {e}")    


    return app


app = create_app()

# ===== SOCKET.IO HANDLERS =====
@socketio.on('connect')
def handle_connect():
    app.logger.info(f"Socket connected: {request.sid}")

@socketio.on('join_room')
def handle_join_room(data):
    try:
        token = data.get("token")
        decoded = decode_token(token)
        user_id = decoded["sub"]
        role = decoded.get("role", "user")
        room = f"user_{user_id}" if role != "admin" else "admin"
        join_room(room)
        app.logger.info(f"User {user_id} with role '{role}' joined room: {room}")
    except Exception as e:
        app.logger.error("Room join error: %s", str(e), exc_info=True)

@socketio.on('disconnect')
def handle_disconnect():
    app.logger.info(f"Socket disconnected: {request.sid}")

@app.route('/media/<path:filename>')
def serve_media(filename):
    return send_from_directory('static/community_media', filename)

@app.route('/static/uploads/<path:filename>')
def serve_uploaded_scans(filename):
    return send_from_directory(os.path.join(app.root_path, 'static/uploads'), filename)

# ===== RUN APP =====
if __name__ == "__main__":
    # DEV MODE ONLY (better logging)
    # app.run(debug=True, port=int(os.environ.get("PORT", 5000)))
    # For production: uncomment below
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
