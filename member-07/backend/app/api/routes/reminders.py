from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...core import security
from ...domain import models, schemas
from ...repositories import activity_log_repository, reminder_repository

router = APIRouter()


@router.post("/", response_model=schemas.ReminderResponse)
async def create_reminder(
    reminder: schemas.ReminderCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    try:
        created = await reminder_repository.create_reminder(db, reminder, current_user.id)
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc),
        )
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="reminder_created",
            title="Reminder created",
            description=f"{created.name} at {created.time}",
            status="completed",
            source="reminders",
        )
    except Exception:
        pass
    return created


@router.get("/", response_model=List[schemas.ReminderResponse])
async def read_reminders(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    return await reminder_repository.get_reminders(db, current_user.id, skip=skip, limit=limit)


@router.get("/{reminder_id}", response_model=schemas.ReminderResponse)
async def read_reminder(
    reminder_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    db_reminder = await reminder_repository.get_reminder(db, reminder_id, current_user.id)
    if db_reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return db_reminder


@router.put("/{reminder_id}", response_model=schemas.ReminderResponse)
async def update_reminder(
    reminder_id: int,
    reminder: schemas.ReminderUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    try:
        db_reminder = await reminder_repository.update_reminder(db, reminder_id, reminder, current_user.id)
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc),
        )
    if db_reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="reminder_updated",
            title="Reminder updated",
            description=f"{db_reminder.name} at {db_reminder.time}",
            status="completed",
            source="reminders",
        )
    except Exception:
        pass
    return db_reminder


@router.delete("/{reminder_id}", response_model=schemas.ReminderResponse)
async def delete_reminder(
    reminder_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    db_reminder = await reminder_repository.delete_reminder(db, reminder_id, current_user.id)
    if db_reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="reminder_deleted",
            title="Reminder deleted",
            description=f"{db_reminder.name} at {db_reminder.time}",
            status="completed",
            source="reminders",
        )
    except Exception:
        pass
    return db_reminder
