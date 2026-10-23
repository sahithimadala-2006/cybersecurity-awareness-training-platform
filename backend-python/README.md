# Python API (FastAPI + MySQL)

This backend serves the existing React frontend on `http://localhost:8080/api`.
It uses the same MySQL database and table names as the Java backend.

## Requirements

- Python 3.11 or newer
- MySQL Server running locally

## First-time setup

1. In MySQL Workbench, connect as an administrator and run `db/setup.sql`. This keeps existing database data and sets the local app account password to `cyberaware_local_dev`.
2. Open a terminal in this folder and run:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

If PowerShell blocks virtual-environment activation, use Command Prompt instead:

```cmd
py -m venv .venv
.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```

Open `http://localhost:8080/api/health` to check the API and `http://localhost:8080/docs` for its interactive API documentation.

If `.venv` already exists, update its packages after pulling project changes with:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Employee sign-in security

After signing in, open **My profile → Sign-in security**. Employees can enroll an authenticator app by scanning the displayed QR code and confirming a six-digit code. The backend then displays one-time recovery codes; save them securely. MFA login accepts an authenticator code or an unused recovery code. Authenticator secrets are encrypted in MySQL using a key derived from `JWT_SECRET`, so keep that secret stable for this local database and replace the sample value before any deployment.

Employees can also add passkeys and use **Sign in with a passkey** from the sign-in page. The login page asks for the account email before starting the passkey prompt. Passkeys use the browser's WebAuthn support and work on `localhost`; a deployed site must use HTTPS. For a different local/deployment address, set `WEBAUTHN_ORIGIN` to the exact frontend origin and `WEBAUTHN_RP_ID` to its hostname. The defaults are `http://localhost:5173` and `localhost`.

Authenticator-app MFA and passkeys are independent options. An employee may enroll either one or both. The prototype does not send email codes.

## CyberSafe training assistant

The authenticated employee and administrator workspaces include a chat assistant for cybersecurity questions. It retrieves relevant guidance from the built-in safety topics and active training modules, then shows the source topics. This local prototype uses keyword-based retrieval rather than a hosted generative AI model, so it needs no AI API key and does not save chat prompts. It is educational guidance, not incident response; urgent events should go to the organization's IT/security team. Never enter passwords, one-time codes, recovery codes, or secret keys in chat.

## Database settings

Defaults match `db/setup.sql`. Override them with environment variables if needed: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `FRONTEND_ORIGIN`, `JWT_SECRET`, `JWT_TTL_MINUTES`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `WEBAUTHN_ORIGIN`, `WEBAUTHN_RP_ID`, and `WEBAUTHN_RP_NAME`.

The app creates missing tables and starter records at startup. It does not drop or reset existing tables. Do not use the sample JWT/admin secrets in a deployed system.
