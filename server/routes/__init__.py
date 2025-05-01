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
def register_routes(app):
    app.register_blueprint(base_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(mum_bp)
    app.register_blueprint(community_bp)
    app.register_blueprint(article_bp)
    app.register_blueprint(clinic_bp)
    app.register_blueprint(media_bp)
    app.register_blueprint(nutrition_bp)
