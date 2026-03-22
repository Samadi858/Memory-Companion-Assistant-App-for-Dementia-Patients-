from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models


async def get_completed_reminder_ids_for_date(db: AsyncSession, user_id: int, target_date: date):
    result = await db.execute(
        select(models.ReminderCompletion.reminder_id).where(
            models.ReminderCompletion.user_id == user_id,
            models.ReminderCompletion.completed_date == target_date,
        )
    )
    return {row[0] for row in result.all()}


async def set_reminder_completion(
    db: AsyncSession,
    *,
    user_id: int,
    reminder_id: int,
    target_date: date,
    completed: bool,
):
    existing_result = await db.execute(
        select(models.ReminderCompletion).where(
            models.ReminderCompletion.user_id == user_id,
            models.ReminderCompletion.reminder_id == reminder_id,
            models.ReminderCompletion.completed_date == target_date,
        )
    )
    existing = existing_result.scalars().first()

    if completed:
        if existing is None:
            db.add(
                models.ReminderCompletion(
                    user_id=user_id,
                    reminder_id=reminder_id,
                    completed_date=target_date,
                )
            )
    else:
        if existing is not None:
            await db.delete(existing)

    await db.commit()
