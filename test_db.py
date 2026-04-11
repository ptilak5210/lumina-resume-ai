import psycopg2
import os

db_url = "postgresql://postgres:ptilak510@db.xgpxlfuybcynzoeiuace.supabase.co:5432/postgres"

def test_conn(url):
    try:
        conn = psycopg2.connect(url, connect_timeout=5)
        print(f"Success with {url}")
        conn.close()
        return True
    except Exception as e:
        print(f"Failed with {url}: {e}")
        return False

print("Testing ptilak510...")
test_conn(db_url)
