from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class DepartmentInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    name: str
    nodal_officer: Optional[str] = None
    contact_email: Optional[str] = None


class ApprovalSLAResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    approval_id: int
    approval_code: Optional[str] = None
    approval_title: str
    approval_status: str
    stage_order: int
    department: Optional[DepartmentInfo] = None
    owner: Optional[str] = None
    start_date: Optional[datetime] = None
    expected_completion_date: Optional[datetime] = None
    actual_completion_date: Optional[datetime] = None
    target_days: int
    days_elapsed: int
    days_remaining: int
    is_overdue: bool
    sla_status: str
    risk_level: str
    utilization_percentage: float
    bottleneck_risk_score: float


class ProjectSLASummaryResponse(BaseModel):
    project_id: int
    project_code: str
    project_name: str
    total_approvals: int
    completed_approvals: int
    on_time_approvals: int
    approaching_sla_approvals: int
    overdue_approvals: int
    high_risk_approvals: int
    critical_approvals: int
    average_sla_utilization: float
    overall_health: str
    summary_notes: str
