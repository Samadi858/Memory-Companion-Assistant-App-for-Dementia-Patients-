from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models


async def create_diary_entry(
    db: AsyncSession,
    *,
    user_id: int,
    activity: str,
    icon: str,
    occurred_at: datetime | None,
):
    entry = models.DiaryEntry(
        user_id=user_id,
        activity=activity.strip(),
        icon=(icon or "📝").strip()[:10],
        occurred_at=occurred_at or datetime.utcnow(),
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def list_diary_entries(
    db: AsyncSession,
    *,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
):
    result = await db.execute(
        select(models.DiaryEntry)
        .where(models.DiaryEntry.user_id == user_id)
        .order_by(models.DiaryEntry.occurred_at.desc(), models.DiaryEntry.id.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def get_diary_entry_for_user(db: AsyncSession, *, user_id: int, entry_id: int):
    result = await db.execute(
        select(models.DiaryEntry).where(
            models.DiaryEntry.id == entry_id,
            models.DiaryEntry.user_id == user_id,
        )
    )
    return result.scalars().first()


async def update_diary_entry(
    db: AsyncSession,
    *,
    entry: models.DiaryEntry,
    activity: str | None,
    icon: str | None,
    occurred_at: datetime | None,
):
    if isinstance(activity, str) and activity.strip():
        entry.activity = activity.strip()
    if isinstance(icon, str) and icon.strip():
        entry.icon = icon.strip()[:10]
    if occurred_at is not None:
        entry.occurred_at = occurred_at

    await db.commit()
    await db.refresh(entry)
    return entry


async def delete_diary_entry(db: AsyncSession, *, entry: models.DiaryEntry):
    await db.delete(entry)
    await db.commit()

