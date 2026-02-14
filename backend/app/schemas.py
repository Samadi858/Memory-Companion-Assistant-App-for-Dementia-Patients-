from pydantic import BaseModel
from typing import Optional

class ReminderBase(BaseModel):
    time: str
    activity: str
    icon: str

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    time: Optional[str] = None
    activity: Optional[str] = None
    icon: Optional[str] = None

class ReminderResponse(ReminderBase):
    id: int

    class Config:
        from_attributes = True
