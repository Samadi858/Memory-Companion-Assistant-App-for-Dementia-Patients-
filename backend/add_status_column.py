
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "dementia_db")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def add_status_column():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        try:
            # Check if column exists
            result = connection.execute(text("SHOW COLUMNS FROM reminders LIKE 'status'"))
            if result.fetchone():
                print("Column 'status' already exists.")
            else:
                print("Adding 'status' column...")
                connection.execute(text("ALTER TABLE reminders ADD COLUMN status VARCHAR(50) DEFAULT 'active'"))
                print("Column 'status' added successfully.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    add_status_column()
