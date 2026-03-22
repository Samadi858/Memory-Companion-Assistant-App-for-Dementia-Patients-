from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..domain import models, schemas


def _frequency_days(frequency: str | None) -> set[int]:
    value = (frequency or "daily").lower()
    if value == "daily":
        return {0, 1, 2, 3, 4, 5, 6}
    if value == "weekdays":
        return {0, 1, 2, 3, 4}
    if value == "weekends":
        return {5, 6}
    return {0, 1, 2, 3, 4, 5, 6}


def _frequencies_overlap(left: str | None, right: str | None) -> bool:
    return bool(_frequency_days(left) & _frequency_days(right))


async def find_conflicting_reminder(
    db: AsyncSession,
    *,
    user_id: int,
    time_value: str,
    frequency: str | None,
    exclude_id: int | None = None,
):
    query = select(models.Reminder).filter(
        models.Reminder.user_id == user_id,
        models.Reminder.status != "deleted",
        models.Reminder.enabled == 1,
        models.Reminder.time == time_value,
    )
    if exclude_id is not None:
        query = query.filter(models.Reminder.id != exclude_id)

    result = await db.execute(query)
    existing = result.scalars().all()
    for item in existing:
        if _frequencies_overlap(item.frequency, frequency):
            return item
    return None


async def get_reminder(db: AsyncSession, reminder_id: int, user_id: int):
    result = await db.execute(
        select(models.Reminder).filter(
            models.Reminder.id == reminder_id,
            models.Reminder.user_id == user_id,
            models.Reminder.status != 'deleted',
        )
    )
    return result.scalars().first()


async def get_reminders(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Reminder).filter(
            models.Reminder.user_id == user_id,
            models.Reminder.status != 'deleted',
        ).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def create_reminder(db: AsyncSession, reminder: schemas.ReminderCreate, user_id: int):
    conflict = await find_conflicting_reminder(
        db,
        user_id=user_id,
        time_value=reminder.time,
        frequency=reminder.frequency,
    )
    if conflict is not None:
        raise ValueError(
            f"Reminder conflict with '{conflict.name}' at {conflict.time} ({conflict.frequency})"
        )

    db_reminder = models.Reminder(**reminder.model_dump())
    db_reminder.user_id = user_id
    db_reminder.status = 'active'
    db.add(db_reminder)
    await db.commit()
    await db.refresh(db_reminder)
    return db_reminder


async def update_reminder(db: AsyncSession, reminder_id: int, reminder: schemas.ReminderUpdate, user_id: int):
    db_reminder = await get_reminder(db, reminder_id, user_id)
    if not db_reminder:
        return None

    next_time = reminder.time if reminder.time is not None else db_reminder.time
    next_frequency = reminder.frequency if reminder.frequency is not None else db_reminder.frequency
    next_enabled = reminder.enabled if reminder.enabled is not None else bool(db_reminder.enabled)

    if next_enabled:
        conflict = await find_conflicting_reminder(
            db,
            user_id=user_id,
            time_value=next_time,
            frequency=next_frequency,
            exclude_id=reminder_id,
        )
        if conflict is not None:
            raise ValueError(
                f"Reminder conflict with '{conflict.name}' at {conflict.time} ({conflict.frequency})"
            )

    update_data = reminder.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reminder, key, value)

    await db.commit()
    await db.refresh(db_reminder)
    return db_reminder


async def delete_reminder(db: AsyncSession, reminder_id: int, user_id: int):
    db_reminder = await get_reminder(db, reminder_id, user_id)
    if not db_reminder:
        return None

    db_reminder.status = 'deleted'
    await db.commit()
    await db.refresh(db_reminder)
    return db_reminder
