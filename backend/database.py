import sqlite3

DATABASE = "nexroute.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection
def init_db():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            industry TEXT,
            location TEXT,
            size TEXT,
            stage TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS approvals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            project_id INTEGER,
            department_id INTEGER,
            status TEXT DEFAULT 'Pending',
            FOREIGN KEY (project_id) REFERENCES projects(id),
            FOREIGN KEY (department_id) REFERENCES departments(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS approval_dependencies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            approval_id INTEGER,
            depends_on_id INTEGER,
            FOREIGN KEY (approval_id) REFERENCES approvals(id),
            FOREIGN KEY (depends_on_id) REFERENCES approvals(id)
        )
    """)

    connection.commit()
    connection.close()