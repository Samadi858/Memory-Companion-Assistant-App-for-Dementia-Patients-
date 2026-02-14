from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from .. import crud, schemas, database

router = APIRouter()

@router.post("/", response_model=schemas.ReminderResponse)
async def create_reminder(reminder: schemas.ReminderCreate, db: AsyncSession = Depends(database.get_db)):
    return await crud.create_reminder(db, reminder)

@router.get("/", response_model=List[schemas.ReminderResponse])
async def read_reminders(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    return await crud.get_reminders(db, skip=skip, limit=limit)

@router.get("/{reminder_id}", response_model=schemas.ReminderResponse)
async def read_reminder(reminder_id: int, db: AsyncSession = Depends(database.get_db)):
    db_reminder = await crud.get_reminder(db, reminder_id)
    if db_reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return db_reminder

@router.put("/{reminder_id}", response_model=schemas.ReminderResponse)
async def update_reminder(reminder_id: int, reminder: schemas.ReminderUpdate, db: AsyncSession = Depends(database.get_db)):
    db_reminder = await crud.update_reminder(db, reminder_id, reminder)
    if db_reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return db_reminder

@router.delete("/{reminder_id}", response_model=schemas.ReminderResponse)
async def delete_reminder(reminder_id: int, db: AsyncSession = Depends(database.get_db)):
    db_reminder = await crud.delete_reminder(db, reminder_id)
    if db_reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return db_reminder
