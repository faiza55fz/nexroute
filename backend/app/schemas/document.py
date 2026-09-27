from datetime import datetime
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class LinkedApprovalInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    approval_id: int
    code: Optional[str] = None
    title: str
    department_name: Optional[str] = None
    submission_status: str


class DocumentBase(BaseModel):
    title: str
    document_type: str
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    is_reusable: bool = True
    metadata_json: Optional[str] = None


class DocumentCreate(BaseModel):
    title: Optional[str] = None
    name: Optional[str] = None  # Friendly alias support
    document_type: Optional[str] = None
    category: Optional[str] = None  # Friendly alias support
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    approval_id: Optional[int] = None
    is_reusable: Optional[bool] = None
    reusable: Optional[bool] = None  # Friendly alias support
    metadata_json: Optional[str] = None

    def resolved_title(self) -> str:
        res = self.title or self.name
        if not res:
            raise ValueError("Document title or name is required")
        return res

    def resolved_document_type(self) -> str:
        res = self.document_type or self.category
        if not res:
            raise ValueError("Document category or document_type is required")
        return res.upper().replace(" ", "_")

    def resolved_is_reusable(self) -> bool:
        if self.is_reusable is not None:
            return self.is_reusable
        if self.reusable is not None:
            return self.reusable
        return True


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    title: str
    document_type: str
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    status: str
    is_reusable: bool
    is_verified: bool
    validation_remarks: Optional[str] = None
    metadata_json: Optional[str] = None
    uploaded_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    reuse_count: int = 0
    linked_approvals: List[LinkedApprovalInfo] = []


class RequiredDocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    approval_id: int
    approval_code: Optional[str] = None
    approval_title: str
    department_name: Optional[str] = None
    document_type: str
    title: str
    description: Optional[str] = None
    is_mandatory: bool
    status: str
    is_fulfilled: bool
    fulfilled_by_document_id: Optional[int] = None
    fulfilled_by_document_title: Optional[str] = None
    fulfilled_by_document_status: Optional[str] = None


class ReadinessSummaryResponse(BaseModel):
    project_id: int
    project_code: str
    project_name: str
    total_required_documents: int
    verified_documents: int
    pending_documents: int
    attention_documents: int
    missing_documents: int
    readiness_percentage: float
    reusable_verified_document_count: int
    readiness_level: str
    summary_notes: str


class DocumentValidationResponse(BaseModel):
    document_id: int
    title: str
    document_type: str
    status: str
    passed: bool
    issues: List[str]
    validation_remarks: str
    validated_at: datetime
    document: DocumentResponse


class DocumentReuseRequest(BaseModel):
    approval_id: int
    notes: Optional[str] = None


class DocumentReuseResponse(BaseModel):
    document_id: int
    approval_id: int
    approval_code: Optional[str] = None
    approval_title: str
    message: str
    submission_status: str
    reused_document: DocumentResponse
