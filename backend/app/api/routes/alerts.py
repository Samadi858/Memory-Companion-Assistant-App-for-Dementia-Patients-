from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...core import security
from ...domain import models, schemas
from ...repositories import (
    activity_log_repository,
    alert_repository,
    patient_repository,
    reminder_completion_repository,
)

router = APIRouter()


@router.get("/active", response_model=schemas.AlertCheckResponse)
async def get_active_alert(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    row = await alert_repository.get_active_alert_for_user(db, current_user.id)
    if row is None:
        return schemas.AlertCheckResponse(has_alert=False)

    alert_event, reminder = row
    return schemas.AlertCheckResponse(
        has_alert=True,
        alert_id=alert_event.id,
        reminder_id=reminder.id,
        title=reminder.name,
        time=reminder.time,
        type=reminder.type,
        icon=reminder.icon or ("💊" if reminder.type == "medication" else "📋"),
        image_url=reminder.image_url,
        color=reminder.color or "bg-blue-400",
        triggered_at=alert_event.triggered_at,
    )


@router.post("/{alert_id}/done", response_model=schemas.AlertDoneResponse)
async def mark_alert_done(
    alert_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    row = await alert_repository.get_active_alert_for_user(db, current_user.id)
    reminder_name = "Reminder"
    if row is not None:
        _, reminder = row
        reminder_name = reminder.name

    completed_reminder_id = await alert_repository.mark_alert_done(db, alert_id, current_user.id)
    if completed_reminder_id is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    await reminder_completion_repository.set_reminder_completion(
        db,
        user_id=current_user.id,
        reminder_id=completed_reminder_id,
        target_date=date.today(),
        completed=True,
    )

    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="alert_done",
            title="Reminder marked done",
            description=f"{reminder_name} marked as done",
            status="completed",
            source="alerts",
        )
    except Exception:
        pass
    return schemas.AlertDoneResponse(message="Alert marked as done")


@router.get("/check-alerts", response_model=schemas.AlertCheckResponse)
async def check_alerts_alias(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    return await get_active_alert(db=db, current_user=current_user)


@router.post("/clear-alert/{alert_id}", response_model=schemas.AlertDoneResponse)
async def clear_alert_alias(
    alert_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    return await mark_alert_done(alert_id=alert_id, db=db, current_user=current_user)


@router.get("/patient/active", response_model=schemas.AlertCheckResponse)
async def get_active_alert_patient(
    user_id: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        return schemas.AlertCheckResponse(has_alert=False)

    row = await alert_repository.get_active_alert_for_user(db, patient.id)
    if row is None:
        return schemas.AlertCheckResponse(has_alert=False)

    alert_event, reminder = row
    return schemas.AlertCheckResponse(
        has_alert=True,
        alert_id=alert_event.id,
        reminder_id=reminder.id,
        title=reminder.name,
        time=reminder.time,
        type=reminder.type,
        icon=reminder.icon or ("💊" if reminder.type == "medication" else "📋"),
        image_url=reminder.image_url,
        color=reminder.color or "bg-blue-400",
        triggered_at=alert_event.triggered_at,
    )


@router.post("/patient/{alert_id}/done", response_model=schemas.AlertDoneResponse)
async def mark_alert_done_patient(
    alert_id: int,
    user_id: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    row = await alert_repository.get_active_alert_for_user(db, patient.id)
    reminder_name = "Reminder"
    if row is not None:
        _, reminder = row
        reminder_name = reminder.name

    completed_reminder_id = await alert_repository.mark_alert_done(db, alert_id, patient.id)
    if completed_reminder_id is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    await reminder_completion_repository.set_reminder_completion(
        db,
        user_id=patient.id,
        reminder_id=completed_reminder_id,
        target_date=date.today(),
        completed=True,
    )

    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=patient.id,
            event_type="alert_done",
            title="Reminder marked done",
            description=f"{reminder_name} marked as done",
            status="completed",
            source="alerts",
        )
    except Exception:
        pass

    return schemas.AlertDoneResponse(message="Alert marked as done")
