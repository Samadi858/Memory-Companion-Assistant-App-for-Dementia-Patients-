from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .api import api_router
from .core import alert_scheduler, storage
from .database import Base, engine

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    storage.ensure_bucket_exists()
    alert_scheduler.start_scheduler()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Lightweight migration for existing databases:
        # ensure reminders.user_id exists and is linked to users.id.
        user_id_column = await conn.execute(text("SHOW COLUMNS FROM reminders LIKE 'user_id'"))
        if user_id_column.first() is None:
            await conn.execute(text("ALTER TABLE reminders ADD COLUMN user_id INT NULL"))
            await conn.execute(text("CREATE INDEX ix_reminders_user_id ON reminders (user_id)"))

        fk_check = await conn.execute(
            text(
                """
                SELECT CONSTRAINT_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'reminders'
                  AND COLUMN_NAME = 'user_id'
                  AND REFERENCED_TABLE_NAME = 'users'
                LIMIT 1
                """
            )
        )
        if fk_check.first() is None:
            await conn.execute(
                text(
                    """
                    ALTER TABLE reminders
                    ADD CONSTRAINT fk_reminders_user_id
                    FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE
                    """
                )
            )

        frequency_column = await conn.execute(text("SHOW COLUMNS FROM reminders LIKE 'frequency'"))
        if frequency_column.first() is None:
            await conn.execute(text("ALTER TABLE reminders ADD COLUMN frequency VARCHAR(50) DEFAULT 'daily'"))

        image_url_column = await conn.execute(text("SHOW COLUMNS FROM reminders LIKE 'image_url'"))
        if image_url_column.first() is None:
            await conn.execute(text("ALTER TABLE reminders ADD COLUMN image_url TEXT NULL"))

        pm_name_column = await conn.execute(text("SHOW COLUMNS FROM photo_memories LIKE 'name'"))
        if pm_name_column.first() is None:
            await conn.execute(text("ALTER TABLE photo_memories ADD COLUMN name VARCHAR(255) NULL"))

        pm_relationship_column = await conn.execute(text("SHOW COLUMNS FROM photo_memories LIKE 'relationship'"))
        if pm_relationship_column.first() is None:
            await conn.execute(text("ALTER TABLE photo_memories ADD COLUMN relationship VARCHAR(100) NULL"))

        pm_phone_column = await conn.execute(text("SHOW COLUMNS FROM photo_memories LIKE 'phone_number'"))
        if pm_phone_column.first() is None:
            await conn.execute(text("ALTER TABLE photo_memories ADD COLUMN phone_number VARCHAR(50) NULL"))

        pm_color_column = await conn.execute(text("SHOW COLUMNS FROM photo_memories LIKE 'display_color'"))
        if pm_color_column.first() is None:
            await conn.execute(text("ALTER TABLE photo_memories ADD COLUMN display_color VARCHAR(100) NULL"))

        pm_notes_column = await conn.execute(text("SHOW COLUMNS FROM photo_memories LIKE 'notes'"))
        if pm_notes_column.first() is None:
            await conn.execute(text("ALTER TABLE photo_memories ADD COLUMN notes TEXT NULL"))

        await conn.execute(text("ALTER TABLE photo_memories MODIFY COLUMN object_name VARCHAR(512) NULL"))
        await conn.execute(text("ALTER TABLE photo_memories MODIFY COLUMN content_type VARCHAR(128) NULL"))


@app.on_event("shutdown")
async def shutdown():
    await alert_scheduler.stop_scheduler()


app.include_router(api_router)


@app.get("/")
def read_root():
    return {"message": "Dementia Assistive System Backend API"}
