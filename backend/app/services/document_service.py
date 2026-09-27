from datetime import datetime, timezone
import json
import os
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import (
    Approval,
    ApprovalDocument,
    Department,
    Document,
    DocumentStatus,
    Project,
    RequiredDocument,
)
from app.schemas.document import (
    DocumentCreate,
    DocumentResponse,
    DocumentReuseRequest,
    DocumentReuseResponse,
    DocumentValidationResponse,
    LinkedApprovalInfo,
    ReadinessSummaryResponse,
    RequiredDocumentResponse,
)


def get_project_or_404(db: Session, project_id: int) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found.",
        )
    return project


def get_document_or_404(db: Session, project_id: int, document_id: int) -> Document:
    # Ensure project exists first
    get_project_or_404(db, project_id)

    doc = (
        db.query(Document)
        .filter(Document.id == document_id, Document.project_id == project_id)
        .first()
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {document_id} not found for project {project_id}.",
        )
    return doc


def build_document_response(db: Session, doc: Document) -> DocumentResponse:
    # Query linked approvals via ApprovalDocument junction
    appr_links = (
        db.query(ApprovalDocument, Approval, Department)
        .join(Approval, ApprovalDocument.approval_id == Approval.id)
        .outerjoin(Department, Approval.department_id == Department.id)
        .filter(ApprovalDocument.document_id == doc.id)
        .all()
    )

    linked_approvals: List[LinkedApprovalInfo] = []
    for appr_doc, approval, department in appr_links:
        linked_approvals.append(
            LinkedApprovalInfo(
                approval_id=approval.id,
                code=approval.code,
                title=approval.title,
                department_name=department.name if department else None,
                submission_status=appr_doc.submission_status,
            )
        )

    return DocumentResponse(
        id=doc.id,
        project_id=doc.project_id,
        title=doc.title,
        document_type=doc.document_type,
        file_name=doc.file_name,
        file_path=doc.file_path,
        status=doc.status,
        is_reusable=doc.is_reusable,
        is_verified=doc.is_verified,
        validation_remarks=doc.validation_remarks,
        metadata_json=doc.metadata_json,
        uploaded_at=doc.uploaded_at,
        verified_at=doc.verified_at,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
        reuse_count=len(linked_approvals),
        linked_approvals=linked_approvals,
    )


def get_project_documents(db: Session, project_id: int) -> List[DocumentResponse]:
    get_project_or_404(db, project_id)

    docs = (
        db.query(Document)
        .filter(Document.project_id == project_id)
        .order_by(Document.id.asc())
        .all()
    )
    return [build_document_response(db, doc) for doc in docs]


def get_required_documents(db: Session, project_id: int) -> List[RequiredDocumentResponse]:
    get_project_or_404(db, project_id)

    results = (
        db.query(RequiredDocument, Approval, Department, Document)
        .join(Approval, RequiredDocument.approval_id == Approval.id)
        .outerjoin(Department, Approval.department_id == Department.id)
        .outerjoin(Document, RequiredDocument.fulfilled_by_document_id == Document.id)
        .filter(Approval.project_id == project_id)
        .order_by(Approval.stage_order.asc(), RequiredDocument.id.asc())
        .all()
    )

    items: List[RequiredDocumentResponse] = []
    for req_doc, approval, department, fulfilled_doc in results:
        is_fulfilled = fulfilled_doc is not None
        items.append(
            RequiredDocumentResponse(
                id=req_doc.id,
                approval_id=approval.id,
                approval_code=approval.code,
                approval_title=approval.title,
                department_name=department.name if department else None,
                document_type=req_doc.document_type,
                title=req_doc.title,
                description=req_doc.description,
                is_mandatory=req_doc.is_mandatory,
                status=req_doc.status,
                is_fulfilled=is_fulfilled,
                fulfilled_by_document_id=fulfilled_doc.id if fulfilled_doc else None,
                fulfilled_by_document_title=fulfilled_doc.title if fulfilled_doc else None,
                fulfilled_by_document_status=fulfilled_doc.status if fulfilled_doc else None,
            )
        )
    return items


def calculate_readiness(db: Session, project_id: int) -> ReadinessSummaryResponse:
    project = get_project_or_404(db, project_id)

    # Query all RequiredDocument rows belonging to this project's approvals
    required_docs = (
        db.query(RequiredDocument)
        .join(Approval, RequiredDocument.approval_id == Approval.id)
        .filter(Approval.project_id == project_id)
        .all()
    )

    total_required = len(required_docs)
    verified_count = 0
    pending_count = 0
    attention_count = 0
    missing_count = 0

    for req in required_docs:
        req_status = (req.status or "").lower()
        if req_status == DocumentStatus.VERIFIED.value:
            verified_count += 1
        elif req_status in (
            DocumentStatus.PENDING_VERIFICATION.value,
            DocumentStatus.UPLOADED.value,
        ):
            pending_count += 1
        elif req_status == DocumentStatus.ATTENTION.value:
            attention_count += 1
        elif req_status == DocumentStatus.MISSING.value or req.fulfilled_by_document_id is None:
            missing_count += 1
        else:
            pending_count += 1

    if total_required == 0:
        readiness_pct = 0.0
        readiness_level = "CRITICAL"
        notes = "No statutory required documents defined for this project's approvals."
    else:
        readiness_pct = round((verified_count / total_required) * 100, 1)
        if readiness_pct >= 80.0:
            readiness_level = "HIGH"
        elif readiness_pct >= 50.0:
            readiness_level = "MEDIUM"
        elif readiness_pct > 0.0:
            readiness_level = "LOW"
        else:
            readiness_level = "CRITICAL"

        notes = (
            f"{verified_count} of {total_required} statutory requirements verified ({readiness_pct}%). "
            f"{missing_count} missing, {pending_count} pending verification, {attention_count} attention flagged."
        )

    # Count distinct reusable verified documents for this project
    reusable_verified_count = (
        db.query(Document)
        .filter(
            Document.project_id == project_id,
            Document.status == DocumentStatus.VERIFIED.value,
            Document.is_reusable == True,  # noqa: E712
        )
        .count()
    )

    return ReadinessSummaryResponse(
        project_id=project.id,
        project_code=project.code,
        project_name=project.name,
        total_required_documents=total_required,
        verified_documents=verified_count,
        pending_documents=pending_count,
        attention_documents=attention_count,
        missing_documents=missing_count,
        readiness_percentage=readiness_pct,
        reusable_verified_document_count=reusable_verified_count,
        readiness_level=readiness_level,
        summary_notes=notes,
    )


def upload_document_metadata(
    db: Session, project_id: int, payload: DocumentCreate
) -> DocumentResponse:
    get_project_or_404(db, project_id)

    title = payload.resolved_title()
    doc_type = payload.resolved_document_type()
    is_reusable = payload.resolved_is_reusable()

    # Validate approval if provided
    approval: Optional[Approval] = None
    if payload.approval_id:
        approval = (
            db.query(Approval)
            .filter(Approval.id == payload.approval_id, Approval.project_id == project_id)
            .first()
        )
        if not approval:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Approval ID {payload.approval_id} does not belong to project {project_id}.",
            )

    file_name = payload.file_name or f"{doc_type.lower()}_upload.pdf"
    file_path = payload.file_path or f"/storage/documents/prj_{project_id}/{file_name}"

    new_doc = Document(
        project_id=project_id,
        document_type=doc_type,
        title=title,
        file_name=file_name,
        file_path=file_path,
        status=DocumentStatus.PENDING_VERIFICATION.value,
        is_reusable=is_reusable,
        is_verified=False,
        validation_remarks="Newly uploaded document. Pending automated/officer pre-validation.",
        metadata_json=payload.metadata_json,
        uploaded_at=datetime.now(timezone.utc),
        verified_at=None,
    )
    db.add(new_doc)
    db.flush()

    # If approval_id is provided, associate in ApprovalDocument
    if approval:
        appr_doc = ApprovalDocument(
            approval_id=approval.id,
            document_id=new_doc.id,
            submission_status="attached",
            notes=f"Uploaded and attached to {approval.code or approval.title}",
        )
        db.add(appr_doc)

        # Check if approval has an unfulfilled RequiredDocument of matching document_type
        req_match = (
            db.query(RequiredDocument)
            .filter(
                RequiredDocument.approval_id == approval.id,
                RequiredDocument.document_type == doc_type,
                RequiredDocument.fulfilled_by_document_id.is_(None),
            )
            .first()
        )
        if req_match:
            req_match.fulfilled_by_document_id = new_doc.id
            req_match.status = DocumentStatus.PENDING_VERIFICATION.value

    db.commit()
    db.refresh(new_doc)
    return build_document_response(db, new_doc)


def validate_document(
    db: Session, project_id: int, document_id: int
) -> DocumentValidationResponse:
    doc = get_document_or_404(db, project_id, document_id)

    issues: List[str] = []

    # Rule 1: File name existence
    if not doc.file_name or not doc.file_name.strip():
        issues.append("Missing document file name or storage reference.")

    # Rule 2: Permitted file extensions
    allowed_extensions = {".pdf", ".dwg", ".dxf", ".jpg", ".jpeg", ".png"}
    if doc.file_name:
        _, ext = os.path.splitext(doc.file_name)
        if ext.lower() not in allowed_extensions:
            issues.append(
                f"Invalid file extension '{ext}'. Permitted extensions: {', '.join(sorted(allowed_extensions))}."
            )

    # Rule 3: Required metadata integrity (title, document_type)
    if not doc.title or len(doc.title.strip()) < 3:
        issues.append("Document title is missing or insufficient (minimum 3 characters).")
    if not doc.document_type or len(doc.document_type.strip()) < 2:
        issues.append("Document category/type is unspecified.")

    # Rule 4: Simulated defect markers & attention keywords
    file_lower = (doc.file_name or "").lower()
    title_lower = (doc.title or "").lower()
    defect_keywords = ["corrupt", "invalid", "incomplete", "expired", "draft_unapproved", "test_fail"]
    for kw in defect_keywords:
        if kw in file_lower or kw in title_lower:
            issues.append(f"Document flagged with simulated invalid/defective marker: '{kw}'.")
            break

    # Rule 5: Check existing unresolved boundary/survey discrepancy remarks
    if doc.validation_remarks:
        rem_lower = doc.validation_remarks.lower()
        if "discrepancy" in rem_lower or "mismatch" in rem_lower or "boundary" in rem_lower:
            if doc.status == DocumentStatus.ATTENTION.value:
                issues.append(f"Field survey anomaly flagged: {doc.validation_remarks}")

    # Rule 6: Validate JSON structure if metadata_json is supplied
    if doc.metadata_json:
        try:
            json.loads(doc.metadata_json)
        except Exception:
            issues.append("Attached metadata_json contains invalid JSON syntax.")

    now = datetime.now(timezone.utc)
    passed = len(issues) == 0

    if passed:
        doc.status = DocumentStatus.VERIFIED.value
        doc.is_verified = True
        doc.verified_at = now
        doc.validation_remarks = (
            "Pre-validation passed: Document format, structure, and required metadata verified."
        )
    else:
        doc.status = DocumentStatus.ATTENTION.value
        doc.is_verified = False
        doc.validation_remarks = "Pre-validation attention required: " + " | ".join(issues)

    # Propagate status to any linked RequiredDocument records
    linked_reqs = (
        db.query(RequiredDocument)
        .filter(RequiredDocument.fulfilled_by_document_id == doc.id)
        .all()
    )
    for req in linked_reqs:
        req.status = doc.status

    db.commit()
    db.refresh(doc)

    return DocumentValidationResponse(
        document_id=doc.id,
        title=doc.title,
        document_type=doc.document_type,
        status=doc.status,
        passed=passed,
        issues=issues,
        validation_remarks=doc.validation_remarks or "",
        validated_at=now,
        document=build_document_response(db, doc),
    )


def reuse_document(
    db: Session, project_id: int, document_id: int, payload: DocumentReuseRequest
) -> DocumentReuseResponse:
    doc = get_document_or_404(db, project_id, document_id)

    # Validate approval exists and belongs to project
    approval = (
        db.query(Approval)
        .filter(Approval.id == payload.approval_id, Approval.project_id == project_id)
        .first()
    )
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Approval ID {payload.approval_id} does not belong to project {project_id}.",
        )

    # Check if already linked
    existing_link = (
        db.query(ApprovalDocument)
        .filter(
            ApprovalDocument.approval_id == payload.approval_id,
            ApprovalDocument.document_id == document_id,
        )
        .first()
    )

    if existing_link:
        message = f"Document is already linked to clearance [{approval.code or approval.id}]."
        sub_status = existing_link.submission_status
    else:
        sub_status = "accepted" if doc.is_verified else "attached"
        new_link = ApprovalDocument(
            approval_id=payload.approval_id,
            document_id=document_id,
            submission_status=sub_status,
            notes=payload.notes or f"Reused verified project documentation for {approval.title}",
        )
        db.add(new_link)
        message = f"Document successfully attached and reused for clearance [{approval.code or approval.id}]."

    # Automatically fulfill any matching unfulfilled RequiredDocument in that approval
    req_match = (
        db.query(RequiredDocument)
        .filter(
            RequiredDocument.approval_id == payload.approval_id,
            RequiredDocument.document_type == doc.document_type,
            RequiredDocument.fulfilled_by_document_id.is_(None),
        )
        .first()
    )
    if req_match:
        req_match.fulfilled_by_document_id = doc.id
        req_match.status = doc.status

    db.commit()

    return DocumentReuseResponse(
        document_id=doc.id,
        approval_id=approval.id,
        approval_code=approval.code,
        approval_title=approval.title,
        message=message,
        submission_status=sub_status,
        reused_document=build_document_response(db, doc),
    )


def get_reusable_documents(db: Session, project_id: int) -> List[DocumentResponse]:
    get_project_or_404(db, project_id)

    docs = (
        db.query(Document)
        .filter(
            Document.project_id == project_id,
            Document.is_reusable == True,  # noqa: E712
            Document.status == DocumentStatus.VERIFIED.value,
        )
        .order_by(Document.id.asc())
        .all()
    )
    return [build_document_response(db, doc) for doc in docs]
