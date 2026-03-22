from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ... import database
from ...core import security
from ...domain import models, schemas
from ...repositories import activity_log_repository, system_settings_repository

router = APIRouter()


@router.get("/system", response_model=schemas.SystemSettingsResponse)
async def get_system_settings(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    return await system_settings_repository.get_system_settings(db, current_user.id)


@router.put("/system", response_model=schemas.SystemSettingsResponse)
async def update_system_settings(
    payload: schemas.SystemSettingsUpdateRequest,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(security.get_current_active_user),
):
    updated = await system_settings_repository.upsert_system_settings(db, current_user.id, payload)
    try:
        await activity_log_repository.create_activity_log(
            db,
            user_id=current_user.id,
            event_type="settings_updated",
            title="System settings updated",
            description="Caregiver saved system settings",
            status="completed",
            source="settings",
        )
    except Exception:
        pass
    return updated
