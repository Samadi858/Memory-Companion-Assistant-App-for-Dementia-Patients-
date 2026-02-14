from sqlalchemy import Column, Integer, String
from .database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(String(50), index=True)
    activity = Column(String(255), index=True)
    icon = Column(String(10))
