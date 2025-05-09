# from flask import Flask
# # from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_jwt_extended import JWTManager
# from flask_cors import CORS
# from dotenv import load_dotenv
# import os

# from models import db
# from routes import register_routes
# from extensions import socketio, mail  # ✅ now from extensions
# from utils.email_utils import init_mail  # ✅ your mail setup

# load_dotenv()

# def create_app():
#     app = Flask(__name__)
#     app.config.from_object('config.Config')

#     db.init_app(app)
#     # migrate = Migrate(app, db)  # ✅ initialize Migrate with app and db
#     Migrate(app, db)
#     JWTManager(app)
#     mail.init_app(app)         # ✅ setup Flask-Mail
#     socketio.init_app(app)     # ✅ setup Flask-SocketIO

#     # CORS
#     CORS(app, supports_credentials=True, resources={
#         r"/*": {
#             "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
#             "methods": ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
#             "allow_headers": ["Authorization", "Content-Type"]
#         }
#     })

#     register_routes(app)
#     return app

# app = create_app()

# if __name__ == "__main__":
#     socketio.run(app, debug=True)
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

from models import db
from routes import register_routes
from extensions import socketio, mail, migrate  
from utils.email_utils import init_mail


load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)
    mail.init_app(app)
    socketio.init_app(app)

    # ✅ Updated CORS configuration
    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:5173","http://127.0.0.1:5173", "http://127.0.0.1:5174"],
            "methods": ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"]
        }
    })

    register_routes(app)
    return app

app = create_app()

if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app, debug=True)
