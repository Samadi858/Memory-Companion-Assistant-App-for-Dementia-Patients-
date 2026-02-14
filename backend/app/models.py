from sqlalchemy import Column, Integer, String
from .database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(String(50), index=True)
    name = Column(String(255), index=True)
    type = Column(String(50), default="task")
    color = Column(String(50), default="bg-blue-400")
    icon = Column(String(10))
    enabled = Column(Integer, default=1) # Boolean as Integer 0/1
