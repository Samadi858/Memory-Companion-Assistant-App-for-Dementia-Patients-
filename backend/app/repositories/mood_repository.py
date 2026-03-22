from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models


async def create_mood_entry(db: AsyncSession, user_id: int, mood: str, note: str | None):
    db_entry = models.MoodEntry(
        user_id=user_id,
        mood=mood.strip(),
        note=note.strip() if isinstance(note, str) and note.strip() else None,
    )
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    return db_entry


async def get_mood_history(
    db: AsyncSession,
    user_id: int,
    skip: int = 0,
    limit: int = 50,
):
    result = await db.execute(
        select(models.MoodEntry)
        .where(models.MoodEntry.user_id == user_id)
        .order_by(models.MoodEntry.created_at.desc(), models.MoodEntry.id.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
