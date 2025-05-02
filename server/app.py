from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from flask_socketio import SocketIO
import os

from models import db
from routes import register_routes  # your custom function

load_dotenv()

socketio = SocketIO(cors_allowed_origins=["http://127.0.0.1:5173", "http://localhost:5173"], async_mode='threading')

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # ✅ Enable full CORS before registering routes
    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"]
        }
    })

    register_routes(app)
    socketio.init_app(app)
    return app

app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=True)
