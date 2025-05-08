from .base_routes import base_bp
from .auth_routes import auth_bp
from .admin_routes import admin_bp
from .health_pro_routes import health_bp
from .mum_routes import mum_bp
from .community_routes import community_bp
from .article_routes import article_bp
from .clinic_routes import clinic_bp
from .media_routes import media_bp
from .nutrition_routes import nutrition_bp
from .chat_routes import chat_bp
from .topic_routes import topic_bp
from .baby_routes import baby_bp
from .flag_routes import flag_bp
from .share_routes import share_bp
from .analytics_routes import analytics_bp
from .notification_routes import notification_bp
def register_routes(app):
    app.register_blueprint(base_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(health_bp)
    # app.register_blueprint(health_bp, url_prefix="/health")
    app.register_blueprint(mum_bp, url_prefix="/mums")
    app.register_blueprint(community_bp)
    app.register_blueprint(article_bp)
    app.register_blueprint(clinic_bp)
    app.register_blueprint(media_bp)
    app.register_blueprint(nutrition_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(topic_bp)
    app.register_blueprint(baby_bp)
    app.register_blueprint(flag_bp)
    app.register_blueprint(share_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(notification_bp)
