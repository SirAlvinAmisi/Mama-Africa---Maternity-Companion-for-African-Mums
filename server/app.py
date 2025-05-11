# from flask import Flask, jsonify, request
# from flask_migrate import Migrate
# from flask_jwt_extended import JWTManager, decode_token
# from flask_cors import CORS
# from dotenv import load_dotenv
# from flask_socketio import join_room, leave_room

# import os


# from models import db
# from routes import register_routes
# from extensions import socketio, mail
# from utils.email_utils import init_mail
# from flask_jwt_extended import exceptions as jwt_exceptions

# load_dotenv()


# def create_app():
#     app = Flask(__name__)
#     app.config.from_object('config.Config')

#     db.init_app(app)
#     Migrate(app, db)
#     JWTManager(app)
#     mail.init_app(app)
#     socketio.init_app(app, cors_allowed_origins="*")  # allow frontend origins

#     # CORS setup
#     CORS(app, supports_credentials=True, resources={
#         r"/*": {
#             "origins": [
#                 "http://localhost:5173",
#                 "http://127.0.0.1:5173",
#                 "http://localhost:5174",
#                 "http://127.0.0.1:5174"
#             ],
#             "methods": ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
#             "allow_headers": ["Authorization", "Content-Type"]
#         }
#     })

#     # Register all route blueprints
#     register_routes(app)

#     # JWT error handling
#     @app.errorhandler(jwt_exceptions.NoAuthorizationError)
#     @app.errorhandler(jwt_exceptions.JWTDecodeError)
#     @app.errorhandler(jwt_exceptions.WrongTokenError)
#     @app.errorhandler(jwt_exceptions.RevokedTokenError)
#     @app.errorhandler(jwt_exceptions.FreshTokenRequired)
#     @app.errorhandler(jwt_exceptions.UserLookupError)
#     @app.errorhandler(jwt_exceptions.CSRFError)
#     def handle_jwt_errors(e):
#         return jsonify({"error": "JWT error", "message": str(e)}), 401

#     return app

# app = create_app()

# # ========== SOCKET.IO HANDLERS ==========

# @socketio.on('connect')
# def handle_connect():
#     print(f"Socket connected: {request.sid}")

# @socketio.on('join_room')
# def handle_join_room(data):
#     """
#     Client must send: { "token": "<JWT>" }
#     """
#     try:
#         token = data.get("token")
#         decoded = decode_token(token)
#         user_id = decoded["sub"]
#         role = decoded.get("role", "user")

#         room = f"user_{user_id}" if role != "admin" else "admin"
#         join_room(room)
#         print(f"User {user_id} with role '{role}' joined room: {room}")
#     except Exception as e:
#         print("Room join error:", e)

# @socketio.on('disconnect')
# def handle_disconnect():
#     print(f"Socket disconnected: {request.sid}")

# # ========== RUN ==========

# if __name__ == "__main__":
#     socketio.run(app, debug=True)

import os
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

    # Initialize extensions
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    mail.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")  # Allow any frontend origin

    # CORS setup
    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174"
            ],
            "methods": ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"]
        }
    })

    # Serve frontend static files
    @app.route("/", defaults={"filename": ""})
    @app.route("/<path:filename>")
    def index(filename):
        if not filename:
            filename = "index.html"
        return send_from_directory(dist_folder, filename)

    # Optional: support frontend routing (SPA)
    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(dist_folder, "index.html")

    # Register all route blueprints
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
    """
    Client must send: { "token": "<JWT>" }
    """
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


# ========== RUN APP ==========
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
