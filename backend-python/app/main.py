from __future__ import annotations

import os
import base64
import hashlib
import io
import json
import re
import secrets
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

import bcrypt
import jwt
import mysql.connector
import pyotp
import qrcode
from cryptography.fernet import Fernet
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from mysql.connector import Error as MySQLError
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from webauthn import (
    base64url_to_bytes,
    generate_authentication_options,
    generate_registration_options,
    verify_authentication_response,
    verify_registration_response,
)
from webauthn.helpers import options_to_json
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    PublicKeyCredentialDescriptor,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)


DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "database": os.getenv("DB_NAME", "cyberaware"),
    "user": os.getenv("DB_USER", "cyberaware_app"),
    "password": os.getenv("DB_PASSWORD", "cyberaware_local_dev"),
    "autocommit": False,
}
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
WEBAUTHN_ORIGIN = os.getenv("WEBAUTHN_ORIGIN", FRONTEND_ORIGIN)
WEBAUTHN_RP_ID = os.getenv("WEBAUTHN_RP_ID", "localhost")
WEBAUTHN_RP_NAME = os.getenv("WEBAUTHN_RP_NAME", "CyberSafe")
JWT_SECRET = os.getenv("JWT_SECRET", "local-development-signing-key-replace-before-any-deployment-2026")
JWT_ISSUER = "cybersafe-api"
JWT_TTL_MINUTES = int(os.getenv("JWT_TTL_MINUTES", "180"))
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@cybersafe.local").strip().lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "ChangeMe-Admin-2026!")
bearer = HTTPBearer(auto_error=False)


def connect_db():
    return mysql.connector.connect(**DB_CONFIG)


def query(sql: str, params: tuple[Any, ...] = (), *, one: bool = False, commit: bool = False):
    connection = connect_db()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(sql, params)
        if cursor.with_rows:
            result = cursor.fetchone() if one else cursor.fetchall()
        else:
            result = None
        if commit:
            connection.commit()
        return result
    except Exception:
        connection.rollback()
        raise
    finally:
        cursor.close()
        connection.close()


def insert(sql: str, params: tuple[Any, ...] = ()) -> int:
    connection = connect_db()
    cursor = connection.cursor()
    try:
        cursor.execute(sql, params)
        connection.commit()
        return int(cursor.lastrowid)
    except Exception:
        connection.rollback()
        raise
    finally:
        cursor.close()
        connection.close()


TABLES = [
    """CREATE TABLE IF NOT EXISTS app_user (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL UNIQUE,
        department VARCHAR(100) NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS course (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(140) NOT NULL,
        category VARCHAR(80) NOT NULL,
        description VARCHAR(500) NOT NULL,
        content LONGTEXT NOT NULL,
        duration_minutes INT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS course_completion (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        course_id BIGINT NOT NULL,
        completed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE KEY uq_completion_user_course (user_id, course_id),
        INDEX idx_completion_course (course_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS quiz_question (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        course_id BIGINT NOT NULL,
        prompt VARCHAR(500) NOT NULL,
        option_a VARCHAR(300) NOT NULL,
        option_b VARCHAR(300) NOT NULL,
        option_c VARCHAR(300) NOT NULL,
        option_d VARCHAR(300) NOT NULL,
        correct_option INT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        INDEX idx_question_course (course_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS quiz_attempt (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        course_id BIGINT NOT NULL,
        score INT NOT NULL,
        total INT NOT NULL,
        submitted_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX idx_quiz_user_date (user_id, submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS simulation_scenario (
        id VARCHAR(80) NOT NULL PRIMARY KEY,
        sender VARCHAR(190) NOT NULL,
        subject VARCHAR(180) NOT NULL,
        message LONGTEXT NOT NULL,
        fake_link VARCHAR(400) NOT NULL,
        phishing BOOLEAN NOT NULL DEFAULT TRUE,
        active BOOLEAN NOT NULL DEFAULT TRUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS simulation_attempt (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        scenario_id VARCHAR(80) NOT NULL,
        identified_phishing BOOLEAN NOT NULL,
        correct BOOLEAN NOT NULL,
        submitted_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX idx_sim_user_date (user_id, submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS user_totp (
        user_id BIGINT NOT NULL PRIMARY KEY,
        secret_encrypted VARCHAR(512) NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS totp_recovery_code (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        code_hash VARCHAR(100) NOT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX idx_recovery_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS user_passkey (
        id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        credential_id VARCHAR(1600) NOT NULL,
        credential_hash BINARY(32) NOT NULL UNIQUE,
        public_key MEDIUMBLOB NOT NULL,
        sign_count BIGINT NOT NULL DEFAULT 0,
        transports VARCHAR(255) NOT NULL DEFAULT '[]',
        name VARCHAR(100) NOT NULL DEFAULT 'Passkey',
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        INDEX idx_passkey_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS webauthn_challenge (
        flow_id VARCHAR(64) NOT NULL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        purpose VARCHAR(20) NOT NULL,
        challenge VARCHAR(128) NOT NULL,
        expires_at DATETIME(6) NOT NULL,
        INDEX idx_webauthn_expiry (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
]


COURSES = [
    ("Recognize phishing", "Email safety", "Spot sender, urgency, link, and attachment warning signs.", "Phishing messages imitate trusted people or services. Pause before acting, inspect the full sender address and link destination, and verify unusual requests through a separate known channel. Never submit a password through an email link.", 12),
    ("Secure passwords and accounts", "Account security", "Protect passwords, MFA prompts, and recovery options.", "Use a unique long password for every service and store it in an approved password manager. Deny unexpected MFA prompts. Never disclose a one-time code or recovery code to a caller or message.", 10),
    ("Safe devices and downloads", "Device safety", "Handle unexpected files, downloads, and popups safely.", "Do not enable macros or install software from unexpected prompts. Verify files with the sender using a separate channel. Contact IT through a known support route if a device warning looks suspicious.", 10),
    ("Social engineering", "Workplace security", "Recognize pressure, impersonation, and unusual requests.", "Attackers may impersonate a manager, supplier, or support team. Verify payment, access, or sensitive-data requests through a second trusted contact method. Report concerns promptly without fear of blame.", 9),
]
QUESTION_BANK = [
    [("A message pressures you to verify an account immediately. What is safest?", "Verify through a known official route", "Open its link", "Reply with your password", "Forward it to everyone"), ("Which sender detail should you inspect?", "Full email address and domain", "Display name only", "Logo only", "Signature only"), ("A familiar colleague requests an urgent payment. What should you do?", "Confirm through a separate known contact method", "Pay immediately", "Send a password first", "Use the email link")],
    [("What is a safe password habit?", "Use a unique long password per account", "Reuse a memorable password", "Share it with your manager", "Add your birth year"), ("An unexpected MFA prompt appears. What should you do?", "Deny it and report it", "Approve it", "Share its code", "Ignore your organization policy"), ("Where should recovery codes be kept?", "In an approved secure location", "In a public document", "In chat", "In an email signature")],
    [("An unexpected document asks you to enable macros. What is safest?", "Stop and verify the file separately", "Enable them", "Forward the file", "Upload it publicly"), ("A popup gives a phone number for urgent IT support. What should you do?", "Contact IT using a known support route", "Call the popup number", "Install its suggested software", "Share your login"), ("Where should you get work software?", "From approved sources", "From popup links", "From unknown mirrors", "From personal file shares")],
    [("A caller claims to be IT and asks for your one-time code. What should you do?", "Do not share it; verify using known IT contact details", "Read the code aloud", "Send it by email", "Approve any prompt"), ("A senior person requests confidential files unexpectedly. What is safest?", "Verify identity and authorization separately", "Send immediately", "Use personal email", "Post the file in chat"), ("An unexpected visitor asks to follow you into a secure office. What should you do?", "Follow visitor verification procedures", "Hold the door open", "Share your badge", "Ignore access rules")],
]


def initialize_database():
    cn = connect_db()
    cur = cn.cursor()
    try:
        for statement in TABLES:
            cur.execute(statement)
        cur.execute("SELECT COUNT(*) FROM course")
        course_count = cur.fetchone()[0]
        if course_count == 0:
            cur.executemany("INSERT INTO course (title, category, description, content, duration_minutes, active) VALUES (%s,%s,%s,%s,%s,TRUE)", COURSES)
        cur.execute("SELECT id FROM course WHERE active=TRUE ORDER BY id LIMIT 4")
        course_ids = [row[0] for row in cur.fetchall()]
        cur.execute("SELECT COUNT(*) FROM quiz_question")
        if cur.fetchone()[0] == 0:
            for index, course_id in enumerate(course_ids[:len(QUESTION_BANK)]):
                for question in QUESTION_BANK[index]:
                    cur.execute("INSERT INTO quiz_question (course_id,prompt,option_a,option_b,option_c,option_d,correct_option,active) VALUES (%s,%s,%s,%s,%s,%s,%s,TRUE)", (course_id, *question, 0))
        cur.execute("SELECT COUNT(*) FROM simulation_scenario")
        if cur.fetchone()[0] == 0:
            cur.execute("INSERT INTO simulation_scenario (id,sender,subject,message,fake_link,phishing,active) VALUES (%s,%s,%s,%s,%s,TRUE,TRUE)", ("urgent-account", "security-alert@example.invalid", "Urgent: verify your account", "An unexpected alert threatens account suspension and requests immediate action. Inspect the sender and verify through a known support route.", "https://example.invalid/training-only"))
        cur.execute("SELECT id FROM app_user WHERE email=%s", (ADMIN_EMAIL,))
        if cur.fetchone() is None:
            pw = bcrypt.hashpw(ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cur.execute("INSERT INTO app_user (full_name,email,department,password_hash,role) VALUES (%s,%s,%s,%s,'ADMIN')", ("CyberSafe Administrator", ADMIN_EMAIL, "Security", pw))
        cn.commit()
    except Exception:
        cn.rollback()
        raise
    finally:
        cur.close()
        cn.close()


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        initialize_database()
    except MySQLError as exc:
        raise RuntimeError(f"Could not connect to MySQL at {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}. Check DB_USER and DB_PASSWORD. Details: {exc}") from exc
    yield


app = FastAPI(title="CyberSafe API (Python)", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[FRONTEND_ORIGIN], allow_credentials=True, allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], allow_headers=["Authorization", "Content-Type"])


@app.exception_handler(HTTPException)
async def http_error(_, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": str(exc.detail)})


@app.exception_handler(RequestValidationError)
async def validation_error(_, __):
    return JSONResponse(status_code=400, content={"error": "Please check the submitted fields"})


class RegisterRequest(BaseModel):
    fullName: str = Field(min_length=1, max_length=120)
    email: EmailStr
    department: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=10, max_length=72)


class LoginRequest(BaseModel):
    email: str
    password: str


class TotpCodeRequest(BaseModel):
    code: str = Field(min_length=6, max_length=32)


class TotpLoginRequest(TotpCodeRequest):
    challengeToken: str = Field(min_length=20)


class TotpDisableRequest(TotpCodeRequest):
    password: str = Field(min_length=1)


class PasskeyOptionsRequest(BaseModel):
    email: str


class PasskeyFinishRequest(BaseModel):
    flowId: str = Field(min_length=20, max_length=64)
    credential: dict[str, Any]
    name: str = Field(default="My passkey", min_length=1, max_length=100)


class CourseRequest(BaseModel):
    title: str = Field(min_length=1, max_length=140)
    category: str = Field(min_length=1, max_length=80)
    description: str = Field(min_length=1, max_length=500)
    content: str = Field(min_length=1)
    durationMinutes: int = Field(ge=1, le=600)
    active: bool = True


class QuestionRequest(BaseModel):
    courseId: int
    prompt: str = Field(min_length=1, max_length=500)
    optionA: str = Field(min_length=1, max_length=300)
    optionB: str = Field(min_length=1, max_length=300)
    optionC: str = Field(min_length=1, max_length=300)
    optionD: str = Field(min_length=1, max_length=300)
    correctOption: int = Field(ge=0, le=3)
    active: bool = True


class QuizAttemptRequest(BaseModel):
    courseId: int
    answers: list[int] = Field(min_length=1, max_length=25)


class ScenarioRequest(BaseModel):
    id: str = Field(min_length=1, max_length=80)
    sender: EmailStr
    subject: str = Field(min_length=1, max_length=180)
    message: str = Field(min_length=1)
    fakeLink: str = Field(min_length=1, max_length=400)
    phishing: bool
    active: bool = True


class SimulationResultRequest(BaseModel):
    scenarioId: str = Field(min_length=1)
    identifiedPhishing: bool


class AssistantChatRequest(BaseModel):
    prompt: str = Field(min_length=2, max_length=1000)


def public_user(user: dict[str, Any]) -> dict[str, Any]:
    return {"id": user["id"], "fullName": user["full_name"], "email": user["email"], "department": user["department"], "role": user["role"]}


def issue_token(user: dict[str, Any]) -> dict[str, Any]:
    now = datetime.now(timezone.utc)
    expires = now + timedelta(minutes=JWT_TTL_MINUTES)
    token = jwt.encode({"iss": JWT_ISSUER, "sub": user["email"], "iat": now, "exp": expires, "roles": [user["role"]], "userId": user["id"]}, JWT_SECRET, algorithm="HS256")
    return {"accessToken": token, "tokenType": "Bearer", "expiresIn": JWT_TTL_MINUTES * 60, "user": public_user(user)}


def totp_cipher() -> Fernet:
    # Domain-separate this key from the signing key. Configure a strong unique JWT_SECRET outside local demos.
    key = base64.urlsafe_b64encode(hashlib.sha256(("cybersafe-totp:" + JWT_SECRET).encode()).digest())
    return Fernet(key)


def totp_secret_for(user_id: int) -> str | None:
    row = query("SELECT secret_encrypted FROM user_totp WHERE user_id=%s AND enabled=TRUE", (user_id,), one=True)
    return totp_cipher().decrypt(row["secret_encrypted"].encode()).decode() if row else None


def valid_totp_or_recovery(user_id: int, code: str) -> bool:
    secret = totp_secret_for(user_id)
    if secret and pyotp.TOTP(secret).verify(code.strip(), valid_window=1):
        return True
    recovery_rows = query("SELECT id,code_hash FROM totp_recovery_code WHERE user_id=%s", (user_id,))
    candidate = code.strip().encode()
    for row in recovery_rows:
        if bcrypt.checkpw(candidate, row["code_hash"].encode()):
            query("DELETE FROM totp_recovery_code WHERE id=%s AND user_id=%s", (row["id"], user_id), commit=True)
            return True
    return False


def save_webauthn_challenge(user_id: int, purpose: str, challenge: bytes) -> str:
    flow_id = secrets.token_urlsafe(32)
    encoded = base64.urlsafe_b64encode(challenge).rstrip(b"=").decode()
    expires = (datetime.now(timezone.utc) + timedelta(minutes=5)).replace(tzinfo=None)
    query("DELETE FROM webauthn_challenge WHERE expires_at < UTC_TIMESTAMP(6)", commit=True)
    query("INSERT INTO webauthn_challenge(flow_id,user_id,purpose,challenge,expires_at) VALUES(%s,%s,%s,%s,%s)", (flow_id, user_id, purpose, encoded, expires), commit=True)
    return flow_id


def take_webauthn_challenge(flow_id: str, purpose: str) -> dict[str, Any]:
    row = query("SELECT * FROM webauthn_challenge WHERE flow_id=%s AND purpose=%s", (flow_id, purpose), one=True)
    query("DELETE FROM webauthn_challenge WHERE flow_id=%s", (flow_id,), commit=True)
    if not row or row["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Passkey request expired. Please try again.")
    return row


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def current_user(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        claims = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"], issuer=JWT_ISSUER)
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired session") from exc
    user = query("SELECT id,full_name,email,department,role FROM app_user WHERE email=%s", (claims["sub"],), one=True)
    if user is None:
        raise HTTPException(status_code=401, detail="Account not found")
    return user


def admin_user(user: Annotated[dict[str, Any], Depends(current_user)]):
    if user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Administrator access required")
    return user


User = Annotated[dict[str, Any], Depends(current_user)]
Admin = Annotated[dict[str, Any], Depends(admin_user)]


def course_json(row):
    return {"id": row["id"], "title": row["title"], "category": row["category"], "description": row["description"], "content": row["content"], "durationMinutes": row["duration_minutes"], "active": bool(row["active"])}


def question_json(row, include_answer=False):
    out = {"id": row["id"], "prompt": row["prompt"], "options": [row["option_a"], row["option_b"], row["option_c"], row["option_d"]]}
    if include_answer:
        out["correctOption"] = row["correct_option"]
    return out


def scenario_json(row, include_private=False):
    result = {"id": row["id"], "sender": row["sender"], "subject": row["subject"], "message": row["message"], "fakeLink": row["fake_link"]}
    if include_private:
        result.update({"phishing": bool(row["phishing"]), "active": bool(row["active"])})
    return result


@app.get("/api/health")
def health():
    try:
        query("SELECT 1", one=True)
        return {"status": "ok", "service": "cybersafe-api-python", "database": "connected"}
    except MySQLError:
        raise HTTPException(status_code=503, detail="API is running but MySQL is unavailable")


ASSISTANT_GUIDANCE = [
    {"title": "Recognizing phishing", "text": "Check the sender address carefully, watch for unexpected urgency or threats, generic greetings, unusual attachments, and links whose destination does not match the displayed text. Do not open a suspicious link or attachment. Verify unusual requests using a contact method you already trust, then report the message through your organization's approved channel."},
    {"title": "Passwords and account security", "text": "Use a long, unique password for every account and store it in an approved password manager. Turn on multifactor authentication or use a passkey where available. Never share a password, one-time code, or recovery code with anyone, including this assistant. If a password may have been exposed, change it through the real service and notify your IT or security team."},
    {"title": "Authenticator codes and recovery", "text": "Enter a six-digit authenticator code only into the sign-in page you intentionally opened. Never send it in chat or tell it to another person. Keep recovery codes private and stored securely; each recovery code should be treated like a password. If you lose access to your authenticator, use the service's official recovery process and contact your administrator."},
    {"title": "Passkeys", "text": "A passkey signs you in using your device's built-in screen lock or security key. Approve a passkey prompt only when you started the sign-in yourself and the site address is correct. Do not approve unexpected prompts. Use account security settings to add or remove a passkey, and report an unfamiliar passkey."},
    {"title": "Malware and suspicious downloads", "text": "Do not install unexpected software or enable macros because a message asks you to. Download software only from approved sources, keep your operating system and applications updated, and use your organization's security tools. If you opened a suspicious file, stop interacting with it and contact IT/security promptly."},
    {"title": "Social engineering", "text": "Attackers may impersonate executives, support staff, vendors, or coworkers and pressure you to reveal information, approve a request, or transfer money. Pause, verify the request through a separately known phone number or channel, and follow your organization's approval process. Do not use contact details supplied in the suspicious request."},
    {"title": "Reporting a security concern", "text": "Use your organization's approved reporting channel or contact its IT/security team. Include what happened, when it happened, and relevant message details, but do not forward secrets or credentials. If you entered a password or code, change the password through the genuine service and tell IT/security immediately."},
]


def assistant_tokens(text: str) -> set[str]:
    words = set(re.findall(r"[a-z0-9]+", text.lower()))
    ignored = {"the", "and", "for", "you", "your", "are", "what", "how", "can", "could", "should", "would", "with", "from", "this", "that", "when", "where", "who", "why", "does", "do", "is", "it", "a", "an", "to", "of", "in", "on", "i", "my", "we", "our", "please", "tell", "about"}
    synonyms = {"phished": "phishing", "scam": "phishing", "scams": "phishing", "email": "phishing", "emails": "phishing", "passkeys": "passkey", "passwords": "password", "codes": "code", "mfa": "authenticator", "2fa": "authenticator", "otp": "authenticator", "virus": "download", "hacked": "exposed", "hack": "exposed"}
    return {synonyms.get(word, word) for word in words if word not in ignored and len(word) > 1}


@app.post("/api/assistant/chat")
def assistant_chat(body: AssistantChatRequest, _: User):
    # Prompts are processed for this response only and are not written to the database.
    prompt = body.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Enter a cybersecurity question.")
    sensitive = re.search(r"\b(password|passphrase|one.?time\s+(?:code|password|pin)|otp|authenticator\s+code|recovery\s+code|secret\s+key|private\s+key|api\s+key)\b", prompt, re.I)
    if sensitive:
        return {"answer": "Please do not share passwords, one-time codes, recovery codes, or secret keys here. I do not need them to help. If one may have been exposed, change or revoke it using the genuine service and notify your IT/security team.", "sources": ["Passwords and account security", "Authenticator codes and recovery"], "mode": "safety"}

    documents = list(ASSISTANT_GUIDANCE)
    for row in query("SELECT title,category,description,content FROM course WHERE active=TRUE ORDER BY id"):
        documents.append({"title": row["title"], "text": f"{row['category']}. {row['description']} {row['content']}"})
    terms = assistant_tokens(prompt)
    ranked = []
    for document in documents:
        doc_terms = assistant_tokens(document["title"] + " " + document["text"])
        overlap = terms & doc_terms
        score = len(overlap) / max(1, len(terms) ** 0.5)
        if score:
            ranked.append((score, document))
    ranked.sort(key=lambda item: item[0], reverse=True)
    if not ranked or ranked[0][0] < 0.35:
        return {"answer": "I can help with phishing, account security, passkeys, authenticator codes, malware, social engineering, and reporting concerns. Try asking about one of those topics, or contact your IT/security team for an urgent incident.", "sources": [], "mode": "retrieval"}
    best_score = ranked[0][0]
    sources = [doc["title"] for score, doc in ranked[:2] if score >= best_score * 0.55]
    return {"answer": ranked[0][1]["text"], "sources": sources, "mode": "retrieval"}


@app.post("/api/auth/register", status_code=201)
def register(body: RegisterRequest):
    email = str(body.email).strip().lower()
    if query("SELECT id FROM app_user WHERE email=%s", (email,), one=True):
        raise HTTPException(status_code=409, detail="An account already exists for this email")
    hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
    try:
        query("INSERT INTO app_user(full_name,email,department,password_hash,role) VALUES(%s,%s,%s,%s,'EMPLOYEE')", (body.fullName.strip(), email, body.department.strip(), hashed), commit=True)
    except MySQLError as exc:
        if getattr(exc, "errno", None) == 1062:
            raise HTTPException(status_code=409, detail="An account already exists for this email") from exc
        raise
    user = query("SELECT id,full_name,email,department,role FROM app_user WHERE email=%s", (email,), one=True)
    return issue_token(user)


@app.post("/api/auth/login")
def login(body: LoginRequest):
    user = query("SELECT * FROM app_user WHERE email=%s", (str(body.email).strip().lower(),), one=True)
    if user is None or not bcrypt.checkpw(body.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    totp = query("SELECT enabled FROM user_totp WHERE user_id=%s", (user["id"],), one=True)
    if totp and totp["enabled"]:
        now = datetime.now(timezone.utc)
        challenge = jwt.encode({"iss": JWT_ISSUER, "sub": user["email"], "iat": now, "exp": now + timedelta(minutes=5), "purpose": "totp-login"}, JWT_SECRET, algorithm="HS256")
        return {"requiresMfa": True, "challengeToken": challenge}
    return issue_token(user)


@app.post("/api/auth/totp/login")
def complete_totp_login(body: TotpLoginRequest):
    try:
        claims = jwt.decode(body.challengeToken, JWT_SECRET, algorithms=["HS256"], issuer=JWT_ISSUER)
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="MFA request expired. Sign in again.") from exc
    if claims.get("purpose") != "totp-login":
        raise HTTPException(status_code=401, detail="Invalid MFA request")
    user = query("SELECT id,full_name,email,department,role FROM app_user WHERE email=%s", (claims["sub"],), one=True)
    if not user or not valid_totp_or_recovery(user["id"], body.code):
        raise HTTPException(status_code=401, detail="Invalid authenticator or recovery code")
    return issue_token(user)


@app.get("/api/auth/security")
def security_settings(user: User):
    totp = query("SELECT enabled FROM user_totp WHERE user_id=%s", (user["id"],), one=True)
    keys = query("SELECT id,name,created_at FROM user_passkey WHERE user_id=%s ORDER BY id", (user["id"],))
    return {"totpEnabled": bool(totp and totp["enabled"]), "passkeys": [{"id": k["id"], "name": k["name"], "createdAt": k["created_at"].replace(tzinfo=timezone.utc).isoformat()} for k in keys]}


@app.post("/api/auth/totp/setup")
def setup_totp(user: User):
    current = query("SELECT enabled FROM user_totp WHERE user_id=%s", (user["id"],), one=True)
    if current and current["enabled"]:
        raise HTTPException(status_code=409, detail="Authenticator app is already enabled. Disable it before setting up a new device.")
    secret = pyotp.random_base32()
    encrypted = totp_cipher().encrypt(secret.encode()).decode()
    query("INSERT INTO user_totp(user_id,secret_encrypted,enabled) VALUES(%s,%s,FALSE) ON DUPLICATE KEY UPDATE secret_encrypted=VALUES(secret_encrypted),enabled=FALSE", (user["id"], encrypted), commit=True)
    uri = pyotp.TOTP(secret).provisioning_uri(name=user["email"], issuer_name="CyberSafe")
    image = qrcode.make(uri)
    stream = io.BytesIO()
    image.save(stream, format="PNG")
    qr = "data:image/png;base64," + base64.b64encode(stream.getvalue()).decode()
    return {"secret": secret, "qrCode": qr}


@app.post("/api/auth/totp/confirm")
def confirm_totp(body: TotpCodeRequest, user: User):
    pending = query("SELECT secret_encrypted,enabled FROM user_totp WHERE user_id=%s", (user["id"],), one=True)
    if not pending or pending["enabled"]:
        raise HTTPException(status_code=409, detail="Start authenticator setup first.")
    secret = totp_cipher().decrypt(pending["secret_encrypted"].encode()).decode()
    if not pyotp.TOTP(secret).verify(body.code.strip(), valid_window=1):
        raise HTTPException(status_code=400, detail="That code did not match. Check your authenticator app and try again.")
    codes = [secrets.token_hex(5).upper() for _ in range(8)]
    query("DELETE FROM totp_recovery_code WHERE user_id=%s", (user["id"],), commit=True)
    for code in codes:
        insert("INSERT INTO totp_recovery_code(user_id,code_hash) VALUES(%s,%s)", (user["id"], bcrypt.hashpw(code.encode(), bcrypt.gensalt()).decode()))
    query("UPDATE user_totp SET enabled=TRUE WHERE user_id=%s", (user["id"],), commit=True)
    return {"enabled": True, "recoveryCodes": codes}


@app.post("/api/auth/totp/disable")
def disable_totp(body: TotpDisableRequest, user: User):
    row = query("SELECT password_hash FROM app_user WHERE id=%s", (user["id"],), one=True)
    if not row or not bcrypt.checkpw(body.password.encode(), row["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    if not valid_totp_or_recovery(user["id"], body.code):
        raise HTTPException(status_code=401, detail="Authenticator or recovery code is incorrect")
    query("DELETE FROM totp_recovery_code WHERE user_id=%s", (user["id"],), commit=True)
    query("DELETE FROM user_totp WHERE user_id=%s", (user["id"],), commit=True)
    return {"enabled": False}


@app.post("/api/auth/passkeys/register/options")
def passkey_register_options(user: User):
    existing = query("SELECT credential_id,transports FROM user_passkey WHERE user_id=%s", (user["id"],))
    excluded = [PublicKeyCredentialDescriptor(id=base64url_to_bytes(row["credential_id"])) for row in existing]
    options = generate_registration_options(
        rp_id=WEBAUTHN_RP_ID,
        rp_name=WEBAUTHN_RP_NAME,
        user_id=int(user["id"]).to_bytes(8, "big"),
        user_name=user["email"],
        user_display_name=user["full_name"],
        exclude_credentials=excluded,
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.REQUIRED,
            user_verification=UserVerificationRequirement.REQUIRED,
        ),
    )
    flow_id = save_webauthn_challenge(user["id"], "register", options.challenge)
    return {"flowId": flow_id, "options": json.loads(options_to_json(options))}


@app.post("/api/auth/passkeys/register/finish")
def passkey_register_finish(body: PasskeyFinishRequest, user: User):
    flow = take_webauthn_challenge(body.flowId, "register")
    if flow["user_id"] != user["id"]:
        raise HTTPException(status_code=400, detail="Passkey request belongs to a different account.")
    try:
        verified = verify_registration_response(
            credential=body.credential,
            expected_challenge=base64url_to_bytes(flow["challenge"]),
            expected_rp_id=WEBAUTHN_RP_ID,
            expected_origin=WEBAUTHN_ORIGIN,
            require_user_verification=True,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Passkey registration could not be verified. Try again on localhost or HTTPS.") from exc
    transports = body.credential.get("response", {}).get("transports", [])
    try:
        query("INSERT INTO user_passkey(user_id,credential_id,credential_hash,public_key,sign_count,transports,name) VALUES(%s,%s,%s,%s,%s,%s,%s)", (user["id"], b64url(verified.credential_id), hashlib.sha256(verified.credential_id).digest(), verified.credential_public_key, verified.sign_count, json.dumps(transports), body.name.strip()), commit=True)
    except MySQLError as exc:
        if getattr(exc, "errno", None) == 1062:
            raise HTTPException(status_code=409, detail="That passkey is already registered.") from exc
        raise
    return {"registered": True}


@app.post("/api/auth/passkeys/login/options")
def passkey_login_options(body: PasskeyOptionsRequest):
    user = query("SELECT id,email FROM app_user WHERE email=%s", (body.email.strip().lower(),), one=True)
    if not user:
        raise HTTPException(status_code=404, detail="No account was found for that email.")
    keys = query("SELECT credential_id,transports FROM user_passkey WHERE user_id=%s", (user["id"],))
    if not keys:
        raise HTTPException(status_code=404, detail="No passkey is registered for this account yet.")
    allow = [PublicKeyCredentialDescriptor(id=base64url_to_bytes(k["credential_id"])) for k in keys]
    options = generate_authentication_options(rp_id=WEBAUTHN_RP_ID, allow_credentials=allow, user_verification=UserVerificationRequirement.REQUIRED)
    flow_id = save_webauthn_challenge(user["id"], "login", options.challenge)
    return {"flowId": flow_id, "options": json.loads(options_to_json(options))}


@app.post("/api/auth/passkeys/login/finish")
def passkey_login_finish(body: PasskeyFinishRequest):
    flow = take_webauthn_challenge(body.flowId, "login")
    credential_id = body.credential.get("id", "")
    try:
        credential_hash = hashlib.sha256(base64url_to_bytes(credential_id)).digest()
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid passkey credential.") from exc
    stored = query("SELECT p.*,u.id AS account_id,u.full_name,u.email,u.department,u.role FROM user_passkey p JOIN app_user u ON u.id=p.user_id WHERE p.user_id=%s AND p.credential_hash=%s", (flow["user_id"], credential_hash), one=True)
    if not stored:
        raise HTTPException(status_code=401, detail="Passkey was not found for this account.")
    try:
        verified = verify_authentication_response(
            credential=body.credential,
            expected_challenge=base64url_to_bytes(flow["challenge"]),
            expected_rp_id=WEBAUTHN_RP_ID,
            expected_origin=WEBAUTHN_ORIGIN,
            credential_public_key=stored["public_key"],
            credential_current_sign_count=stored["sign_count"],
            require_user_verification=True,
        )
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Passkey verification failed. Try again.") from exc
    query("UPDATE user_passkey SET sign_count=%s WHERE id=%s", (verified.new_sign_count, stored["id"]), commit=True)
    user = {"id": stored["account_id"], "full_name": stored["full_name"], "email": stored["email"], "department": stored["department"], "role": stored["role"]}
    return issue_token(user)


@app.delete("/api/auth/passkeys/{passkey_id}", status_code=204)
def delete_passkey(passkey_id: int, user: User):
    query("DELETE FROM user_passkey WHERE id=%s AND user_id=%s", (passkey_id, user["id"]), commit=True)


@app.get("/api/courses")
def active_courses():
    return [course_json(row) for row in query("SELECT * FROM course WHERE active=TRUE ORDER BY id")]


@app.get("/api/courses/admin/all")
def all_courses(_: Admin):
    return [course_json(row) for row in query("SELECT * FROM course ORDER BY id")]


@app.get("/api/courses/{course_id}")
def get_course(course_id: int):
    row = query("SELECT * FROM course WHERE id=%s AND active=TRUE", (course_id,), one=True)
    if not row:
        raise HTTPException(status_code=404, detail="Course not found")
    return course_json(row)


@app.post("/api/courses", status_code=201)
def create_course(body: CourseRequest, _: Admin):
    course_id = insert("INSERT INTO course(title,category,description,content,duration_minutes,active) VALUES(%s,%s,%s,%s,%s,TRUE)", (body.title, body.category, body.description, body.content, body.durationMinutes))
    return course_json(query("SELECT * FROM course WHERE id=%s", (course_id,), one=True))


@app.put("/api/courses/{course_id}")
def update_course(course_id: int, body: CourseRequest, _: Admin):
    if not query("SELECT id FROM course WHERE id=%s", (course_id,), one=True):
        raise HTTPException(status_code=404, detail="Course not found")
    query("UPDATE course SET title=%s,category=%s,description=%s,content=%s,duration_minutes=%s,active=%s WHERE id=%s", (body.title, body.category, body.description, body.content, body.durationMinutes, body.active, course_id), commit=True)
    return course_json(query("SELECT * FROM course WHERE id=%s", (course_id,), one=True))


@app.delete("/api/courses/{course_id}", status_code=204)
def archive_course(course_id: int, _: Admin):
    if not query("SELECT id FROM course WHERE id=%s", (course_id,), one=True):
        raise HTTPException(status_code=404, detail="Course not found")
    query("UPDATE course SET active=FALSE WHERE id=%s", (course_id,), commit=True)


@app.get("/api/progress/me")
def my_progress(user: User):
    uid = user["id"]
    completions = query("SELECT id,user_id,course_id,completed_at FROM course_completion WHERE user_id=%s ORDER BY completed_at DESC", (uid,))
    quizzes = query("SELECT id,user_id,course_id,score,total,submitted_at FROM quiz_attempt WHERE user_id=%s ORDER BY submitted_at DESC", (uid,))
    sims = query("SELECT id,user_id,scenario_id,identified_phishing,correct,submitted_at FROM simulation_attempt WHERE user_id=%s ORDER BY submitted_at DESC", (uid,))
    return {"completions": [{"id": x["id"], "userId": x["user_id"], "courseId": x["course_id"], "completedAt": x["completed_at"].replace(tzinfo=timezone.utc).isoformat()} for x in completions], "quizAttempts": [{"id": x["id"], "userId": x["user_id"], "courseId": x["course_id"], "score": x["score"], "total": x["total"], "percentage": round(x["score"] * 100 / x["total"]) if x["total"] else 0, "submittedAt": x["submitted_at"].replace(tzinfo=timezone.utc).isoformat()} for x in quizzes], "simulations": [{"id": x["id"], "userId": x["user_id"], "scenarioId": x["scenario_id"], "identifiedPhishing": bool(x["identified_phishing"]), "correct": bool(x["correct"]), "submittedAt": x["submitted_at"].replace(tzinfo=timezone.utc).isoformat()} for x in sims]}


@app.post("/api/progress/courses/{course_id}/complete", status_code=201)
def complete_course(course_id: int, user: User):
    if not query("SELECT id FROM course WHERE id=%s", (course_id,), one=True):
        raise HTTPException(status_code=404, detail="Course not found")
    query("INSERT IGNORE INTO course_completion(user_id,course_id) VALUES(%s,%s)", (user["id"], course_id), commit=True)
    return {"courseId": course_id, "completed": True}


@app.get("/api/quizzes")
def get_quiz(courseId: int):
    if not query("SELECT id FROM course WHERE id=%s", (courseId,), one=True):
        raise HTTPException(status_code=404, detail="Course not found")
    rows = query("SELECT * FROM quiz_question WHERE course_id=%s AND active=TRUE ORDER BY id", (courseId,))
    return {"courseId": courseId, "questions": [question_json(row) for row in rows]}


@app.get("/api/quizzes/admin")
def admin_quiz(courseId: int, _: Admin):
    return [question_json(row, True) for row in query("SELECT * FROM quiz_question WHERE course_id=%s ORDER BY id", (courseId,))]


@app.post("/api/quizzes", status_code=201)
def add_question(body: QuestionRequest, _: Admin):
    if not query("SELECT id FROM course WHERE id=%s", (body.courseId,), one=True):
        raise HTTPException(status_code=404, detail="Course not found")
    question_id = insert("INSERT INTO quiz_question(course_id,prompt,option_a,option_b,option_c,option_d,correct_option,active) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)", (body.courseId, body.prompt, body.optionA, body.optionB, body.optionC, body.optionD, body.correctOption, body.active))
    return question_json(query("SELECT * FROM quiz_question WHERE id=%s", (question_id,), one=True), True)


@app.put("/api/quizzes/{question_id}")
def update_question(question_id: int, body: QuestionRequest, _: Admin):
    row = query("SELECT * FROM quiz_question WHERE id=%s", (question_id,), one=True)
    if not row:
        raise HTTPException(status_code=404, detail="Question not found")
    if row["course_id"] != body.courseId:
        raise HTTPException(status_code=400, detail="Question course cannot be changed")
    query("UPDATE quiz_question SET prompt=%s,option_a=%s,option_b=%s,option_c=%s,option_d=%s,correct_option=%s,active=%s WHERE id=%s", (body.prompt, body.optionA, body.optionB, body.optionC, body.optionD, body.correctOption, body.active, question_id), commit=True)
    return question_json(query("SELECT * FROM quiz_question WHERE id=%s", (question_id,), one=True), True)


@app.delete("/api/quizzes/{question_id}", status_code=204)
def delete_question(question_id: int, _: Admin):
    if not query("SELECT id FROM quiz_question WHERE id=%s", (question_id,), one=True):
        raise HTTPException(status_code=404, detail="Question not found")
    query("DELETE FROM quiz_question WHERE id=%s", (question_id,), commit=True)


@app.post("/api/quizzes/attempts", status_code=201)
def submit_quiz(body: QuizAttemptRequest, user: User):
    if not query("SELECT id FROM course WHERE id=%s", (body.courseId,), one=True):
        raise HTTPException(status_code=404, detail="Course not found")
    bank = query("SELECT correct_option FROM quiz_question WHERE course_id=%s AND active=TRUE ORDER BY id", (body.courseId,))
    if not bank:
        raise HTTPException(status_code=409, detail="This course does not have a quiz yet")
    if len(bank) != len(body.answers) or any(answer not in (0, 1, 2, 3) for answer in body.answers):
        raise HTTPException(status_code=400, detail="Answer every question in this quiz")
    score = sum(answer == row["correct_option"] for answer, row in zip(body.answers, bank))
    attempt_id = insert("INSERT INTO quiz_attempt(user_id,course_id,score,total) VALUES(%s,%s,%s,%s)", (user["id"], body.courseId, score, len(bank)))
    percent = round(score * 100 / len(bank))
    feedback = "Great work. Keep applying these habits." if score >= len(bank) * 0.8 else "Review the lesson and try again; practice builds confidence."
    return {"id": attempt_id, "courseId": body.courseId, "score": score, "total": len(bank), "percentage": percent, "feedback": feedback}


@app.get("/api/simulations")
def active_scenarios():
    return [scenario_json(row) for row in query("SELECT * FROM simulation_scenario WHERE active=TRUE ORDER BY id")]


@app.get("/api/simulations/admin")
def all_scenarios(_: Admin):
    return [scenario_json(row, True) for row in query("SELECT * FROM simulation_scenario ORDER BY id")]


@app.post("/api/simulations/admin", status_code=201)
def create_scenario(body: ScenarioRequest, _: Admin):
    if query("SELECT id FROM simulation_scenario WHERE id=%s", (body.id,), one=True):
        raise HTTPException(status_code=409, detail="Scenario ID already exists")
    query("INSERT INTO simulation_scenario(id,sender,subject,message,fake_link,phishing,active) VALUES(%s,%s,%s,%s,%s,%s,%s)", (body.id, str(body.sender), body.subject, body.message, body.fakeLink, body.phishing, body.active), commit=True)
    return scenario_json(query("SELECT * FROM simulation_scenario WHERE id=%s", (body.id,), one=True), True)


@app.put("/api/simulations/admin/{scenario_id}")
def update_scenario(scenario_id: str, body: ScenarioRequest, _: Admin):
    if scenario_id != body.id:
        raise HTTPException(status_code=400, detail="Scenario ID cannot be changed")
    if not query("SELECT id FROM simulation_scenario WHERE id=%s", (scenario_id,), one=True):
        raise HTTPException(status_code=404, detail="Scenario not found")
    query("UPDATE simulation_scenario SET sender=%s,subject=%s,message=%s,fake_link=%s,phishing=%s,active=%s WHERE id=%s", (str(body.sender), body.subject, body.message, body.fakeLink, body.phishing, body.active, scenario_id), commit=True)
    return scenario_json(query("SELECT * FROM simulation_scenario WHERE id=%s", (scenario_id,), one=True), True)


@app.delete("/api/simulations/admin/{scenario_id}", status_code=204)
def archive_scenario(scenario_id: str, _: Admin):
    if not query("SELECT id FROM simulation_scenario WHERE id=%s", (scenario_id,), one=True):
        raise HTTPException(status_code=404, detail="Scenario not found")
    query("UPDATE simulation_scenario SET active=FALSE WHERE id=%s", (scenario_id,), commit=True)


@app.post("/api/simulations/results", status_code=201)
def submit_simulation(body: SimulationResultRequest, user: User):
    scenario = query("SELECT * FROM simulation_scenario WHERE id=%s AND active=TRUE", (body.scenarioId,), one=True)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    correct = bool(scenario["phishing"]) == body.identifiedPhishing
    saved_id = insert("INSERT INTO simulation_attempt(user_id,scenario_id,identified_phishing,correct) VALUES(%s,%s,%s,%s)", (user["id"], scenario["id"], body.identifiedPhishing, correct))
    feedback = "Correct. You identified the scenario accurately." if correct else "Review the warning signs and verify requests through an independently known channel."
    return {"id": saved_id, "identifiedPhishing": body.identifiedPhishing, "correct": correct, "feedback": feedback}


@app.get("/api/admin/dashboard")
def admin_dashboard(_: Admin):
    employees = query("SELECT COUNT(*) AS n FROM app_user WHERE role='EMPLOYEE'", one=True)["n"]
    active_courses = query("SELECT COUNT(*) AS n FROM course WHERE active=TRUE", one=True)["n"]
    quiz_stats = query("SELECT COUNT(*) AS n, COALESCE(AVG(ROUND(score*100/NULLIF(total,0))),0) AS avg_score FROM quiz_attempt", one=True)
    completions = query("SELECT COUNT(*) AS n FROM course_completion", one=True)["n"]
    sims = query("SELECT COUNT(*) AS n, COALESCE(SUM(correct),0) AS correct FROM simulation_attempt", one=True)
    possible = employees * max(1, active_courses)
    return {"employees": employees, "activeCourses": active_courses, "averageQuizScore": round(float(quiz_stats["avg_score"])), "courseCompletions": completions, "completionRate": round(completions * 100 / possible) if possible else 0, "quizAttempts": quiz_stats["n"], "simulationAttempts": sims["n"], "correctSimulationRate": round(sims["correct"] * 100 / sims["n"]) if sims["n"] else 0}


@app.get("/api/admin/users")
def admin_users(_: Admin):
    rows = query("SELECT id,full_name,email,department,created_at FROM app_user WHERE role='EMPLOYEE' ORDER BY id")
    return [{"id": r["id"], "fullName": r["full_name"], "email": r["email"], "department": r["department"], "joinedAt": r["created_at"].replace(tzinfo=timezone.utc).isoformat()} for r in rows]


@app.get("/api/admin/reports")
def admin_reports(_: Admin):
    rows = query("SELECT c.id,c.title,c.active,COUNT(cc.id) AS completions FROM course c LEFT JOIN course_completion cc ON cc.course_id=c.id GROUP BY c.id,c.title,c.active ORDER BY c.id")
    return [{"courseId": r["id"], "title": r["title"], "completions": r["completions"], "active": bool(r["active"])} for r in rows]
