from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import ApprovalStatus

if TYPE_CHECKING:
    from app.models.department import Department
    from app.models.document import ApprovalDocument, RequiredDocument
    from app.models.escalation import Escalation
    from app.models.project import Project
    from app.models.sla import SLA


class Approval(Base):
    __tablename__ = "approvals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    department_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    stage_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=ApprovalStatus.PENDING.value,
        nullable=False,
    )
    applied_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    approved_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
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
    project: Mapped["Project"] = relationship("Project", back_populates="approvals")
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="approvals")

    sla: Mapped[Optional["SLA"]] = relationship(
        "SLA",
        back_populates="approval",
        uselist=False,
        cascade="all, delete-orphan",
    )
    required_documents: Mapped[List["RequiredDocument"]] = relationship(
        "RequiredDocument",
        back_populates="approval",
        cascade="all, delete-orphan",
    )
    approval_documents: Mapped[List["ApprovalDocument"]] = relationship(
        "ApprovalDocument",
        back_populates="approval",
        cascade="all, delete-orphan",
    )
    dependencies: Mapped[List["ApprovalDependency"]] = relationship(
        "ApprovalDependency",
        foreign_keys="[ApprovalDependency.approval_id]",
        back_populates="approval",
        cascade="all, delete-orphan",
    )
    prerequisites_for: Mapped[List["ApprovalDependency"]] = relationship(
        "ApprovalDependency",
        foreign_keys="[ApprovalDependency.depends_on_approval_id]",
        back_populates="depends_on_approval",
        cascade="all, delete-orphan",
    )
    escalations: Mapped[List["Escalation"]] = relationship(
        "Escalation",
        back_populates="approval",
        cascade="all, delete-orphan",
    )


class ApprovalDependency(Base):
    __tablename__ = "approval_dependencies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    approval_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("approvals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    depends_on_approval_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("approvals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    dependency_type: Mapped[str] = mapped_column(
        String(50),
        default="hard_block",
        nullable=False,
    )
    is_satisfied: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    approval: Mapped["Approval"] = relationship(
        "Approval",
        foreign_keys=[approval_id],
        back_populates="dependencies",
    )
    depends_on_approval: Mapped["Approval"] = relationship(
        "Approval",
        foreign_keys=[depends_on_approval_id],
        back_populates="prerequisites_for",
    )
