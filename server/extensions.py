from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_socketio import SocketIO
from flask_migrate import Migrate

db = SQLAlchemy()
mail = Mail()
socketio = SocketIO(cors_allowed_origins=[
    # "https://mama-africa.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
], async_mode="eventlet")
migrate = Migrate()