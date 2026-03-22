from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...domain import schemas
from ...repositories import activity_log_repository, diary_repository, patient_repository

router = APIRouter()


@router.post("/entries", response_model=schemas.DiaryEntryResponse, status_code=201)
async def create_diary_entry(
    payload: schemas.DiaryEntryCreateRequest,
    db: AsyncSession = Depends(database.get_db),
):
    if not payload.activity or not payload.activity.strip():
        raise HTTPException(status_code=400, detail="Activity is required")

    patient = await patient_repository.get_patient_user(db, user_id=payload.user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    entry = await diary_repository.create_diary_entry(
        db,
        user_id=patient.id,
        activity=payload.activity,
        icon=payload.icon or "📝",
        occurred_at=payload.occurred_at,
    )

    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=patient.id,
            event_type="diary_entry_created",
            title="Diary entry added",
            description=entry.activity,
            status="completed",
            source="diary",
        )
    except Exception:
        pass

    return entry


@router.get("/entries", response_model=list[schemas.DiaryEntryResponse])
async def list_diary_entries(
    user_id: Optional[int] = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return await diary_repository.list_diary_entries(db, user_id=patient.id, skip=skip, limit=limit)


@router.patch("/entries/{entry_id}", response_model=schemas.DiaryEntryResponse)
async def update_diary_entry(
    entry_id: int,
    payload: schemas.DiaryEntryUpdateRequest,
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=payload.user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    entry = await diary_repository.get_diary_entry_for_user(db, user_id=patient.id, entry_id=entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Diary entry not found")

    if payload.activity is not None and not payload.activity.strip():
        raise HTTPException(status_code=400, detail="Activity cannot be empty")

    updated = await diary_repository.update_diary_entry(
        db,
        entry=entry,
        activity=payload.activity,
        icon=payload.icon,
        occurred_at=payload.occurred_at,
    )

    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=patient.id,
            event_type="diary_entry_updated",
            title="Diary entry updated",
            description=updated.activity,
            status="completed",
            source="diary",
        )
    except Exception:
        pass

    return updated


@router.delete("/entries/{entry_id}", response_model=schemas.MessageResponse)
async def delete_diary_entry(
    entry_id: int,
    user_id: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(database.get_db),
):
    patient = await patient_repository.get_patient_user(db, user_id=user_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    entry = await diary_repository.get_diary_entry_for_user(db, user_id=patient.id, entry_id=entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Diary entry not found")

    description = entry.activity
    await diary_repository.delete_diary_entry(db, entry=entry)

    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=patient.id,
            event_type="diary_entry_deleted",
            title="Diary entry deleted",
            description=description,
            status="completed",
            source="diary",
        )
    except Exception:
        pass

    return schemas.MessageResponse(message="Diary entry deleted")

