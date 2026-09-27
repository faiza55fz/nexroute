from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.sla import DepartmentInfo


class BlockedApprovalInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    approval_id: int
    code: Optional[str] = None
    title: str
    status: str
    stage_order: int
    dependency_type: str
    notes: Optional[str] = None


class PrerequisiteApprovalInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    prerequisite_approval_id: int
    code: Optional[str] = None
    title: str
    status: str
    stage_order: int
    dependency_type: str
    is_satisfied: bool
    notes: Optional[str] = None


class BottleneckItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    approval_id: int
    approval_code: Optional[str] = None
    approval_title: str
    approval_status: str
    stage_order: int
    department: Optional[DepartmentInfo] = None
    sla_risk: str
    delay_duration_days: int
    is_overdue: bool
    blocking_reasons: List[str]
    downstream_affected_count: int
    severity: str
    blocked_downstream_approvals: List[BlockedApprovalInfo] = []
    waiting_on_prerequisites: List[PrerequisiteApprovalInfo] = []


class MostCriticalBlockerInfo(BaseModel):
    approval_id: int
    approval_code: Optional[str] = None
    approval_title: str
    department_name: Optional[str] = None
    severity: str
    downstream_affected_count: int
    delay_duration_days: int
    reason: str


class BottleneckSummaryResponse(BaseModel):
    project_id: int
    project_code: str
    project_name: str
    total_bottlenecks: int
    critical_bottlenecks: int
    high_risk_bottlenecks: int
    medium_risk_bottlenecks: int
    departments_affected: List[str]
    approvals_affected: int
    most_critical_blocker: Optional[MostCriticalBlockerInfo] = None
    recommendation: str
