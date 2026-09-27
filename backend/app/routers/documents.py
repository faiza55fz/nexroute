from typing import List

from fastapi import APIRouter, Depends, Path, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.document import (
    DocumentCreate,
    DocumentResponse,
    DocumentReuseRequest,
    DocumentReuseResponse,
    DocumentValidationResponse,
    ReadinessSummaryResponse,
    RequiredDocumentResponse,
)
from app.services import document_service

router = APIRouter(
    prefix="/api/v1/projects/{project_id}/documents",
    tags=["Documents & Pre-validation"],
)


@router.get(
    "",
    response_model=List[DocumentResponse],
    summary="List all documents for a project",
    description="Retrieve all documents associated with the specified project, including validation status and approval associations.",
)
def get_project_documents(
    project_id: int = Path(..., description="ID of the project"),
    db: Session = Depends(get_db),
):
    return document_service.get_project_documents(db, project_id)


@router.get(
    "/readiness-summary",
    response_model=ReadinessSummaryResponse,
    summary="Get dynamic document readiness summary",
    description="Calculate real-time document readiness percentage and statutory document compliance across project clearances.",
)
def get_readiness_summary(
    project_id: int = Path(..., description="ID of the project"),
    db: Session = Depends(get_db),
):
    return document_service.calculate_readiness(db, project_id)


@router.get(
    "/required",
    response_model=List[RequiredDocumentResponse],
    summary="List required documents across project clearances",
    description="Return all statutory checklist documents required by the approvals linked to this project.",
)
def get_required_documents(
    project_id: int = Path(..., description="ID of the project"),
    db: Session = Depends(get_db),
):
    return document_service.get_required_documents(db, project_id)


@router.get(
    "/reusable",
    response_model=List[DocumentResponse],
    summary="List verified reusable documents",
    description="Retrieve all verified project documents eligible for cross-clearance reuse.",
)
def get_reusable_documents(
    project_id: int = Path(..., description="ID of the project"),
    db: Session = Depends(get_db),
):
    return document_service.get_reusable_documents(db, project_id)


@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload document metadata",
    description="Register metadata for an uploaded document. Initially placed in 'pending_verification' status.",
)
def upload_document(
    payload: DocumentCreate,
    project_id: int = Path(..., description="ID of the project"),
    db: Session = Depends(get_db),
):
    return document_service.upload_document_metadata(db, project_id, payload)


@router.post(
    "/{document_id}/validate",
    response_model=DocumentValidationResponse,
    summary="Run rule-based pre-validation on a document",
    description="Executes deterministic prototype pre-validation rules to verify metadata, structure, and check for defects before department submission.",
)
def validate_document(
    project_id: int = Path(..., description="ID of the project"),
    document_id: int = Path(..., description="ID of the document to validate"),
    db: Session = Depends(get_db),
):
    return document_service.validate_document(db, project_id, document_id)


@router.post(
    "/{document_id}/reuse",
    response_model=DocumentReuseResponse,
    summary="Reuse verified document for another clearance",
    description="Attaches an existing project document to another clearance without requiring re-upload.",
)
def reuse_document(
    payload: DocumentReuseRequest,
    project_id: int = Path(..., description="ID of the project"),
    document_id: int = Path(..., description="ID of the document to reuse"),
    db: Session = Depends(get_db),
):
    return document_service.reuse_document(db, project_id, document_id, payload)
