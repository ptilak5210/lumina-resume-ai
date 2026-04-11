import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()
db_url = os.environ.get("DATABASE_URL")

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'resumes';")
    cols = cur.fetchall()
    print("Columns in 'resumes' table:")
    for col in cols:
        print(f"- {col[0]} ({col[1]})")
    cur.close()
    conn.close()
except Exception as e:
    print("DB error:", e)
