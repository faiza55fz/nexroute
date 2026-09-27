from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import SLAStatus

if TYPE_CHECKING:
    from app.models.approval import Approval


class SLA(Base):
    __tablename__ = "slas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    approval_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("approvals.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    target_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    days_elapsed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    days_remaining: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    expected_completion_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    actual_completion_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    is_breached: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    bottleneck_risk_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=SLAStatus.ON_TRACK.value,
        nullable=False,
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
    approval: Mapped["Approval"] = relationship("Approval", back_populates="sla")
