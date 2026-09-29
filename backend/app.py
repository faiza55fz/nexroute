from flask import Flask,request,jsonify
from flask_cors import CORS
from database import init_db, get_db_connection

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "NexRoute Backend is Running!"
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    if role not in ["Applicant", "Officer", "Admin"]:
     return jsonify({"message": "Invalid role"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        (name, email, password, role)
    )

    connection.commit()
    connection.close()

    return jsonify({"message": "User registered successfully"})
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?",
        (email, password)
    )

    user = cursor.fetchone()
    connection.close()

    if user:
        return jsonify({
            "message": "Login successful",
            "user": dict(user)
        })

    return jsonify({"message": "Invalid email or password"}), 401
@app.route("/projects", methods=["POST"])
def create_project():
    data = request.get_json()

    name = data.get("name")
    industry = data.get("industry")
    location = data.get("location")
    size = data.get("size")
    stage = data.get("stage")
    user_id = data.get("user_id")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO projects
        (name, industry, location, size, stage, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (name, industry, location, size, stage, user_id)
    )

    connection.commit()
    project_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Project created successfully",
        "project_id": project_id
    })
@app.route("/approvals", methods=["POST"])
def create_approval():
    data = request.get_json()

    name = data.get("name")
    project_id = data.get("project_id")
    department_id = data.get("department_id")
    status = data.get("status", "Pending")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO approvals
        (name, project_id, department_id, status)
        VALUES (?, ?, ?, ?)
        """,
        (name, project_id, department_id, status)
    )

    connection.commit()
    approval_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Approval created successfully",
        "approval_id": approval_id
    })
@app.route("/departments", methods=["POST"])
def create_department():
    data = request.get_json()

    name = data.get("name")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO departments (name) VALUES (?)",
        (name,)
    )

    connection.commit()
    department_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Department created successfully",
        "department_id": department_id
    })
@app.route("/departments", methods=["GET"])
def get_departments():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM departments")

    departments = cursor.fetchall()
    connection.close()

    return jsonify([dict(department) for department in departments])

@app.route("/projects", methods=["GET"])
def get_projects():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM projects")

    projects = cursor.fetchall()
    connection.close()

    return jsonify([dict(project) for project in projects])
@app.route("/approvals", methods=["GET"])
def get_approvals():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT approvals.id,
               approvals.name,
               approvals.project_id,
               approvals.department_id,
               approvals.status,
               departments.name AS department_name
        FROM approvals
        LEFT JOIN departments
        ON approvals.department_id = departments.id
    """)

    approvals = cursor.fetchall()
    connection.close()

    return jsonify([dict(approval) for approval in approvals])
@app.route("/approvals/<int:approval_id>", methods=["PUT"])
def update_approval_status(approval_id):
    data = request.get_json()

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        connection.close()
        return jsonify({"message": "User not found"}), 404

    if user["role"] not in ["Officer", "Admin"]:
        connection.close()
        return jsonify({"message": "Access denied. Officer or Admin role required."}), 403
    status = data.get("status")

    

    cursor.execute(
        "UPDATE approvals SET status = ? WHERE id = ?",
        (status, approval_id)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Approval status updated successfully"
    })
@app.route("/approval-discovery/<int:project_id>", methods=["GET"])
def approval_discovery(project_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM projects WHERE id = ?",
        (project_id,)
    )

    project = cursor.fetchone()

    if not project:
        connection.close()
        return jsonify({"message": "Project not found"}), 404

    suggested_approvals = []

    if project["industry"] == "Manufacturing":
        suggested_approvals.append("Factory License")
    if project["stage"] == "Planning":
        suggested_approvals.append("Environmental Clearance")

    connection.close()

    return jsonify({
        "project_id": project_id,
        "suggested_approvals": suggested_approvals
    })
@app.route("/approval-dependencies", methods=["POST"])
def create_dependency():
    data = request.get_json()

    approval_id = data.get("approval_id")
    depends_on_id = data.get("depends_on_id")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO approval_dependencies
        (approval_id, depends_on_id)
        VALUES (?, ?)
        """,
        (approval_id, depends_on_id)
    )

    connection.commit()
    dependency_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Approval dependency created successfully",
        "dependency_id": dependency_id
    })
@app.route("/approval-dependencies", methods=["GET"])
def get_dependencies():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT approval_dependencies.id,
               approval_dependencies.approval_id,
               approval_dependencies.depends_on_id,
               a1.name AS approval_name,
               a2.name AS depends_on_name
        FROM approval_dependencies
        LEFT JOIN approvals a1
        ON approval_dependencies.approval_id = a1.id
        LEFT JOIN approvals a2
        ON approval_dependencies.depends_on_id = a2.id
    """)

    dependencies = cursor.fetchall()
    connection.close()

    return jsonify([dict(dependency) for dependency in dependencies])
@app.route("/officer-dashboard/<int:user_id>", methods=["GET"])
def officer_dashboard(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        (user_id,)
    )

    user = cursor.fetchone()
    connection.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user["role"] != "Officer":
        return jsonify({"message": "Access denied. Officer role required."}), 403

    return jsonify({
        "message": "Officer dashboard access granted",
        "user": dict(user)
    })
@app.route("/admin-dashboard/<int:user_id>", methods=["GET"])
def admin_dashboard(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        (user_id,)
    )

    user = cursor.fetchone()
    connection.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user["role"] != "Admin":
        return jsonify({"message": "Access denied. Admin role required."}), 403

    return jsonify({
        "message": "Admin dashboard access granted",
        "user": dict(user)
    })
@app.route("/approval-blockers/<int:approval_id>", methods=["GET"])
def get_approval_blockers(approval_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT a2.id,
               a2.name,
               a2.status
        FROM approval_dependencies ad
        JOIN approvals a2
        ON ad.depends_on_id = a2.id
        WHERE ad.approval_id = ?
    """, (approval_id,))

    dependencies = cursor.fetchall()
    connection.close()

    blocking_approvals = []

    for approval in dependencies:
        if approval["status"] != "Approved":
            blocking_approvals.append(dict(approval))

    return jsonify({
        "approval_id": approval_id,
        "blocked": len(blocking_approvals) > 0,
        "blocking_approvals": blocking_approvals
    })
@app.route("/approval-roadmap/<int:project_id>", methods=["GET"])
def approval_roadmap(project_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, name, status, department_id
        FROM approvals
        WHERE project_id = ?
    """, (project_id,))

    approvals = cursor.fetchall()

    if not approvals:
        connection.close()
        return jsonify({
            "project_id": project_id,
            "roadmap": []
        })

    roadmap = []

    for approval in approvals:
        cursor.execute("""
            SELECT a2.id, a2.name, a2.status
            FROM approval_dependencies ad
            JOIN approvals a2
            ON ad.depends_on_id = a2.id
            WHERE ad.approval_id = ?
        """, (approval["id"],))

        dependencies = cursor.fetchall()

        roadmap.append({
            "id": approval["id"],
            "name": approval["name"],
            "status": approval["status"],
            "department_id": approval["department_id"],
            "depends_on": [dict(dependency) for dependency in dependencies]
        })

    connection.close()

    return jsonify({
        "project_id": project_id,
        "roadmap": roadmap
    })
if __name__ == "__main__":
    init_db()
    app.run(debug=True)