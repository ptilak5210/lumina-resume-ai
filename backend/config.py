import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'), override=True)

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_secret_key')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')

    # Database — Supabase PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Supabase JWT Secret — used to verify tokens sent from frontend
    # supabase.com → Settings → API → JWT Settings → JWT Secret
    SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET', '')

    # Email (for any server-side email needs)
    EMAIL_USER = os.getenv('EMAIL_USER')
    EMAIL_PASS = os.getenv('EMAIL_PASS')

    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
