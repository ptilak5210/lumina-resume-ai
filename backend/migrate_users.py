import os
import sys
from sqlalchemy import text

# Add the project directory to sys.path so 'app' can be imported
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db

app = create_app()

with app.app_context():
    with db.engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN title VARCHAR(100);"))
            print("Added title column")
        except Exception as e: print(e)
            
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN location VARCHAR(100);"))
            print("Added location column")
        except Exception as e: print(e)

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN bio TEXT;"))
            print("Added bio column")
        except Exception as e: print(e)

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(256);"))
            print("Added avatar_url column")
        except Exception as e: print(e)

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'free';"))
            print("Added subscription_tier column")
        except Exception as e: print(e)

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN email_notifications BOOLEAN DEFAULT true;"))
            print("Added email_notifications column")
        except Exception as e: print(e)

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN marketing_emails BOOLEAN DEFAULT false;"))
            print("Added marketing_emails column")
        except Exception as e: print(e)

        conn.commit()
        print("Migration complete!")

