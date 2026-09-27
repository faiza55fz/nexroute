from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import DocumentStatus

if TYPE_CHECKING:
    from app.models.approval import Approval
    from app.models.project import Project


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    document_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=DocumentStatus.MISSING.value,
        nullable=False,
    )
    is_reusable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    validation_remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    uploaded_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="documents")
    approval_documents: Mapped[List["ApprovalDocument"]] = relationship(
        "ApprovalDocument",
        back_populates="document",
        cascade="all, delete-orphan",
    )
    required_documents: Mapped[List["RequiredDocument"]] = relationship(
        "RequiredDocument",
        back_populates="fulfilled_by_document",
    )


class RequiredDocument(Base):
    __tablename__ = "required_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    approval_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("approvals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    document_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=DocumentStatus.MISSING.value,
        nullable=False,
    )
    fulfilled_by_document_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("documents.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    approval: Mapped["Approval"] = relationship("Approval", back_populates="required_documents")
    fulfilled_by_document: Mapped[Optional["Document"]] = relationship(
        "Document",
        back_populates="required_documents",
    )


class ApprovalDocument(Base):
    __tablename__ = "approval_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    approval_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("approvals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    document_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    submission_status: Mapped[str] = mapped_column(
        String(50),
        default="attached",
        nullable=False,
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    attached_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    approval: Mapped["Approval"] = relationship("Approval", back_populates="approval_documents")
    document: Mapped["Document"] = relationship("Document", back_populates="approval_documents")
