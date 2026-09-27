"""NexRoute SIH Prototype - Realistic Maharashtra Industrial Project Seeding Script

This script populates the database with realistic prototype data representing
industrial approval workflows in Maharashtra.

NOTE: All data is simulated for the Smart India Hackathon (SIH) prototype demonstration.
No actual live government or proprietary records are used.
"""

from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys

# Ensure backend root is on sys.path for direct script execution
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import func, text
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, init_db
from app.models import (
    Approval,
    ApprovalDependency,
    ApprovalDocument,
    ApprovalStatus,
    Department,
    Document,
    DocumentStatus,
    Escalation,
    EscalationHistory,
    EscalationPriority,
    EscalationStatus,
    Project,
    RequiredDocument,
    SLA,
    SLAStatus,
)


def clear_existing_data(db: Session) -> None:
    """Safely clear existing tables and reset autoincrement primary keys."""
    db.execute(
        text(
            "TRUNCATE TABLE projects, departments, approvals, documents, "
            "required_documents, approval_documents, slas, approval_dependencies, "
            "escalations, escalation_histories RESTART IDENTITY CASCADE;"
        )
    )
    db.commit()


def seed_departments(db: Session) -> dict[str, Department]:
    """Seed the 8 realistic Maharashtra government departments and authorities."""
    departments_data = [
        {
            "code": "MIDC",
            "name": "Maharashtra Industrial Development Corporation",
            "description": "Nodal statutory body providing industrial infrastructure, plot allotment, layout approvals, and industrial water supply in Maharashtra.",
            "contact_email": "allotment.hq@midc-mh.gov.in",
            "nodal_officer": "Shri R. K. Patil (Chief Executive Engineer)",
        },
        {
            "code": "MPCB",
            "name": "Maharashtra Pollution Control Board",
            "description": "State environmental regulatory agency governing Consent to Establish (CTE), Consent to Operate (CTO), and industrial emission standards.",
            "contact_email": "cte.support@mpcb-gov.in",
            "nodal_officer": "Dr. S. M. Deshmukh (Regional Officer)",
        },
        {
            "code": "DIR_IND",
            "name": "Directorate of Industries, Maharashtra",
            "description": "State single-window clearance facilitation, industrial incentives administration, and enterprise registrations under Maharashtra Industrial Policy.",
            "contact_email": "singlewindow@maharashtra-ind.gov.in",
            "nodal_officer": "Smt. A. V. Kulkarni (Joint Director of Industries)",
        },
        {
            "code": "MFES",
            "name": "Maharashtra Fire & Emergency Services",
            "description": "Statutory fire authority overseeing industrial fire prevention architecture, water storage norms, and issuing provisional and final Fire NOCs.",
            "contact_email": "firenoc@mahafire-gov.in",
            "nodal_officer": "Chief Fire Officer V. B. Jadhav",
        },
        {
            "code": "TOWN_PLAN",
            "name": "Town Planning and Valuation Department, Maharashtra",
            "description": "Authority governing master plan zoning compliance, Floor Area Ratio (FAR) scrutiny, building elevation approvals, and setback clearances.",
            "contact_email": "townplanning.hq@maharashtra.gov.in",
            "nodal_officer": "Shri A. N. Shinde (Director of Town Planning)",
        },
        {
            "code": "DISH",
            "name": "Directorate of Industrial Safety and Health (DISH)",
            "description": "Statutory body administering the Factories Act 1948 in Maharashtra, approving factory building plans, plant machinery layouts, and occupational safety.",
            "contact_email": "dish.approvals@maharashtra.gov.in",
            "nodal_officer": "Shri M. P. Gaikwad (Additional Director)",
        },
        {
            "code": "MSEDCL",
            "name": "Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL)",
            "description": "State utility provider handling industrial High Tension (HT) / Low Tension (LT) load approvals, substation connectivity, and power supply sanctions.",
            "contact_email": "htcommercial@mahadiscom.in",
            "nodal_officer": "Er. P. S. Sawant (Superintending Engineer - Commercial)",
        },
        {
            "code": "LABOUR_DEPT",
            "name": "Maharashtra Labour Commissionerate",
            "description": "Enforces labour welfare regulations, inter-state migrant worker compliances, and contract labour registration for industrial units.",
            "contact_email": "labourcomm@maharashtra.gov.in",
            "nodal_officer": "Shri S. T. Thorat (Deputy Labour Commissioner)",
        },
    ]

    dept_map: dict[str, Department] = {}
    for data in departments_data:
        dept = Department(**data)
        db.add(dept)
        dept_map[data["code"]] = dept

    db.flush()
    return dept_map


def seed_database() -> None:
    # Ensure tables exist before seeding
    init_db()

    db: Session = SessionLocal()
    try:
        print("Clearing existing records...")
        clear_existing_data(db)

        # Reference anchor time for realistic date calculations
        now = datetime(2026, 9, 27, 12, 0, 0, tzinfo=timezone.utc)

        # 1. Seed Departments
        print("Seeding Maharashtra government departments...")
        depts = seed_departments(db)

        # 2. Seed Projects across Maharashtra locations
        print("Seeding industrial projects...")
        projects_data = [
            {
                "code": "PRJ-MH-PUN-001",
                "name": "Sahyadri EV Components Gigafactory",
                "project_type": "Automobile components facility",
                "status": "active",
                "description": "35-acre greenfield electric drivetrain and battery pack manufacturing facility in Chakan Industrial Area, Phase II, Pune. High-readiness benchmark project with pre-validated compliance.",
                "created_at": now - timedelta(days=40),
            },
            {
                "code": "PRJ-MH-RAI-002",
                "name": "Konkan Active Pharma Ingredients Plant",
                "project_type": "Pharmaceutical manufacturing unit",
                "status": "active",
                "description": "Specialty bulk drug and chemical API synthesis unit in Roha MIDC, Raigad. Features advanced chemical reactor bays and solvent recovery installations with missing environmental documentation.",
                "created_at": now - timedelta(days=45),
            },
            {
                "code": "PRJ-MH-CSN-003",
                "name": "Marathwada Micro-Semiconductor Assembly Line",
                "project_type": "Electronics manufacturing facility",
                "status": "active",
                "description": "Precision surface-mount technology (SMT) and integrated semiconductor packaging unit at Shendra MIDC (AURIC Smart City), Chhatrapati Sambhajinagar. Documents uploaded, approaching SLA deadline.",
                "created_at": now - timedelta(days=30),
            },
            {
                "code": "PRJ-MH-NAG-004",
                "name": "Vidarbha Agro-Biotech Mega Food Park",
                "project_type": "Food processing plant",
                "status": "active",
                "description": "Integrated citrus, grain, and multi-commodity cold-chain processing facility in Butibori Industrial Zone, Nagpur. Contains a 7/12 extract boundary anomaly flagged with 'attention' state.",
                "created_at": now - timedelta(days=25),
            },
            {
                "code": "PRJ-MH-NSK-005",
                "name": "Godavari High-Tech Synthetic Weaving Mill",
                "project_type": "Textile manufacturing unit",
                "status": "delayed",
                "description": "Eco-friendly synthetic weaving and high-speed waterjet loom plant in Sinnar Industrial Belt, Nashik. Fire NOC and Factory Plan approval severely blocked by delayed Town Planning clearance.",
                "created_at": now - timedelta(days=50),
            },
            {
                "code": "PRJ-MH-THA-006",
                "name": "Thane Precision Heavy Engineering Works",
                "project_type": "Manufacturing unit",
                "status": "delayed",
                "description": "Heavy fabrication, industrial pressure vessel, and high-spec boiler manufacturing plant in Ambernath MIDC, Thane. Exceeding statutory SLA timeline with an active multi-tier escalation case.",
                "created_at": now - timedelta(days=60),
            },
        ]

        projects: dict[str, Project] = {}
        for p_data in projects_data:
            p = Project(**p_data)
            db.add(p)
            projects[p_data["code"]] = p
        db.flush()

        # 3. Seed Documents for each Project
        print("Seeding documents with validation states...")
        docs: dict[str, Document] = {}

        # -------------------------------------------------------------
        # Project 1: Sahyadri EV (PUN-001) - High Readiness (Verified)
        # -------------------------------------------------------------
        p1 = projects["PRJ-MH-PUN-001"]
        p1_docs = [
            Document(
                project_id=p1.id,
                document_type="LAND_7_12_EXTRACT",
                title="7/12 Revenue Extract & Mutation Entry Record",
                file_name="pun001_7_12_extract.pdf",
                file_path="/storage/documents/pun001/7_12_extract.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Revenue records match MIDC allotment survey boundaries precisely. Digital sign verified.",
                uploaded_at=p1.created_at + timedelta(days=1),
                verified_at=p1.created_at + timedelta(days=3),
            ),
            Document(
                project_id=p1.id,
                document_type="MIDC_ALLOTMENT_ORDER",
                title="MIDC Plot Allotment Letter & Possession Receipt",
                file_name="pun001_midc_allotment.pdf",
                file_path="/storage/documents/pun001/midc_allotment.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Plot No. C-14 Chakan Phase II possession deed authenticated with MIDC portal.",
                uploaded_at=p1.created_at + timedelta(days=2),
                verified_at=p1.created_at + timedelta(days=4),
            ),
            Document(
                project_id=p1.id,
                document_type="COMPANY_REGISTRATION",
                title="Certificate of Incorporation & MOA/AOA",
                file_name="pun001_mca_coi.pdf",
                file_path="/storage/documents/pun001/mca_coi.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="MCA corporate CIN valid and active.",
                uploaded_at=p1.created_at + timedelta(days=1),
                verified_at=p1.created_at + timedelta(days=2),
            ),
            Document(
                project_id=p1.id,
                document_type="PAN_GST_CERT",
                title="Enterprise PAN & Maharashtra GSTIN Certificate",
                file_name="pun001_pan_gst.pdf",
                file_path="/storage/documents/pun001/pan_gst.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="GSTIN 27AAACS1234F1ZQ active with Maharashtra State Tax.",
                uploaded_at=p1.created_at + timedelta(days=1),
                verified_at=p1.created_at + timedelta(days=2),
            ),
            Document(
                project_id=p1.id,
                document_type="SITE_LAYOUT_PLAN",
                title="Architectural Site Layout & Setback Blueprint",
                file_name="pun001_site_plan_v3.pdf",
                file_path="/storage/documents/pun001/site_plan_v3.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Architectural drawing complies with Chakan MIDC industrial building bylaws.",
                uploaded_at=p1.created_at + timedelta(days=3),
                verified_at=p1.created_at + timedelta(days=6),
            ),
            Document(
                project_id=p1.id,
                document_type="BUILDING_ELEVATION_PLAN",
                title="Detailed Civil Structural & Elevation Drawings",
                file_name="pun001_building_elevation.pdf",
                file_path="/storage/documents/pun001/building_elevation.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="Civil engineering sections meet industrial height restrictions.",
                uploaded_at=p1.created_at + timedelta(days=5),
                verified_at=p1.created_at + timedelta(days=8),
            ),
            Document(
                project_id=p1.id,
                document_type="FIRE_SAFETY_SCHEME",
                title="Fire Hydrant, Sprinkler & Evacuation Scheme",
                file_name="pun001_fire_scheme.pdf",
                file_path="/storage/documents/pun001/fire_scheme.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="Static water tank calculation meets NBC Part IV norms.",
                uploaded_at=p1.created_at + timedelta(days=10),
                verified_at=p1.created_at + timedelta(days=14),
            ),
            Document(
                project_id=p1.id,
                document_type="EIA_REPORT",
                title="Environmental Management & Zero Liquid Discharge Plan",
                file_name="pun001_eia_zld_report.pdf",
                file_path="/storage/documents/pun001/eia_zld_report.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="Orange category baseline EIA and RO plant water mass balance validated.",
                uploaded_at=p1.created_at + timedelta(days=8),
                verified_at=p1.created_at + timedelta(days=12),
            ),
            Document(
                project_id=p1.id,
                document_type="MPCB_EMISSION_DETAILS",
                title="Air Emission & Effluent Treatment (ETP) Engineering Specs",
                file_name="pun001_etp_specs.pdf",
                file_path="/storage/documents/pun001/etp_specs.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="ETP capacity of 150 KLD validated with acoustic enclosure for generators.",
                uploaded_at=p1.created_at + timedelta(days=9),
                verified_at=p1.created_at + timedelta(days=13),
            ),
            Document(
                project_id=p1.id,
                document_type="FACTORY_EQUIPMENT_LAYOUT",
                title="Battery Assembly Machinery Layout & Hazard Assessment",
                file_name="pun001_machinery_layout.pdf",
                file_path="/storage/documents/pun001/machinery_layout.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="Hazardous substance ventilation meets DISH factory guidelines.",
                uploaded_at=p1.created_at + timedelta(days=12),
                verified_at=p1.created_at + timedelta(days=16),
            ),
            Document(
                project_id=p1.id,
                document_type="MSEDCL_ELECTRICAL_LOAD_PLAN",
                title="Single Line Diagram (SLD) & 33kV Substation Drawing",
                file_name="pun001_msedcl_sld.pdf",
                file_path="/storage/documents/pun001/msedcl_sld.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="5 MVA contract demand sanctioned by MSEDCL Pune circle.",
                uploaded_at=p1.created_at + timedelta(days=14),
                verified_at=p1.created_at + timedelta(days=18),
            ),
        ]
        for d in p1_docs:
            db.add(d)
            docs[f"PUN1_{d.document_type}"] = d

        # -------------------------------------------------------------
        # Project 2: Konkan Pharma (RAI-002) - Missing Documents Scenario
        # -------------------------------------------------------------
        p2 = projects["PRJ-MH-RAI-002"]
        p2_docs = [
            Document(
                project_id=p2.id,
                document_type="LAND_7_12_EXTRACT",
                title="7/12 Revenue Extract & Roha MIDC Plot Deed",
                file_name="rai002_7_12.pdf",
                file_path="/storage/documents/rai002/7_12.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Revenue extract verified with Roha MIDC sub-registrar.",
                uploaded_at=p2.created_at + timedelta(days=2),
                verified_at=p2.created_at + timedelta(days=5),
            ),
            Document(
                project_id=p2.id,
                document_type="COMPANY_REGISTRATION",
                title="Certificate of Incorporation & Partnership Deed",
                file_name="rai002_incorporation.pdf",
                file_path="/storage/documents/rai002/incorporation.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Corporate legal documents verified.",
                uploaded_at=p2.created_at + timedelta(days=2),
                verified_at=p2.created_at + timedelta(days=4),
            ),
            Document(
                project_id=p2.id,
                document_type="PAN_GST_CERT",
                title="Enterprise PAN & GST Registration",
                file_name="rai002_pan_gst.pdf",
                file_path="/storage/documents/rai002/pan_gst.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="GSTIN verified with Maharashtra GST authority.",
                uploaded_at=p2.created_at + timedelta(days=2),
                verified_at=p2.created_at + timedelta(days=4),
            ),
            Document(
                project_id=p2.id,
                document_type="SITE_LAYOUT_PLAN",
                title="Chemical Plant Plot Layout & Chemical Reactor Setbacks",
                file_name="rai002_site_layout.pdf",
                file_path="/storage/documents/rai002/site_layout.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Chemical storage distances verified against PESO safety setbacks.",
                uploaded_at=p2.created_at + timedelta(days=6),
                verified_at=p2.created_at + timedelta(days=10),
            ),
            Document(
                project_id=p2.id,
                document_type="FIRE_SAFETY_SCHEME",
                title="Chemical Foam & Deluge Fire Protection Scheme",
                file_name="rai002_fire_scheme.pdf",
                file_path="/storage/documents/rai002/fire_scheme.pdf",
                status=DocumentStatus.UPLOADED.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="Uploaded by applicant. Pending technical evaluation by Roha Fire Officer.",
                uploaded_at=p2.created_at + timedelta(days=12),
                verified_at=None,
            ),
            # Missing document records explicitly present as MISSING in database
            Document(
                project_id=p2.id,
                document_type="EIA_REPORT",
                title="Red Category EIA & Solvent Recovery Assessment",
                file_name=None,
                file_path=None,
                status=DocumentStatus.MISSING.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="Critical missing requirement: Comprehensive EIA Annexure and VOC scrubbing calculation missing.",
                uploaded_at=None,
                verified_at=None,
            ),
            Document(
                project_id=p2.id,
                document_type="MPCB_EMISSION_DETAILS",
                title="Hazardous Waste Management & ETP Detailed Project Report",
                file_name=None,
                file_path=None,
                status=DocumentStatus.MISSING.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="Critical missing requirement: Hazardous solid waste treatment agreement with MWML Taloja missing.",
                uploaded_at=None,
                verified_at=None,
            ),
        ]
        for d in p2_docs:
            db.add(d)
            docs[f"RAI2_{d.document_type}"] = d

        # --------------------------------------------------------------------------
        # Project 3: Marathwada Semiconductor (CSN-003) - Uploaded Pending Verification
        # --------------------------------------------------------------------------
        p3 = projects["PRJ-MH-CSN-003"]
        p3_docs = [
            Document(
                project_id=p3.id,
                document_type="LAND_7_12_EXTRACT",
                title="7/12 Extract & AURIC Shendra MIDC Lease Agreement",
                file_name="csn003_auric_lease.pdf",
                file_path="/storage/documents/csn003/auric_lease.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="AURIC industrial lease agreement verified.",
                uploaded_at=p3.created_at + timedelta(days=2),
                verified_at=p3.created_at + timedelta(days=5),
            ),
            Document(
                project_id=p3.id,
                document_type="COMPANY_REGISTRATION",
                title="Certificate of Incorporation",
                file_name="csn003_coi.pdf",
                file_path="/storage/documents/csn003/coi.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Corporate registration verified.",
                uploaded_at=p3.created_at + timedelta(days=2),
                verified_at=p3.created_at + timedelta(days=4),
            ),
            Document(
                project_id=p3.id,
                document_type="SITE_LAYOUT_PLAN",
                title="AURIC Cleanroom Facility Site Layout",
                file_name="csn003_cleanroom_layout.pdf",
                file_path="/storage/documents/csn003/cleanroom_layout.pdf",
                status=DocumentStatus.PENDING_VERIFICATION.value,
                is_reusable=True,
                is_verified=False,
                validation_remarks="Document submitted to Town Planning. Officer review pending.",
                uploaded_at=p3.created_at + timedelta(days=6),
                verified_at=None,
            ),
            Document(
                project_id=p3.id,
                document_type="BUILDING_ELEVATION_PLAN",
                title="Cleanroom Class 10000 Architectural Elevation",
                file_name="csn003_building_plan.pdf",
                file_path="/storage/documents/csn003/building_plan.pdf",
                status=DocumentStatus.PENDING_VERIFICATION.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="HVAC ducting and vibration-isolation foundation details under scrutiny.",
                uploaded_at=p3.created_at + timedelta(days=8),
                verified_at=None,
            ),
            Document(
                project_id=p3.id,
                document_type="FIRE_SAFETY_SCHEME",
                title="Clean Agent (FM-200) Fire Suppression Plan",
                file_name="csn003_fm200_fire_plan.pdf",
                file_path="/storage/documents/csn003/fm200_fire_plan.pdf",
                status=DocumentStatus.PENDING_VERIFICATION.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="Awaiting site visit report from Aurangabad Divisional Fire Officer.",
                uploaded_at=p3.created_at + timedelta(days=10),
                verified_at=None,
            ),
        ]
        for d in p3_docs:
            db.add(d)
            docs[f"CSN3_{d.document_type}"] = d

        # --------------------------------------------------------------------------
        # Project 4: Vidarbha Agro (NAG-004) - Attention State Scenario
        # --------------------------------------------------------------------------
        p4 = projects["PRJ-MH-NAG-004"]
        p4_docs = [
            Document(
                project_id=p4.id,
                document_type="LAND_7_12_EXTRACT",
                title="7/12 Land Revenue Extract - Survey No. 214/B",
                file_name="nag004_7_12_extract.pdf",
                file_path="/storage/documents/nag004/7_12_extract.pdf",
                status=DocumentStatus.ATTENTION.value,
                is_reusable=True,
                is_verified=False,
                validation_remarks="Discrepancy detected: Survey #214/B boundary area shows 1,450 sq.m mismatch between Talathi 7/12 extract and Butibori MIDC demarcation map. Physical land re-survey required before approval.",
                uploaded_at=p4.created_at + timedelta(days=3),
                verified_at=None,
            ),
            Document(
                project_id=p4.id,
                document_type="COMPANY_REGISTRATION",
                title="Agro-Processing Farmer Producer Company Registration",
                file_name="nag004_fpo_registration.pdf",
                file_path="/storage/documents/nag004/fpo_registration.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="FPO corporate entity authenticated.",
                uploaded_at=p4.created_at + timedelta(days=2),
                verified_at=p4.created_at + timedelta(days=4),
            ),
            Document(
                project_id=p4.id,
                document_type="SITE_LAYOUT_PLAN",
                title="Cold Storage & Grain Silo Master Layout",
                file_name="nag004_cold_chain_layout.pdf",
                file_path="/storage/documents/nag004/cold_chain_layout.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Internal truck loading bay widths comply with agricultural marketing board standards.",
                uploaded_at=p4.created_at + timedelta(days=5),
                verified_at=p4.created_at + timedelta(days=8),
            ),
            Document(
                project_id=p4.id,
                document_type="MPCB_EMISSION_DETAILS",
                title="Fruit Processing Biological ETP & Odor Abatement Plan",
                file_name="nag004_biological_etp.pdf",
                file_path="/storage/documents/nag004/biological_etp.pdf",
                status=DocumentStatus.UPLOADED.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="Biochemical oxygen demand (BOD) reduction system submitted.",
                uploaded_at=p4.created_at + timedelta(days=8),
                verified_at=None,
            ),
        ]
        for d in p4_docs:
            db.add(d)
            docs[f"NAG4_{d.document_type}"] = d

        # --------------------------------------------------------------------------
        # Project 5: Godavari Textile (NSK-005) - Dependency Bottleneck Scenario
        # --------------------------------------------------------------------------
        p5 = projects["PRJ-MH-NSK-005"]
        p5_docs = [
            Document(
                project_id=p5.id,
                document_type="LAND_7_12_EXTRACT",
                title="7/12 Extract - Sinnar MIDC Sector E",
                file_name="nsk005_7_12.pdf",
                file_path="/storage/documents/nsk005/7_12.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Land lease authenticated with Sinnar MIDC office.",
                uploaded_at=p5.created_at + timedelta(days=2),
                verified_at=p5.created_at + timedelta(days=5),
            ),
            Document(
                project_id=p5.id,
                document_type="COMPANY_REGISTRATION",
                title="Textile Partnership Deed & Registration Certificate",
                file_name="nsk005_deed.pdf",
                file_path="/storage/documents/nsk005/deed.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Partnership firm registered with Registrar of Firms, Nashik.",
                uploaded_at=p5.created_at + timedelta(days=2),
                verified_at=p5.created_at + timedelta(days=4),
            ),
            Document(
                project_id=p5.id,
                document_type="BUILDING_ELEVATION_PLAN",
                title="Weaving Shed Civil Elevation & Ventilation Design",
                file_name="nsk005_weaving_elevation.pdf",
                file_path="/storage/documents/nsk005/weaving_elevation.pdf",
                status=DocumentStatus.PENDING_VERIFICATION.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="Under scrutiny by Town Planning. Stalled due to missing fire-driveway width verification.",
                uploaded_at=p5.created_at + timedelta(days=10),
                verified_at=None,
            ),
            Document(
                project_id=p5.id,
                document_type="FIRE_SAFETY_SCHEME",
                title="Textile High-Hazard Fire Suppression & Hydrant Blueprint",
                file_name="nsk005_textile_fire.pdf",
                file_path="/storage/documents/nsk005/textile_fire.pdf",
                status=DocumentStatus.UPLOADED.value,
                is_reusable=False,
                is_verified=False,
                validation_remarks="Cannot proceed until Town Planning clears the building elevation and driveway width.",
                uploaded_at=p5.created_at + timedelta(days=12),
                verified_at=None,
            ),
        ]
        for d in p5_docs:
            db.add(d)
            docs[f"NSK5_{d.document_type}"] = d

        # --------------------------------------------------------------------------
        # Project 6: Thane Precision Engineering (THA-006) - Exceeding SLA Scenario
        # --------------------------------------------------------------------------
        p6 = projects["PRJ-MH-THA-006"]
        p6_docs = [
            Document(
                project_id=p6.id,
                document_type="LAND_7_12_EXTRACT",
                title="7/12 Extract - Ambernath MIDC Heavy Engineering Zone",
                file_name="tha006_7_12.pdf",
                file_path="/storage/documents/tha006/7_12.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Plot lease and municipal entry verified.",
                uploaded_at=p6.created_at + timedelta(days=3),
                verified_at=p6.created_at + timedelta(days=6),
            ),
            Document(
                project_id=p6.id,
                document_type="COMPANY_REGISTRATION",
                title="Certificate of Incorporation & Articles of Association",
                file_name="tha006_incorporation.pdf",
                file_path="/storage/documents/tha006/incorporation.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=True,
                is_verified=True,
                validation_remarks="Verified with Ministry of Corporate Affairs.",
                uploaded_at=p6.created_at + timedelta(days=2),
                verified_at=p6.created_at + timedelta(days=5),
            ),
            Document(
                project_id=p6.id,
                document_type="EIA_REPORT",
                title="Heavy Engineering Metal Finishing EIA & Acoustic Study",
                file_name="tha006_eia_study.pdf",
                file_path="/storage/documents/tha006/eia_study.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="Acoustic and shot-blasting dust suppression models verified.",
                uploaded_at=p6.created_at + timedelta(days=8),
                verified_at=p6.created_at + timedelta(days=14),
            ),
            Document(
                project_id=p6.id,
                document_type="MPCB_EMISSION_DETAILS",
                title="Heavy Metal Pre-Treatment & Wet Scrubber Specifications",
                file_name="tha006_scrubber_specs.pdf",
                file_path="/storage/documents/tha006/scrubber_specs.pdf",
                status=DocumentStatus.VERIFIED.value,
                is_reusable=False,
                is_verified=True,
                validation_remarks="Flue gas chimney height calculation meets CPCB norms. Scrutiny stalled at MPCB office.",
                uploaded_at=p6.created_at + timedelta(days=10),
                verified_at=p6.created_at + timedelta(days=16),
            ),
        ]
        for d in p6_docs:
            db.add(d)
            docs[f"THA6_{d.document_type}"] = d

        db.flush()

        # 4. Seed Approvals, Required Documents, SLAs, and Approval Documents
        print("Seeding approvals, SLAs, and approval-document associations...")
        approvals: dict[str, Approval] = {}

        # --------------------------------------------------------------------------
        # Project 1 Approvals (PUN-001): Benchmark On-Time / Approved
        # --------------------------------------------------------------------------
        # Stage 1: MIDC Land Allotment (Approved)
        appr_p1_land = Approval(
            project_id=p1.id,
            department_id=depts["MIDC"].id,
            title="MIDC Industrial Plot Allotment & Possession Sanction",
            code="PUN-MIDC-01",
            stage_order=1,
            status=ApprovalStatus.APPROVED.value,
            applied_date=p1.created_at + timedelta(days=3),
            approved_date=p1.created_at + timedelta(days=20),
            remarks="Plot possession handed over. Lease agreement executed.",
            created_at=p1.created_at + timedelta(days=3),
        )
        # Stage 2: Town Planning Building Plan (Approved)
        appr_p1_bldg = Approval(
            project_id=p1.id,
            department_id=depts["TOWN_PLAN"].id,
            title="Industrial Building Plan & Structural Sanction",
            code="PUN-TOWN-02",
            stage_order=2,
            status=ApprovalStatus.APPROVED.value,
            applied_date=p1.created_at + timedelta(days=21),
            approved_date=p1.created_at + timedelta(days=36),
            remarks="Structural drawings approved with green building FAR concession.",
            created_at=p1.created_at + timedelta(days=21),
        )
        # Stage 3: MPCB Consent to Establish (In Progress, On-Track)
        appr_p1_mpcb = Approval(
            project_id=p1.id,
            department_id=depts["MPCB"].id,
            title="MPCB Consent to Establish (Orange Category - Auto EV)",
            code="PUN-MPCB-03",
            stage_order=3,
            status=ApprovalStatus.IN_PROGRESS.value,
            applied_date=p1.created_at + timedelta(days=22),
            approved_date=None,
            remarks="Under active review by Pune Regional Officer. Technical committee scheduled next week.",
            created_at=p1.created_at + timedelta(days=22),
        )
        # Stage 4: Provisional Fire NOC (In Progress, On-Track)
        appr_p1_fire = Approval(
            project_id=p1.id,
            department_id=depts["MFES"].id,
            title="Provisional Fire Safety NOC",
            code="PUN-FIRE-04",
            stage_order=4,
            status=ApprovalStatus.IN_PROGRESS.value,
            applied_date=p1.created_at + timedelta(days=25),
            approved_date=None,
            remarks="Hydrant piping drawing under review by Chakan Fire Station.",
            created_at=p1.created_at + timedelta(days=25),
        )
        # Stage 5: DISH Factory Plan Approval (Pending)
        appr_p1_dish = Approval(
            project_id=p1.id,
            department_id=depts["DISH"].id,
            title="Factory Building & Worker Health Safety Approval",
            code="PUN-DISH-05",
            stage_order=5,
            status=ApprovalStatus.PENDING.value,
            applied_date=None,
            approved_date=None,
            remarks="Awaiting MPCB CTE clearance before formal application submission.",
            created_at=p1.created_at + timedelta(days=25),
        )
        # Stage 6: MSEDCL HT Power Connection (In Progress, On-Track)
        appr_p1_power = Approval(
            project_id=p1.id,
            department_id=depts["MSEDCL"].id,
            title="HT Power Infrastructure & 33kV Load Sanction",
            code="PUN-MSED-06",
            stage_order=6,
            status=ApprovalStatus.IN_PROGRESS.value,
            applied_date=p1.created_at + timedelta(days=26),
            approved_date=None,
            remarks="Substation bay feasibility verified by MSEDCL Pune circle.",
            created_at=p1.created_at + timedelta(days=26),
        )

        p1_approvals = [appr_p1_land, appr_p1_bldg, appr_p1_mpcb, appr_p1_fire, appr_p1_dish, appr_p1_power]
        for a in p1_approvals:
            db.add(a)
            approvals[a.code] = a

        # --------------------------------------------------------------------------
        # Project 2 Approvals (RAI-002): Missing Documents & MPCB Stall
        # --------------------------------------------------------------------------
        appr_p2_land = Approval(
            project_id=p2.id,
            department_id=depts["MIDC"].id,
            title="Roha MIDC Chemical Zone Land Possession",
            code="RAI-MIDC-01",
            stage_order=1,
            status=ApprovalStatus.APPROVED.value,
            applied_date=p2.created_at + timedelta(days=2),
            approved_date=p2.created_at + timedelta(days=19),
            remarks="Land possession confirmed for chemical manufacturing.",
            created_at=p2.created_at + timedelta(days=2),
        )
        appr_p2_mpcb = Approval(
            project_id=p2.id,
            department_id=depts["MPCB"].id,
            title="MPCB Consent to Establish (Red Category - Bulk Drugs)",
            code="RAI-MPCB-02",
            stage_order=2,
            status=ApprovalStatus.IN_PROGRESS.value,
            applied_date=p2.created_at + timedelta(days=20),
            approved_date=None,
            remarks="Scrutiny stalled due to missing hazardous solvent recovery Annexure.",
            created_at=p2.created_at + timedelta(days=20),
        )
        appr_p2_fire = Approval(
            project_id=p2.id,
            department_id=depts["MFES"].id,
            title="Chemical Hazard Provisional Fire NOC",
            code="RAI-FIRE-03",
            stage_order=3,
            status=ApprovalStatus.PENDING.value,
            applied_date=None,
            approved_date=None,
            remarks="Dependent on MPCB CTE and hazardous chemical layout.",
            created_at=p2.created_at + timedelta(days=20),
        )
        p2_approvals = [appr_p2_land, appr_p2_mpcb, appr_p2_fire]
        for a in p2_approvals:
            db.add(a)
            approvals[a.code] = a

        # --------------------------------------------------------------------------
        # Project 3 Approvals (CSN-003): Uploaded, Pending Verification & Approaching SLA
        # --------------------------------------------------------------------------
        appr_p3_land = Approval(
            project_id=p3.id,
            department_id=depts["MIDC"].id,
            title="AURIC Smart City Plot Lease Allotment",
            code="CSN-MIDC-01",
            stage_order=1,
            status=ApprovalStatus.APPROVED.value,
            applied_date=p3.created_at + timedelta(days=2),
            approved_date=p3.created_at + timedelta(days=16),
            remarks="Fast-track smart city land allotment completed.",
            created_at=p3.created_at + timedelta(days=2),
        )
        appr_p3_bldg = Approval(
            project_id=p3.id,
            department_id=depts["TOWN_PLAN"].id,
            title="Semiconductor Cleanroom Building Sanction",
            code="CSN-TOWN-02",
            stage_order=2,
            status=ApprovalStatus.IN_PROGRESS.value,
            applied_date=p3.created_at + timedelta(days=18),
            approved_date=None,
            remarks="Scrutiny of cleanroom vibration isolation foundations ongoing. 4 days remaining on SLA.",
            created_at=p3.created_at + timedelta(days=18),
        )
        appr_p3_fire = Approval(
            project_id=p3.id,
            department_id=depts["MFES"].id,
            title="Clean Agent Gaseous Fire Extinguishing NOC",
            code="CSN-FIRE-03",
            stage_order=3,
            status=ApprovalStatus.PENDING.value,
            applied_date=None,
            approved_date=None,
            remarks="Awaiting Town Planning building height approval.",
            created_at=p3.created_at + timedelta(days=18),
        )
        p3_approvals = [appr_p3_land, appr_p3_bldg, appr_p3_fire]
        for a in p3_approvals:
            db.add(a)
            approvals[a.code] = a

        # --------------------------------------------------------------------------
        # Project 4 Approvals (NAG-004): Attention State on 7/12 Extract
        # --------------------------------------------------------------------------
        appr_p4_land = Approval(
            project_id=p4.id,
            department_id=depts["MIDC"].id,
            title="Butibori MIDC Food Park Land Boundary Approval",
            code="NAG-MIDC-01",
            stage_order=1,
            status=ApprovalStatus.IN_PROGRESS.value,
            applied_date=p4.created_at + timedelta(days=5),
            approved_date=None,
            remarks="Flagged for attention: 7/12 revenue extract area mismatch with survey boundary. Joint resurvey scheduled.",
            created_at=p4.created_at + timedelta(days=5),
        )
        appr_p4_mpcb = Approval(
            project_id=p4.id,
            department_id=depts["MPCB"].id,
            title="MPCB Consent to Establish (Food & Agro Processing)",
            code="NAG-MPCB-02",
            stage_order=2,
            status=ApprovalStatus.PENDING.value,
            applied_date=None,
            approved_date=None,
            remarks="Cannot proceed until land boundary attention discrepancy is rectified.",
            created_at=p4.created_at + timedelta(days=5),
        )
        p4_approvals = [appr_p4_land, appr_p4_mpcb]
        for a in p4_approvals:
            db.add(a)
            approvals[a.code] = a

        # --------------------------------------------------------------------------
        # Project 5 Approvals (NSK-005): Cascading Dependency Bottleneck & Delayed
        # --------------------------------------------------------------------------
        appr_p5_land = Approval(
            project_id=p5.id,
            department_id=depts["MIDC"].id,
            title="Sinnar MIDC Textile Plot Sanction",
            code="NSK-MIDC-01",
            stage_order=1,
            status=ApprovalStatus.APPROVED.value,
            applied_date=p5.created_at + timedelta(days=3),
            approved_date=p5.created_at + timedelta(days=18),
            remarks="Plot lease sanctioned.",
            created_at=p5.created_at + timedelta(days=3),
        )
        appr_p5_bldg = Approval(
            project_id=p5.id,
            department_id=depts["TOWN_PLAN"].id,
            title="Textile Shed Building Layout Sanction",
            code="NSK-TOWN-02",
            stage_order=2,
            status=ApprovalStatus.DELAYED.value,
            applied_date=p5.created_at + timedelta(days=19),
            approved_date=None,
            remarks="Delayed by 14 days beyond 30-day statutory SLA due to inter-departmental driveway width query.",
            created_at=p5.created_at + timedelta(days=19),
        )
        appr_p5_fire = Approval(
            project_id=p5.id,
            department_id=depts["MFES"].id,
            title="Provisional Fire Safety NOC (Textile Mill)",
            code="NSK-FIRE-03",
            stage_order=3,
            status=ApprovalStatus.DELAYED.value,
            applied_date=p5.created_at + timedelta(days=22),
            approved_date=None,
            remarks="Completely blocked: Fire department cannot inspect or approve without sanctioned building layout.",
            created_at=p5.created_at + timedelta(days=22),
        )
        p5_approvals = [appr_p5_land, appr_p5_bldg, appr_p5_fire]
        for a in p5_approvals:
            db.add(a)
            approvals[a.code] = a

        # --------------------------------------------------------------------------
        # Project 6 Approvals (THA-006): Exceeding SLA Breached & Escalated
        # --------------------------------------------------------------------------
        appr_p6_land = Approval(
            project_id=p6.id,
            department_id=depts["MIDC"].id,
            title="Ambernath Heavy Engineering Land Possession",
            code="THA-MIDC-01",
            stage_order=1,
            status=ApprovalStatus.APPROVED.value,
            applied_date=p6.created_at + timedelta(days=4),
            approved_date=p6.created_at + timedelta(days=22),
            remarks="Land possession and survey demarcation completed.",
            created_at=p6.created_at + timedelta(days=4),
        )
        appr_p6_mpcb = Approval(
            project_id=p6.id,
            department_id=depts["MPCB"].id,
            title="MPCB Consent to Establish (Red Category - Heavy Engineering)",
            code="THA-MPCB-02",
            stage_order=2,
            status=ApprovalStatus.DELAYED.value,
            applied_date=p6.created_at + timedelta(days=23),
            approved_date=None,
            remarks="Statutory SLA breached by 16 days. Application escalated to Regional Officer and Single Window Cell.",
            created_at=p6.created_at + timedelta(days=23),
        )
        appr_p6_fire = Approval(
            project_id=p6.id,
            department_id=depts["MFES"].id,
            title="Industrial Foundry Fire Safety Clearance",
            code="THA-FIRE-03",
            stage_order=3,
            status=ApprovalStatus.PENDING.value,
            applied_date=None,
            approved_date=None,
            remarks="On hold pending MPCB emission clearance resolution.",
            created_at=p6.created_at + timedelta(days=25),
        )
        p6_approvals = [appr_p6_land, appr_p6_mpcb, appr_p6_fire]
        for a in p6_approvals:
            db.add(a)
            approvals[a.code] = a

        db.flush()

        # 5. Seed Required Documents & Approval-Document Links
        print("Configuring RequiredDocument checklists and ApprovalDocument links...")
        # Helper list of required docs per approval
        req_doc_configs = [
            # PUN-001 Approvals
            ("PUN-MIDC-01", "LAND_7_12_EXTRACT", "7/12 Extract and Mutation Records", True, "PUN1_LAND_7_12_EXTRACT"),
            ("PUN-MIDC-01", "COMPANY_REGISTRATION", "Corporate Incorporation / Partnership Deed", True, "PUN1_COMPANY_REGISTRATION"),
            ("PUN-MIDC-01", "PAN_GST_CERT", "PAN and Maharashtra GST Certificate", True, "PUN1_PAN_GST_CERT"),
            ("PUN-TOWN-02", "SITE_LAYOUT_PLAN", "Architectural Site Plan and Setbacks", True, "PUN1_SITE_LAYOUT_PLAN"),
            ("PUN-TOWN-02", "BUILDING_ELEVATION_PLAN", "Civil Structural & Elevation Drawings", True, "PUN1_BUILDING_ELEVATION_PLAN"),
            ("PUN-TOWN-02", "COMPANY_REGISTRATION", "Corporate Incorporation Proof", True, "PUN1_COMPANY_REGISTRATION"),
            ("PUN-MPCB-03", "COMPANY_REGISTRATION", "Enterprise Legal Identity Proof", True, "PUN1_COMPANY_REGISTRATION"),
            ("PUN-MPCB-03", "SITE_LAYOUT_PLAN", "Factory Layout & Sewerage Connection Plan", True, "PUN1_SITE_LAYOUT_PLAN"),
            ("PUN-MPCB-03", "EIA_REPORT", "Environmental Management & ZLD Assessment", True, "PUN1_EIA_REPORT"),
            ("PUN-MPCB-03", "MPCB_EMISSION_DETAILS", "ETP Specifications & Air Scrubbing Layout", True, "PUN1_MPCB_EMISSION_DETAILS"),
            ("PUN-FIRE-04", "BUILDING_ELEVATION_PLAN", "Sanctioned Building Drawing for Fire Tender Access", True, "PUN1_BUILDING_ELEVATION_PLAN"),
            ("PUN-FIRE-04", "FIRE_SAFETY_SCHEME", "Fire Fighting Hydrant and Evacuation Blueprint", True, "PUN1_FIRE_SAFETY_SCHEME"),
            ("PUN-FIRE-04", "COMPANY_REGISTRATION", "Enterprise Incorporation Proof", True, "PUN1_COMPANY_REGISTRATION"),
            ("PUN-DISH-05", "FACTORY_EQUIPMENT_LAYOUT", "Plant Machinery Layout and Safety Safeguards", True, "PUN1_FACTORY_EQUIPMENT_LAYOUT"),
            ("PUN-DISH-05", "BUILDING_ELEVATION_PLAN", "Sanctioned Civil Elevation Plan", True, "PUN1_BUILDING_ELEVATION_PLAN"),
            ("PUN-MSED-06", "MSEDCL_ELECTRICAL_LOAD_PLAN", "Single Line Diagram (SLD) & HT Substation Plan", True, "PUN1_MSEDCL_ELECTRICAL_LOAD_PLAN"),
            ("PUN-MSED-06", "SITE_LAYOUT_PLAN", "Plot Layout Indicating Transformer Yard", True, "PUN1_SITE_LAYOUT_PLAN"),
            # RAI-002 Approvals
            ("RAI-MIDC-01", "LAND_7_12_EXTRACT", "7/12 Land Extract and Possession Receipt", True, "RAI2_LAND_7_12_EXTRACT"),
            ("RAI-MIDC-01", "COMPANY_REGISTRATION", "Company Incorporation Proof", True, "RAI2_COMPANY_REGISTRATION"),
            ("RAI-MIDC-01", "PAN_GST_CERT", "PAN and GST Registration Certificate", True, "RAI2_PAN_GST_CERT"),
            ("RAI-MPCB-02", "SITE_LAYOUT_PLAN", "Chemical Plant Hazard Boundary Layout", True, "RAI2_SITE_LAYOUT_PLAN"),
            ("RAI-MPCB-02", "COMPANY_REGISTRATION", "Corporate Incorporation Certificate", True, "RAI2_COMPANY_REGISTRATION"),
            # Missing requirements unfulfilled
            ("RAI-MPCB-02", "EIA_REPORT", "Red Category Comprehensive EIA & Solvent Study", True, "RAI2_EIA_REPORT"),
            ("RAI-MPCB-02", "MPCB_EMISSION_DETAILS", "Hazardous Waste Management & ETP Detailed Specs", True, "RAI2_MPCB_EMISSION_DETAILS"),
            # CSN-003 Approvals
            ("CSN-MIDC-01", "LAND_7_12_EXTRACT", "AURIC Lease Deed", True, "CSN3_LAND_7_12_EXTRACT"),
            ("CSN-MIDC-01", "COMPANY_REGISTRATION", "Company Incorporation Proof", True, "CSN3_COMPANY_REGISTRATION"),
            ("CSN-TOWN-02", "SITE_LAYOUT_PLAN", "Cleanroom Plot Plan", True, "CSN3_SITE_LAYOUT_PLAN"),
            ("CSN-TOWN-02", "BUILDING_ELEVATION_PLAN", "Semiconductor Facility Elevation Drawings", True, "CSN3_BUILDING_ELEVATION_PLAN"),
            ("CSN-FIRE-03", "FIRE_SAFETY_SCHEME", "Gaseous Clean Agent Fire Suppression Scheme", True, "CSN3_FIRE_SAFETY_SCHEME"),
            # NAG-004 Approvals
            ("NAG-MIDC-01", "LAND_7_12_EXTRACT", "7/12 Land Revenue Extract", True, "NAG4_LAND_7_12_EXTRACT"),
            ("NAG-MIDC-01", "COMPANY_REGISTRATION", "FPO Registration Certificate", True, "NAG4_COMPANY_REGISTRATION"),
            ("NAG-MPCB-02", "SITE_LAYOUT_PLAN", "Cold Chain Food Processing Layout", True, "NAG4_SITE_LAYOUT_PLAN"),
            ("NAG-MPCB-02", "MPCB_EMISSION_DETAILS", "Biological ETP Specifications", True, "NAG4_MPCB_EMISSION_DETAILS"),
            # NSK-005 Approvals
            ("NSK-MIDC-01", "LAND_7_12_EXTRACT", "Sinnar MIDC Lease Document", True, "NSK5_LAND_7_12_EXTRACT"),
            ("NSK-MIDC-01", "COMPANY_REGISTRATION", "Partnership Deed", True, "NSK5_COMPANY_REGISTRATION"),
            ("NSK-TOWN-02", "BUILDING_ELEVATION_PLAN", "Textile Weaving Shed Elevation Plan", True, "NSK5_BUILDING_ELEVATION_PLAN"),
            ("NSK-FIRE-03", "FIRE_SAFETY_SCHEME", "Textile Fire Fighting Blueprint", True, "NSK5_FIRE_SAFETY_SCHEME"),
            # THA-006 Approvals
            ("THA-MIDC-01", "LAND_7_12_EXTRACT", "Ambernath Land Title Extract", True, "THA6_LAND_7_12_EXTRACT"),
            ("THA-MIDC-01", "COMPANY_REGISTRATION", "Corporate Incorporation Proof", True, "THA6_COMPANY_REGISTRATION"),
            ("THA-MPCB-02", "COMPANY_REGISTRATION", "Company Incorporation Proof", True, "THA6_COMPANY_REGISTRATION"),
            ("THA-MPCB-02", "EIA_REPORT", "Heavy Engineering EIA Report", True, "THA6_EIA_REPORT"),
            ("THA-MPCB-02", "MPCB_EMISSION_DETAILS", "Industrial Wet Scrubber & Pre-Treatment Specs", True, "THA6_MPCB_EMISSION_DETAILS"),
        ]

        # Keep track of attached (approval_id, document_id) to avoid duplicates
        attached_set: set[tuple[int, int]] = set()

        for appr_code, doc_type, req_title, is_mand, doc_key in req_doc_configs:
            appr = approvals[appr_code]
            doc = docs[doc_key]

            # Determine fulfillment status based on document status
            req_status = doc.status if doc.status != DocumentStatus.MISSING.value else DocumentStatus.MISSING.value
            fulfilled_id = doc.id if doc.status != DocumentStatus.MISSING.value else None

            req_doc = RequiredDocument(
                approval_id=appr.id,
                document_type=doc_type,
                title=req_title,
                is_mandatory=is_mand,
                status=req_status,
                fulfilled_by_document_id=fulfilled_id,
            )
            db.add(req_doc)

            # Link via ApprovalDocument (supports cross-approval document reuse)
            if (appr.id, doc.id) not in attached_set and doc.status != DocumentStatus.MISSING.value:
                attached_set.add((appr.id, doc.id))
                sub_status = "attached"
                if doc.status == DocumentStatus.VERIFIED.value:
                    sub_status = "accepted"
                elif doc.status == DocumentStatus.ATTENTION.value:
                    sub_status = "flagged"

                appr_doc = ApprovalDocument(
                    approval_id=appr.id,
                    document_id=doc.id,
                    submission_status=sub_status,
                    notes=f"Linked {doc.title} to clearance {appr.code} ({doc.status}).",
                )
                db.add(appr_doc)

        db.flush()

        # 6. Seed Approval Dependencies (Meaningful chains for bottleneck calculations)
        print("Configuring approval dependency graph for bottleneck analysis...")
        dependency_configs = [
            # PUN-001 (Sahyadri EV)
            ("PUN-TOWN-02", "PUN-MIDC-01", "hard_block", True, "Building plan requires sanctioned plot possession (Satisfied)."),
            ("PUN-MPCB-03", "PUN-MIDC-01", "hard_block", True, "MPCB CTE requires validated land title (Satisfied)."),
            ("PUN-FIRE-04", "PUN-TOWN-02", "hard_block", True, "Fire safety requires approved architectural building drawings (Satisfied)."),
            ("PUN-DISH-05", "PUN-MPCB-03", "hard_block", False, "Factory Plan approval cannot be granted until MPCB CTE is issued (Pending)."),
            ("PUN-DISH-05", "PUN-TOWN-02", "hard_block", True, "Factory layout requires sanctioned building structure (Satisfied)."),
            ("PUN-MSED-06", "PUN-TOWN-02", "soft_prerequisite", True, "Power line layout coordinated with site elevation (Satisfied)."),
            # RAI-002 (Konkan Pharma)
            ("RAI-MPCB-02", "RAI-MIDC-01", "hard_block", True, "MPCB CTE requires land deed (Satisfied)."),
            ("RAI-FIRE-03", "RAI-MPCB-02", "hard_block", False, "Fire safety requires approved hazardous chemical inventory from MPCB (Blocked)."),
            # CSN-003 (Marathwada Semiconductor)
            ("CSN-TOWN-02", "CSN-MIDC-01", "hard_block", True, "AURIC building sanction requires lease deed (Satisfied)."),
            ("CSN-FIRE-03", "CSN-TOWN-02", "hard_block", False, "Clean agent fire approval blocked until building layout finalized (Blocked)."),
            # NAG-004 (Vidarbha Agro)
            ("NAG-MPCB-02", "NAG-MIDC-01", "hard_block", False, "MPCB CTE blocked until Land Boundary Attention discrepancy is settled (Blocked)."),
            # NSK-005 (Godavari Textile) - Classic Cascading Bottleneck!
            ("NSK-TOWN-02", "NSK-MIDC-01", "hard_block", True, "Building layout requires land lease (Satisfied)."),
            ("NSK-FIRE-03", "NSK-TOWN-02", "hard_block", False, "Severe Bottleneck: Fire NOC blocked by stalled Town Planning building plan (Active Blocker)."),
            # THA-006 (Thane Engineering)
            ("THA-MPCB-02", "THA-MIDC-01", "hard_block", True, "Land possession verified (Satisfied)."),
            ("THA-FIRE-03", "THA-MPCB-02", "hard_block", False, "Fire clearance blocked by delayed MPCB CTE breach (Blocked)."),
        ]

        for blocked_code, prereq_code, dep_type, is_sat, notes in dependency_configs:
            dep = ApprovalDependency(
                approval_id=approvals[blocked_code].id,
                depends_on_approval_id=approvals[prereq_code].id,
                dependency_type=dep_type,
                is_satisfied=is_sat,
                notes=notes,
            )
            db.add(dep)

        db.flush()

        # 7. Seed SLA Records (Realistic timelines: 7, 15, 21, 30, 45, 60 days)
        print("Configuring SLA monitoring metrics across approvals...")
        sla_configs = [
            # PUN-001 (Sahyadri EV)
            # MIDC Land: 21 days target, completed in 17 days
            ("PUN-MIDC-01", 21, 17, 4, appr_p1_land.applied_date, appr_p1_land.applied_date + timedelta(days=21), appr_p1_land.approved_date, False, 5.0, SLAStatus.COMPLETED.value),
            # Town Planning: 30 days target, completed in 15 days
            ("PUN-TOWN-02", 30, 15, 15, appr_p1_bldg.applied_date, appr_p1_bldg.applied_date + timedelta(days=30), appr_p1_bldg.approved_date, False, 8.0, SLAStatus.COMPLETED.value),
            # MPCB CTE: 45 days target, elapsed 18 days, 27 remaining (On track)
            ("PUN-MPCB-03", 45, 18, 27, appr_p1_mpcb.applied_date, appr_p1_mpcb.applied_date + timedelta(days=45), None, False, 18.5, SLAStatus.ON_TRACK.value),
            # Fire NOC: 15 days target, elapsed 15 days, 0 remaining (On track)
            ("PUN-FIRE-04", 15, 15, 0, appr_p1_fire.applied_date, appr_p1_fire.applied_date + timedelta(days=15), None, False, 22.0, SLAStatus.ON_TRACK.value),
            # DISH Factory: 30 days target, not started yet
            ("PUN-DISH-05", 30, 0, 30, None, None, None, False, 0.0, SLAStatus.ON_TRACK.value),
            # MSEDCL Power: 21 days target, elapsed 14 days, 7 remaining (On track)
            ("PUN-MSED-06", 21, 14, 7, appr_p1_power.applied_date, appr_p1_power.applied_date + timedelta(days=21), None, False, 12.0, SLAStatus.ON_TRACK.value),

            # RAI-002 (Konkan Pharma)
            # Land: 21 days target, completed in 17 days
            ("RAI-MIDC-01", 21, 17, 4, appr_p2_land.applied_date, appr_p2_land.applied_date + timedelta(days=21), appr_p2_land.approved_date, False, 10.0, SLAStatus.COMPLETED.value),
            # MPCB CTE: 60 days target (Red Category), elapsed 25 days, 35 remaining, at risk due to missing docs
            ("RAI-MPCB-02", 60, 25, 35, appr_p2_mpcb.applied_date, appr_p2_mpcb.applied_date + timedelta(days=60), None, False, 65.0, SLAStatus.AT_RISK.value),
            # Fire NOC: 15 days target
            ("RAI-FIRE-03", 15, 0, 15, None, None, None, False, 0.0, SLAStatus.ON_TRACK.value),

            # CSN-003 (Marathwada Semiconductor)
            # Land: 21 days target, completed in 14 days
            ("CSN-MIDC-01", 21, 14, 7, appr_p3_land.applied_date, appr_p3_land.applied_date + timedelta(days=21), appr_p3_land.approved_date, False, 5.0, SLAStatus.COMPLETED.value),
            # Building Plan: 30 days target, elapsed 26 days, only 4 days remaining! (Approaching SLA Deadline)
            ("CSN-TOWN-02", 30, 26, 4, appr_p3_bldg.applied_date, appr_p3_bldg.applied_date + timedelta(days=30), None, False, 78.0, SLAStatus.AT_RISK.value),
            # Fire NOC: 15 days target
            ("CSN-FIRE-03", 15, 0, 15, None, None, None, False, 0.0, SLAStatus.ON_TRACK.value),

            # NAG-004 (Vidarbha Agro)
            # Land Allotment: 21 days target, elapsed 20 days, 1 remaining, Attention flag
            ("NAG-MIDC-01", 21, 20, 1, appr_p4_land.applied_date, appr_p4_land.applied_date + timedelta(days=21), None, False, 72.0, SLAStatus.AT_RISK.value),
            ("NAG-MPCB-02", 30, 0, 30, None, None, None, False, 0.0, SLAStatus.ON_TRACK.value),

            # NSK-005 (Godavari Textile) - Delayed due to Cascading Bottleneck
            # Land: 21 days target, completed in 15 days
            ("NSK-MIDC-01", 21, 15, 6, appr_p5_land.applied_date, appr_p5_land.applied_date + timedelta(days=21), appr_p5_land.approved_date, False, 5.0, SLAStatus.COMPLETED.value),
            # Building Plan: 30 days target, elapsed 31 days (Breached by 1 day, blocked)
            ("NSK-TOWN-02", 30, 31, 0, appr_p5_bldg.applied_date, appr_p5_bldg.applied_date + timedelta(days=30), None, True, 88.0, SLAStatus.BREACHED.value),
            # Fire NOC: 15 days target, elapsed 28 days (Breached by 13 days because of building blocker!)
            ("NSK-FIRE-03", 15, 28, 0, appr_p5_fire.applied_date, appr_p5_fire.applied_date + timedelta(days=15), None, True, 94.0, SLAStatus.BREACHED.value),

            # THA-006 (Thane Precision Engineering) - Severely Exceeding SLA
            # Land: 21 days target, completed in 18 days
            ("THA-MIDC-01", 21, 18, 3, appr_p6_land.applied_date, appr_p6_land.applied_date + timedelta(days=21), appr_p6_land.approved_date, False, 10.0, SLAStatus.COMPLETED.value),
            # MPCB CTE: 30 days target, elapsed 46 days (Breached by 16 days!)
            ("THA-MPCB-02", 30, 46, 0, appr_p6_mpcb.applied_date, appr_p6_mpcb.applied_date + timedelta(days=30), None, True, 96.5, SLAStatus.BREACHED.value),
            # Fire NOC: 15 days target
            ("THA-FIRE-03", 15, 0, 15, None, None, None, False, 0.0, SLAStatus.ON_TRACK.value),
        ]

        for (
            appr_code,
            t_days,
            d_elap,
            d_rem,
            s_date,
            exp_date,
            act_date,
            is_br,
            b_risk,
            sla_stat,
        ) in sla_configs:
            sla_obj = SLA(
                approval_id=approvals[appr_code].id,
                target_days=t_days,
                days_elapsed=d_elap,
                days_remaining=d_rem,
                start_date=s_date,
                expected_completion_date=exp_date,
                actual_completion_date=act_date,
                is_breached=is_br,
                bottleneck_risk_score=b_risk,
                status=sla_stat,
            )
            db.add(sla_obj)

        db.flush()

        # 8. Seed Escalations & Escalation History (3 Realistic Scenarios)
        print("Configuring escalations and intervention history...")

        # Escalation 1: Environmental Clearance / MPCB delayed beyond SLA (THA-006)
        esc1 = Escalation(
            approval_id=approvals["THA-MPCB-02"].id,
            assigned_department_id=depts["MPCB"].id,
            title="SLA Breach: MPCB Consent to Establish Exceeded Statutory 30-Day Window",
            reason="Heavy Engineering CTE application pending for 46 days without regional committee schedule. Statutory SLA exceeded by 16 days.",
            priority=EscalationPriority.CRITICAL.value,
            status=EscalationStatus.OPEN.value,
            assigned_owner="Dr. S. M. Deshmukh (Regional Officer, MPCB)",
            resolution_notes=None,
            opened_at=now - timedelta(days=15),
            resolved_at=None,
            created_at=now - timedelta(days=15),
        )
        db.add(esc1)
        db.flush()

        esc1_histories = [
            EscalationHistory(
                escalation_id=esc1.id,
                action="case_created",
                previous_status=None,
                new_status=EscalationStatus.OPEN.value,
                actor_name="SLA Watchdog Bot",
                notes="Automated alert triggered when MPCB CTE elapsed time reached 31 days (statutory target: 30 days).",
                created_at=now - timedelta(days=15),
            ),
            EscalationHistory(
                escalation_id=esc1.id,
                action="department_assigned",
                previous_status=EscalationStatus.OPEN.value,
                new_status=EscalationStatus.OPEN.value,
                actor_name="Single Window Administrator",
                notes="Escalation routed to Regional Officer, MPCB Kalyan-Thane Division for priority hearing.",
                created_at=now - timedelta(days=12),
            ),
            EscalationHistory(
                escalation_id=esc1.id,
                action="officer_reviewed",
                previous_status=EscalationStatus.OPEN.value,
                new_status=EscalationStatus.OPEN.value,
                actor_name="Dr. S. M. Deshmukh",
                notes="Regional Officer reviewed application file; identified pending report from sub-regional inspector on acoustic bunker standards. Fast-track inspection ordered.",
                created_at=now - timedelta(days=6),
            ),
        ]
        db.add_all(esc1_histories)

        # Escalation 2: Fire NOC blocked by pending building approval (NSK-005)
        esc2 = Escalation(
            approval_id=approvals["NSK-FIRE-03"].id,
            assigned_department_id=depts["MFES"].id,
            title="Inter-Agency Deadlock: Fire NOC Stalled by Pending Town Planning Sanction",
            reason="Provisional Fire Safety NOC on hold for 18 days because Town Planning Department has not released sanctioned building elevation setback drawings.",
            priority=EscalationPriority.HIGH.value,
            status=EscalationStatus.IN_REVIEW.value,
            assigned_owner="Chief Fire Officer V. B. Jadhav",
            resolution_notes=None,
            opened_at=now - timedelta(days=10),
            resolved_at=None,
            created_at=now - timedelta(days=10),
        )
        db.add(esc2)
        db.flush()

        esc2_histories = [
            EscalationHistory(
                escalation_id=esc2.id,
                action="case_created",
                previous_status=None,
                new_status=EscalationStatus.OPEN.value,
                actor_name="Applicant Grievance Portal",
                notes="Applicant flagged cascading inter-departmental blocker: Fire inspection cannot occur without sanctioned building plan.",
                created_at=now - timedelta(days=10),
            ),
            EscalationHistory(
                escalation_id=esc2.id,
                action="status_changed",
                previous_status=EscalationStatus.OPEN.value,
                new_status=EscalationStatus.IN_REVIEW.value,
                actor_name="Chief Fire Officer V. B. Jadhav",
                notes="Case accepted for inter-departmental review. Joint review requested with Town Planning & Valuation Department.",
                created_at=now - timedelta(days=7),
            ),
            EscalationHistory(
                escalation_id=esc2.id,
                action="department_response_received",
                previous_status=EscalationStatus.IN_REVIEW.value,
                new_status=EscalationStatus.IN_REVIEW.value,
                actor_name="Town Planning Directorate",
                notes="Town Planning confirmed building setback review will be finalized within 48 hours to unblock fire clearance.",
                created_at=now - timedelta(days=2),
            ),
        ]
        db.add_all(esc2_histories)

        # Escalation 3: MPCB approval awaiting missing documentation (RAI-002) - Resolved
        esc3 = Escalation(
            approval_id=approvals["RAI-MPCB-02"].id,
            assigned_department_id=depts["MPCB"].id,
            title="Pre-Validation Deficiency: Missing Hazardous Solvent Balance Sheet",
            reason="Chemical synthesis unit application flagged during pre-validation scrutiny due to absent solvent mass balance and VOC condensation schematics.",
            priority=EscalationPriority.MEDIUM.value,
            status=EscalationStatus.RESOLVED.value,
            assigned_owner="Dr. S. M. Deshmukh (Regional Officer, MPCB)",
            resolution_notes="Applicant furnished certified solvent mass balance sheet from accredited environmental consultant. Technical scrutiny resumed in normal queue.",
            opened_at=now - timedelta(days=20),
            resolved_at=now - timedelta(days=4),
            created_at=now - timedelta(days=20),
        )
        db.add(esc3)
        db.flush()

        esc3_histories = [
            EscalationHistory(
                escalation_id=esc3.id,
                action="case_created",
                previous_status=None,
                new_status=EscalationStatus.OPEN.value,
                actor_name="Pre-Validation Engine",
                notes="Deficiency notice generated: Red Category chemical API requires solvent recovery mass balance.",
                created_at=now - timedelta(days=20),
            ),
            EscalationHistory(
                escalation_id=esc3.id,
                action="department_assigned",
                previous_status=EscalationStatus.OPEN.value,
                new_status=EscalationStatus.OPEN.value,
                actor_name="Single Window Desk",
                notes="Assigned to MPCB Roha Regional Office.",
                created_at=now - timedelta(days=18),
            ),
            EscalationHistory(
                escalation_id=esc3.id,
                action="applicant_requested",
                previous_status=EscalationStatus.OPEN.value,
                new_status=EscalationStatus.IN_REVIEW.value,
                actor_name="Dr. S. M. Deshmukh",
                notes="Official deficiency memo transmitted requesting accredited solvent recovery calculations.",
                created_at=now - timedelta(days=14),
            ),
            EscalationHistory(
                escalation_id=esc3.id,
                action="department_response_received",
                previous_status=EscalationStatus.IN_REVIEW.value,
                new_status=EscalationStatus.IN_REVIEW.value,
                actor_name="Applicant / Consultant",
                notes="Applicant uploaded revised mass balance engineering drawings.",
                created_at=now - timedelta(days=7),
            ),
            EscalationHistory(
                escalation_id=esc3.id,
                action="escalation_resolved",
                previous_status=EscalationStatus.IN_REVIEW.value,
                new_status=EscalationStatus.RESOLVED.value,
                actor_name="Dr. S. M. Deshmukh",
                notes="Technical scrutiny cleared document deficiency. Escalation marked resolved.",
                created_at=now - timedelta(days=4),
            ),
        ]
        db.add_all(esc3_histories)

        db.commit()

        # Query counts for summary
        p_count = db.query(func.count(Project.id)).scalar()
        dept_count = db.query(func.count(Department.id)).scalar()
        appr_count = db.query(func.count(Approval.id)).scalar()
        doc_count = db.query(func.count(Document.id)).scalar()
        req_doc_count = db.query(func.count(RequiredDocument.id)).scalar()
        appr_doc_count = db.query(func.count(ApprovalDocument.id)).scalar()
        sla_count = db.query(func.count(SLA.id)).scalar()
        dep_count = db.query(func.count(ApprovalDependency.id)).scalar()
        esc_count = db.query(func.count(Escalation.id)).scalar()
        esc_hist_count = db.query(func.count(EscalationHistory.id)).scalar()

        print("\nSeed completed successfully.\n")
        print(f"Projects: {p_count}")
        print(f"Departments: {dept_count}")
        print(f"Approvals: {appr_count}")
        print(f"Documents: {doc_count}")
        print(f"Required Documents: {req_doc_count}")
        print(f"Approval Documents: {appr_doc_count}")
        print(f"SLAs: {sla_count}")
        print(f"Dependencies: {dep_count}")
        print(f"Escalations: {esc_count}")
        print(f"Escalation History: {esc_hist_count}")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
