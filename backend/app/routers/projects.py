from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from uuid import uuid4

from app.database import get_db
from app.models.project import Project

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["Projects"],
)


class ProjectCreate(BaseModel):
    name: str
    sector: Optional[str] = None
    location: Optional[str] = None
    investment: Optional[str] = None
    stage: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    code: str
    project_type: Optional[str] = None
    description: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
):
    name = payload.name.strip()
    if not name:
        raise HTTPException(
            status_code=400,
            detail="Project name is required",
        )

    details = [
        f"Location: {payload.location}" if payload.location else None,
        f"Investment: {payload.investment}" if payload.investment else None,
        f"Stage: {payload.stage}" if payload.stage else None,
    ]
    description = "\n".join(item for item in details if item)

    project = Project(
        name=name,
        code=f"NR-{uuid4().hex[:10].upper()}",
        project_type=payload.sector,
        description=description or None,
        status="active",
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.get("", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.id).all()