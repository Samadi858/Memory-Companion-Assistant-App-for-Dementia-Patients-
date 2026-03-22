import asyncio
from datetime import datetime
import logging
from zoneinfo import ZoneInfo

from ..core import config
from ..database import SessionLocal
from ..repositories import alert_repository

_scheduler_task: asyncio.Task | None = None
logger = logging.getLogger(__name__)


async def _scheduler_loop() -> None:
    while True:
        try:
            async with SessionLocal() as db:
                now = datetime.now(ZoneInfo(config.APP_TIMEZONE))
                await alert_repository.enqueue_due_alerts(db, now)
        except Exception as exc:
            # Keep scheduler alive even if one cycle fails, but log the error.
            logger.exception("Alert scheduler cycle failed: %s", exc)
        await asyncio.sleep(30)


def start_scheduler() -> None:
    global _scheduler_task
    if _scheduler_task is None or _scheduler_task.done():
        _scheduler_task = asyncio.create_task(_scheduler_loop())


async def stop_scheduler() -> None:
    global _scheduler_task
    if _scheduler_task is None:
        return

    _scheduler_task.cancel()
    try:
        await _scheduler_task
    except asyncio.CancelledError:
        pass
    _scheduler_task = None
