from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db, init_db
from app.routers import documents_router, projects_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create the database tables automatically on application startup for this prototype
    init_db()
    yield


app = FastAPI(
    title="NexRoute API",
    description="Backend API for the NexRoute SIH Prototype - Documents & Pre-validation",
    version="0.2.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8443",
        "http://127.0.0.1:8443",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
title="NexRoute API",
description="Backend API for the NexRoute SIH Prototype - Documents & Pre-validation",
version="0.2.0",
lifespan=lifespan,


# Register routers
app.include_router(documents_router)
app.include_router(projects_router)

@app.get("/")
def root():
    return {
        "message": "NexRoute API is running",
        "version": "0.2.0",
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def health_db_check(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).scalar()
        if result == 1:
            return {"status": "ok", "database": "connected"}
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database health check returned an unexpected result",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(exc)}",
        )