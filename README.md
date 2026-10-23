# CyberSafe

**AI-Enhanced Cybersecurity Awareness Training and Phishing Simulation Platform** — a team-project prototype with a React frontend and a Python FastAPI or legacy Spring Boot API, backed by MySQL.

## Recommended setup: Python API

This option runs the frontend with the Python backend, so Java/JDK setup is not needed for the API. The frontend points to `127.0.0.1:8080` by default to match the local-only backend listener.

### Requirements

- Python 3.11 or newer
- Node.js 20.19+ and npm
- MySQL Server and MySQL Workbench

### 1. Set up MySQL

Start MySQL Server. In Workbench, connect as an administrator and run `backend-python/db/setup.sql`. It keeps the `cyberaware` database and existing data, and sets the app login used by this project. If the account already exists, the script resets its local development password to `cyberaware_local_dev`.

### 2. Start the Python backend

Open a VS Code terminal in `backend-python` and run:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

If PowerShell blocks activation, use a Command Prompt terminal:

```cmd
py -m venv .venv
.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

Keep this terminal open. Check the API at <http://127.0.0.1:8080/api/health>; API docs are at <http://127.0.0.1:8080/docs>. Startup creates missing tables and starter training content without deleting existing tables or rows.

Default local admin: `admin@cybersafe.local` / `ChangeMe-Admin-2026!`.

### 3. Start the React frontend

Open a second terminal in `frontend` and run:

```powershell
npm ci
npm run dev
```

Open the Vite URL, usually <http://localhost:5173>. The frontend calls `http://127.0.0.1:8080/api`. To use another API address, set `VITE_API_URL` before starting Vite.

### Python database configuration

Defaults are `localhost:3306`, database `cyberaware`, user `cyberaware_app`, password `cyberaware_local_dev`. Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in the backend terminal if yours differ. See `backend-python/.env.example` for all supported settings. The `.env.example` file is a reference; copy values into environment variables or edit them in your shell.

## Legacy Java backend

The original Spring Boot API remains in `backend/` for reference. It uses JDK 21. Do not start both APIs on port 8080 at the same time; use `backend-python` for the Python setup above.

## Features

- Employee registration/login, password hashing, signed JWT sessions, and role-protected admin routes
- Training courses, completion tracking, server-scored quizzes, and an inert in-app phishing practice scenario
- Employee progress, certificate print view, and admin employee/course/report dashboards
- MySQL persistence with table names compatible with the included Java backend

## Project scope and safety

This is a classroom prototype, not a production employee-monitoring or security system. The phishing practice is fictional, its displayed link is inactive, and the app never sends email or asks users for real credentials. “AI-enhanced” is the project title; this prototype does not call an AI model. Replace sample secrets, enable HTTPS, use managed migrations, and complete privacy/security review before deployment with real users.
