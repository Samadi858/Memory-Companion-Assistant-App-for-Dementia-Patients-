from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas

async def get_reminder(db: AsyncSession, reminder_id: int):
    result = await db.execute(select(models.Reminder).filter(models.Reminder.id == reminder_id, models.Reminder.status != 'deleted'))
    return result.scalars().first()

async def get_reminders(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Reminder).filter(models.Reminder.status != 'deleted').offset(skip).limit(limit))
    return result.scalars().all()

async def create_reminder(db: AsyncSession, reminder: schemas.ReminderCreate):
    db_reminder = models.Reminder(**reminder.dict())
    db_reminder.status = 'active' # Ensure status is set
    db.add(db_reminder)
    await db.commit()
    await db.refresh(db_reminder)
    return db_reminder

async def update_reminder(db: AsyncSession, reminder_id: int, reminder: schemas.ReminderUpdate):
    # Fetch ensuring it's not deleted
    db_reminder = await get_reminder(db, reminder_id)
    if not db_reminder:
        return None
    
    update_data = reminder.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reminder, key, value)
    
    await db.commit()
    await db.refresh(db_reminder)
    return db_reminder

async def delete_reminder(db: AsyncSession, reminder_id: int):
    # Fetch ensuring it's not deleted
    db_reminder = await get_reminder(db, reminder_id)
    if not db_reminder:
        return None
    
    # Soft delete
    db_reminder.status = 'deleted'
    await db.commit()
    await db.refresh(db_reminder)
    return db_reminder
