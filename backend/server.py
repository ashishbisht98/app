from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone
import razorpay
import hmac
import hashlib

import firebase_admin
from firebase_admin import credentials, firestore

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---------- Firestore ----------
FIREBASE_CREDENTIALS_PATH = os.environ.get(
    'FIREBASE_CREDENTIALS_PATH', str(ROOT_DIR / 'firebase-admin.json')
)

if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred, {
        'projectId': os.environ.get('FIREBASE_PROJECT_ID'),
    })

db = firestore.client()
ENROLLMENTS = db.collection('enrollments')
LEADS = db.collection('leads')


async def fs_run(fn, *args, **kwargs):
    """Run blocking firestore call in a thread."""
    return await asyncio.to_thread(fn, *args, **kwargs)


# ---------- Razorpay ----------
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_secret')

razorpay_client = None
try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    logging.warning(f"Razorpay client init failed: {e}")

# Registration fee — refundable token (in paise). Defaults to ₹100.
REGISTRATION_FEE_PAISE = int(os.environ.get('REGISTRATION_FEE_PAISE', '10000'))

COURSE_FEE_REGULAR = 5999
COURSE_FEE_STUDENT = 4999


# ---------- App ----------
app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Models ----------
class EnrollmentCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    schedule: Literal["weekday", "weekend"]
    plan: Literal["regular", "student"]
    message: Optional[str] = Field(default=None, max_length=500)


class OrderResponse(BaseModel):
    enrollment_id: str
    order_id: Optional[str] = None
    key_id: str
    amount: int
    currency: str
    name: str
    email: str
    phone: str
    test_mode: bool
    course_fee: int


class VerifyRequest(BaseModel):
    enrollment_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    source: Optional[str] = Field(default="website")
    message: Optional[str] = Field(default=None, max_length=500)


# ---------- Helpers ----------
def is_test_mode() -> bool:
    return RAZORPAY_KEY_ID == "rzp_test_placeholder" or RAZORPAY_KEY_SECRET == "placeholder_secret"


def course_fee_for(plan: str) -> int:
    return COURSE_FEE_STUDENT if plan == "student" else COURSE_FEE_REGULAR


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Orchitek API", "status": "ok"}


@api_router.get("/health")
async def health():
    fs_ok = True
    try:
        await fs_run(lambda: db.collection('_health').document('ping').set({'t': datetime.now(timezone.utc).isoformat()}))
    except Exception as e:
        logger.error(f"Firestore health failed: {e}")
        fs_ok = False
    return {
        "status": "healthy" if fs_ok else "degraded",
        "firestore_ok": fs_ok,
        "razorpay_configured": not is_test_mode(),
        "registration_fee_inr": REGISTRATION_FEE_PAISE // 100,
    }


@api_router.post("/enrollments", response_model=OrderResponse)
async def create_enrollment(payload: EnrollmentCreate):
    enrollment_id = str(uuid.uuid4())
    amount = REGISTRATION_FEE_PAISE
    course_fee = course_fee_for(payload.plan)

    order_id: Optional[str] = None
    test_mode = is_test_mode()

    if not test_mode and razorpay_client is not None:
        try:
            order = razorpay_client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1,
                "notes": {
                    "enrollment_id": enrollment_id,
                    "schedule": payload.schedule,
                    "plan": payload.plan,
                    "course_fee_inr": str(course_fee),
                },
            })
            order_id = order["id"]
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise HTTPException(status_code=502, detail="Payment gateway error")

    doc = {
        "id": enrollment_id,
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "schedule": payload.schedule,
        "plan": payload.plan,
        "registration_amount": amount,
        "course_fee": course_fee,
        "currency": "INR",
        "status": "created",
        "razorpay_order_id": order_id,
        "razorpay_payment_id": None,
        "razorpay_signature": None,
        "message": payload.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    await fs_run(lambda: ENROLLMENTS.document(enrollment_id).set(doc))

    return OrderResponse(
        enrollment_id=enrollment_id,
        order_id=order_id,
        key_id=RAZORPAY_KEY_ID,
        amount=amount,
        currency="INR",
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        test_mode=test_mode,
        course_fee=course_fee,
    )


@api_router.post("/enrollments/verify")
async def verify_enrollment(payload: VerifyRequest):
    snap = await fs_run(lambda: ENROLLMENTS.document(payload.enrollment_id).get())
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    body = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode()
    expected = hmac.new(
        RAZORPAY_KEY_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()
    verified = hmac.compare_digest(expected, payload.razorpay_signature)

    new_status = "registered" if verified else "failed"
    update = {
        "status": new_status,
        "razorpay_order_id": payload.razorpay_order_id,
        "razorpay_payment_id": payload.razorpay_payment_id,
        "razorpay_signature": payload.razorpay_signature,
        "registered_at": datetime.now(timezone.utc).isoformat() if verified else None,
    }
    await fs_run(lambda: ENROLLMENTS.document(payload.enrollment_id).set(update, merge=True))

    if not verified:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    return {"status": "registered", "enrollment_id": payload.enrollment_id}


@api_router.post("/leads")
async def create_lead(payload: LeadCreate):
    lead_id = str(uuid.uuid4())
    doc = {
        "id": lead_id,
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "source": payload.source,
        "message": payload.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await fs_run(lambda: LEADS.document(lead_id).set(doc))
    return {"status": "ok", "lead_id": lead_id}


@api_router.get("/enrollments")
async def list_enrollments(limit: int = 100):
    def _query():
        q = ENROLLMENTS.order_by("created_at", direction=firestore.Query.DESCENDING).limit(limit)
        return [d.to_dict() for d in q.stream()]
    return await fs_run(_query)


# ---------- Mount ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
