import json
import threading
import time
import urllib.error
import urllib.request
import uvicorn

from app.main import app

config = uvicorn.Config(app=app, host="127.0.0.1", port=8009, log_level="error")
server = uvicorn.Server(config)

thread = threading.Thread(target=server.run)
thread.daemon = True
thread.start()
time.sleep(1.5)


def req(url, method="GET", data=None):
    headers = {"Content-Type": "application/json"} if data else {}
    body = json.dumps(data).encode("utf-8") if data else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        return err.code, json.loads(err.read().decode("utf-8"))


base = "http://127.0.0.1:8009/api/v1/projects"

try:
    print("--- TEST 1: GET /projects/1/documents ---")
    s, data = req(f"{base}/1/documents")
    print("Status:", s, "| Count:", len(data))
    assert s == 200 and len(data) > 0
    sample = data[0]
    print(
        "Sample doc:",
        sample["id"],
        sample["title"],
        "| Status:",
        sample["status"],
        "| Reusable:",
        sample["is_reusable"],
        "| Reuse count:",
        sample["reuse_count"],
    )

    print("\n--- TEST 2: GET /projects/1/documents/readiness-summary (Benchmark Project) ---")
    s, data = req(f"{base}/1/documents/readiness-summary")
    print("Status:", s, "| Summary:", data)
    assert s == 200 and data["readiness_percentage"] >= 80.0

    print("\n--- TEST 3: GET /projects/2/documents/readiness-summary (Missing Docs Project) ---")
    s, data = req(f"{base}/2/documents/readiness-summary")
    print("Status:", s, "| Summary:", data)
    assert s == 200 and data["missing_documents"] > 0

    print("\n--- TEST 4: GET /projects/4/documents/readiness-summary (Attention Doc Project) ---")
    s, data = req(f"{base}/4/documents/readiness-summary")
    print("Status:", s, "| Summary:", data)
    assert s == 200 and data["attention_documents"] > 0

    print("\n--- TEST 5: GET /projects/1/documents/required ---")
    s, data = req(f"{base}/1/documents/required")
    print("Status:", s, "| Required items count:", len(data))
    assert s == 200 and len(data) > 0
    print("First required item:", data[0]["title"], "for clearance:", data[0]["approval_code"])

    print("\n--- TEST 6: GET /projects/1/documents/reusable ---")
    s, data = req(f"{base}/1/documents/reusable")
    print("Status:", s, "| Reusable verified docs count:", len(data))
    assert s == 200 and len(data) > 0

    print("\n--- TEST 7: POST upload document metadata for Project 2 ---")
    # Find approval ID for RAI-MPCB-02
    req_s, req_docs = req(f"{base}/2/documents/required")
    mpcb_req = [r for r in req_docs if r["approval_code"] == "RAI-MPCB-02"][0]
    appr_id = mpcb_req["approval_id"]

    upload_payload = {
        "name": "Solvent Mass Balance & Condensation Blueprint",
        "category": "EIA_REPORT",
        "file_name": "solvent_balance_v1.pdf",
        "approval_id": appr_id,
        "reusable": False,
        "metadata_json": '{"version": "1.0", "consultant": "EcoEnviro Lab"}',
    }
    s, new_doc = req(f"{base}/2/documents", method="POST", data=upload_payload)
    print("Upload Status:", s, "| Doc ID:", new_doc["id"], "| Status:", new_doc["status"])
    assert s == 201 and new_doc["status"] == "pending_verification"

    print("\n--- TEST 8: POST validate document (Valid Pass) ---")
    s, val_res = req(f"{base}/2/documents/{new_doc['id']}/validate", method="POST")
    print(
        "Validation Status:",
        s,
        "| Passed:",
        val_res["passed"],
        "| Status:",
        val_res["status"],
        "| Remarks:",
        val_res["validation_remarks"],
    )
    assert s == 200 and val_res["passed"] is True and val_res["status"] == "verified"

    print("\n--- TEST 9: POST upload & validate document with simulated defect (Attention Fail) ---")
    bad_upload = {
        "title": "Corrupted Soil Test Drawing",
        "document_type": "BUILDING_ELEVATION_PLAN",
        "file_name": "corrupt_drawing.xyz",  # invalid extension and corrupt keyword
        "is_reusable": False,
    }
    s, bad_doc = req(f"{base}/2/documents", method="POST", data=bad_upload)
    s, bad_val = req(f"{base}/2/documents/{bad_doc['id']}/validate", method="POST")
    print(
        "Bad doc Validation Status:",
        s,
        "| Passed:",
        bad_val["passed"],
        "| Status:",
        bad_val["status"],
        "| Issues:",
        bad_val["issues"],
    )
    assert s == 200 and bad_val["passed"] is False and bad_val["status"] == "attention"

    print("\n--- TEST 10: POST reuse document across clearances ---")
    # Pick PUN-001 company registration document
    p1_docs_s, p1_docs = req(f"{base}/1/documents")
    coi_doc = [d for d in p1_docs if d["document_type"] == "COMPANY_REGISTRATION"][0]
    init_reuse_count = coi_doc["reuse_count"]

    # Reuse for MSEDCL power approval
    p1_req_s, p1_reqs = req(f"{base}/1/documents/required")
    power_appr_id = [r for r in p1_reqs if r["approval_code"] == "PUN-MSED-06"][0]["approval_id"]

    reuse_payload = {
        "approval_id": power_appr_id,
        "notes": "Reusing verified Certificate of Incorporation for MSEDCL power load verification.",
    }
    s, reuse_res = req(
        f"{base}/1/documents/{coi_doc['id']}/reuse", method="POST", data=reuse_payload
    )
    print("Reuse Status:", s, "| Message:", reuse_res["message"])
    assert s == 200
    print("Updated reuse count:", reuse_res["reused_document"]["reuse_count"])
    assert reuse_res["reused_document"]["reuse_count"] >= init_reuse_count

    print("\n--- TEST 11: Error handling tests (404 and 400) ---")
    s, err404 = req(f"{base}/9999/documents")
    print("Non-existent project -> Status:", s, "| Detail:", err404.get("detail"))
    assert s == 404

    s, err_doc404 = req(f"{base}/1/documents/99999/validate", method="POST")
    print("Non-existent document -> Status:", s, "| Detail:", err_doc404.get("detail"))
    assert s == 404

    s, err400 = req(
        f"{base}/1/documents/{coi_doc['id']}/reuse", method="POST", data={"approval_id": 99999}
    )
    print("Invalid clearance for project -> Status:", s, "| Detail:", err400.get("detail"))
    assert s == 400

    print("\nALL 11 TESTS PASSED SUCCESSFULLY!")
finally:
    server.should_exit = True
    thread.join(timeout=2)
