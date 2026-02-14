from pydantic import BaseModel
from typing import Optional

class ReminderBase(BaseModel):
    time: str
    name: str # Renamed from activity
    type: str = "task"
    color: str = "bg-blue-400"
    icon: str = "📋"
    enabled: bool = True

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    time: Optional[str] = None
    name: Optional[str] = None
    type: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    enabled: Optional[bool] = None

class ReminderResponse(ReminderBase):
    id: int

    class Config:
        from_attributes = True
