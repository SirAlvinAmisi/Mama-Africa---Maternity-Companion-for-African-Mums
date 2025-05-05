from flask_socketio import SocketIO
from flask_mail import Mail

socketio = SocketIO(cors_allowed_origins=["http://127.0.0.1:5173", "http://localhost:5173"], async_mode='threading')
mail = Mail()
