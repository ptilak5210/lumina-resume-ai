from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(app)

    # ── Register Blueprints ────────────────────────────────────────────────────
    from app.routes.resume import resume_bp
    app.register_blueprint(resume_bp, url_prefix='/api/resumes')

    # Auth is handled by Supabase — no /api/auth/ routes needed

    # ── Create DB tables ───────────────────────────────────────────────────────
    with app.app_context():
        from app.models import resume  # noqa
        db.create_all()

    return app
