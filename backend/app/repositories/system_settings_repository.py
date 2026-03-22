from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models, schemas


async def get_system_settings(db: AsyncSession, caregiver_user_id: int):
    result = await db.execute(
        select(models.SystemSettings).where(models.SystemSettings.caregiver_user_id == caregiver_user_id)
    )
    settings = result.scalars().first()
    if settings is not None:
        return settings

    settings = models.SystemSettings(caregiver_user_id=caregiver_user_id)
    db.add(settings)
    await db.commit()
    await db.refresh(settings)
    return settings


async def upsert_system_settings(
    db: AsyncSession,
    caregiver_user_id: int,
    payload: schemas.SystemSettingsUpdateRequest,
):
    settings = await get_system_settings(db, caregiver_user_id)
    update_data = payload.model_dump()
    for key, value in update_data.items():
        setattr(settings, key, value)

    await db.commit()
    await db.refresh(settings)
    return settings
