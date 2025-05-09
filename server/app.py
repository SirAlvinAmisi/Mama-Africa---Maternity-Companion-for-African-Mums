from flask import Flask, jsonify
# from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

from models import db
from routes import register_routes
from extensions import socketio, mail  # ✅ now from extensions
from utils.email_utils import init_mail  # ✅ your mail setup
from flask_jwt_extended import exceptions as jwt_exceptions

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    # migrate = Migrate(app, db)  # ✅ initialize Migrate with app and db
    Migrate(app, db)
    JWTManager(app)
    mail.init_app(app)         # ✅ setup Flask-Mail
    socketio.init_app(app, cors_allowed_origins="*")     # ✅ setup Flask-SocketIO

    # CORS
    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",        # ✅ Add this
                "http://127.0.0.1:5174"         # ✅ And this
            ],
            "methods": ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"]
        }
    })

    register_routes(app)
    
    # ✅ JWT error handling
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

if __name__ == "__main__":
    socketio.run(app, debug=True)
