from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..domain import models


async def create_memory(
    db: AsyncSession,
    *,
    user_id: int,
    name: str,
    relationship: str,
    phone_number: str | None,
    display_color: str | None,
    notes: str | None,
    description: str,
    object_name: str | None,
    content_type: str | None,
):
    memory = models.PhotoMemory(
        user_id=user_id,
        name=name,
        relationship=relationship,
        phone_number=phone_number,
        display_color=display_color,
        notes=notes,
        description=description,
        object_name=object_name,
        content_type=content_type,
    )
    db.add(memory)
    await db.commit()
    await db.refresh(memory)
    return memory


async def get_memory_by_id(db: AsyncSession, memory_id: int):
    result = await db.execute(select(models.PhotoMemory).where(models.PhotoMemory.id == memory_id))
    return result.scalars().first()


async def get_memory_for_user(db: AsyncSession, memory_id: int, user_id: int):
    result = await db.execute(
        select(models.PhotoMemory).where(
            models.PhotoMemory.id == memory_id,
            models.PhotoMemory.user_id == user_id,
        )
    )
    return result.scalars().first()


async def list_memories_for_user(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(models.PhotoMemory)
        .where(models.PhotoMemory.user_id == user_id)
        .order_by(models.PhotoMemory.created_at.desc())
    )
    return result.scalars().all()


async def update_memory_details(
    db: AsyncSession,
    memory: models.PhotoMemory,
    *,
    name: str | None = None,
    relationship: str | None = None,
    phone_number: str | None = None,
    display_color: str | None = None,
    notes: str | None = None,
    description: str | None = None,
):
    if name is not None:
        memory.name = name
    if relationship is not None:
        memory.relationship = relationship
    if phone_number is not None:
        memory.phone_number = phone_number
    if display_color is not None:
        memory.display_color = display_color
    if notes is not None:
        memory.notes = notes
    if description is not None:
        memory.description = description

    await db.commit()
    await db.refresh(memory)
    return memory


async def delete_memory(db: AsyncSession, memory: models.PhotoMemory):
    await db.delete(memory)
    await db.commit()
