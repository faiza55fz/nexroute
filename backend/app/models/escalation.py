from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import EscalationPriority, EscalationStatus

if TYPE_CHECKING:
    from app.models.approval import Approval
    from app.models.department import Department


class Escalation(Base):
    __tablename__ = "escalations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    approval_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("approvals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    assigned_department_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(
        String(50),
        default=EscalationPriority.MEDIUM.value,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=EscalationStatus.OPEN.value,
        nullable=False,
    )
    assigned_owner: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    opened_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
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
    approval: Mapped["Approval"] = relationship("Approval", back_populates="escalations")
    assigned_department: Mapped[Optional["Department"]] = relationship(
        "Department",
        back_populates="escalations",
    )
    history: Mapped[List["EscalationHistory"]] = relationship(
        "EscalationHistory",
        back_populates="escalation",
        cascade="all, delete-orphan",
    )


class EscalationHistory(Base):
    __tablename__ = "escalation_histories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    escalation_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("escalations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    previous_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    new_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    actor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    escalation: Mapped["Escalation"] = relationship(
        "Escalation",
        back_populates="history",
    )
