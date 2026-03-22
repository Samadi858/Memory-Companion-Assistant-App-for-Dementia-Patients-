from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models


async def get_patient_user(db: AsyncSession, user_id: int | None = None):
    if user_id is not None:
        result = await db.execute(select(models.User).where(models.User.id == user_id))
        return result.scalars().first()

    result = await db.execute(select(models.User).order_by(models.User.id.asc()).limit(1))
    return result.scalars().first()


async def get_todays_reminders(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(models.Reminder)
        .where(
            models.Reminder.user_id == user_id,
            models.Reminder.enabled == 1,
            models.Reminder.status != 'deleted',
        )
        .order_by(models.Reminder.time.asc())
    )
    reminders = result.scalars().all()
    weekday = date.today().weekday()  # Monday=0 .. Sunday=6

    def is_due_today(frequency: str | None) -> bool:
        if not frequency:
            return True

        value = frequency.lower()
        if value == "daily":
            return True
        if value == "weekdays":
            return weekday < 5
        if value == "weekends":
            return weekday >= 5
        return True

    return [item for item in reminders if is_due_today(item.frequency)]
