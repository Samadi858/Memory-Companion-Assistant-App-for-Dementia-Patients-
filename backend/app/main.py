from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import reminders
from .database import engine, Base

app = FastAPI()

# Allow frontend to access backend
origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(reminders.router, prefix="/reminders", tags=["reminders"])

@app.get("/")
def read_root():
    return {"message": "Dementia Assistive System Backend API"}
