import os
import eventlet
import eventlet.wsgi
eventlet.monkey_patch()

from flask import Flask, jsonify, request, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, decode_token
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room
from dotenv import load_dotenv
from models import db
from routes import register_routes
from extensions import socketio, mail
from utils.email_utils import init_mail
from flask_jwt_extended import exceptions as jwt_exceptions

# Load environment variables
load_dotenv()

# Define path to frontend build directory
frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "client"))
dist_folder = os.path.join(frontend_folder, "dist")


def create_app():
    app = Flask(__name__, static_folder=dist_folder, static_url_path="/")
    app.config.from_object('config.Config')
    print("🔗 Connected to database:", app.config["SQLALCHEMY_DATABASE_URI"])

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    mail.init_app(app)

    # CORS setup - aligned for frontend
    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": [
                "https://mama-africa.onrender.com",
                "http://localhost:5173"
            ],
            "methods": ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": [
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Access-Control-Allow-Credentials"
            ]
        }
    })

    # Socket.IO setup with matching CORS
    socketio.init_app(app, cors_allowed_origins=[
        "https://mama-africa.onrender.com",
        "http://localhost:5173"
    ])

    # Serve frontend static files
    @app.route("/", defaults={"filename": ""})
    @app.route("/<path:filename>")
    def index(filename):
        if not filename:
            filename = "index.html"
        return send_from_directory(dist_folder, filename)

    # Fallback for React router
    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(dist_folder, "index.html")

    # Register blueprints
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
        return jsonify({"error": "JWT error", "message": str(e)}), 401

    return app


app = create_app()

# ========== SOCKET.IO HANDLERS ==========

@socketio.on('connect')
def handle_connect():
    print(f"Socket connected: {request.sid}")

@socketio.on('join_room')
def handle_join_room(data):
    try:
        token = data.get("token")
        decoded = decode_token(token)
        user_id = decoded["sub"]
        role = decoded.get("role", "user")
        room = f"user_{user_id}" if role != "admin" else "admin"
        join_room(room)
        print(f"User {user_id} with role '{role}' joined room: {room}")
    except Exception as e:
        print("Room join error:", e)

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Socket disconnected: {request.sid}")

@app.route('/media/<path:filename>')
def serve_media(filename):
    return send_from_directory('static/community_media', filename)


# ========== RUN APP ==========
# if __name__ == "__main__":
#     socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
if __name__ == "__main__":
    # socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False, server='eventlet')
    # socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
    eventlet.wsgi.server(eventlet.listen(("0.0.0.0", int(os.environ.get("PORT", 5000)))), app)


