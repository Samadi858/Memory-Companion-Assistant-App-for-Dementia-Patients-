from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...domain import schemas
from ...repositories import patient_repository, reminder_completion_repository

router = APIRouter()


@router.get("/details", response_model=schemas.PatientDetailsResponse)
async def get_patient_details(
    user_id: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return schemas.PatientDetailsResponse(
        id=patient.id,
        full_name=patient.full_name,
        email=patient.email,
        date=date.today().isoformat(),
    )


@router.get("/reminders/today", response_model=List[schemas.PatientReminderResponse])
async def get_patient_todays_reminders(
    user_id: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    reminders = await patient_repository.get_todays_reminders(db, patient.id)
    completed_ids = await reminder_completion_repository.get_completed_reminder_ids_for_date(
        db,
        patient.id,
        date.today(),
    )

    return [
        schemas.PatientReminderResponse(
            id=item.id,
            title=item.name,
            time=item.time,
            type="Medicine" if item.type == "medication" else "Task",
            completed=item.id in completed_ids,
            icon_color=item.color,
            icon=item.icon or ("💊" if item.type == "medication" else "📋"),
            image_url=item.image_url,
        )
        for item in reminders
    ]


@router.post("/reminders/{reminder_id}/completion")
async def set_patient_reminder_completion(
    reminder_id: int,
    payload: schemas.ReminderCompletionRequest,
    user_id: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    reminders = await patient_repository.get_todays_reminders(db, patient.id)
    reminder_ids = {item.id for item in reminders}
    if reminder_id not in reminder_ids:
        raise HTTPException(status_code=404, detail="Reminder not found for patient")

    await reminder_completion_repository.set_reminder_completion(
        db,
        user_id=patient.id,
        reminder_id=reminder_id,
        target_date=date.today(),
        completed=payload.completed,
    )

    return {"success": True, "reminder_id": reminder_id, "completed": payload.completed}
