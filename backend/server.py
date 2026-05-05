from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone
import razorpay
import hmac
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_secret')

razorpay_client = None
try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    logging.warning(f"Razorpay client init failed: {e}")

# Pricing in paise
PRICE_REGULAR = 599900   # Rs. 5999
PRICE_STUDENT = 499900   # Rs. 4999

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# -------- Models --------
class EnrollmentCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    schedule: Literal["weekday", "weekend"]
    plan: Literal["regular", "student"]
    message: Optional[str] = Field(default=None, max_length=500)


class Enrollment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    schedule: str
    plan: str
    amount: int
    currency: str = "INR"
    status: str = "created"  # created | paid | failed
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


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


# -------- Helpers --------
def is_test_mode() -> bool:
    return RAZORPAY_KEY_ID == "rzp_test_placeholder" or RAZORPAY_KEY_SECRET == "placeholder_secret"


def get_amount(plan: str) -> int:
    return PRICE_STUDENT if plan == "student" else PRICE_REGULAR


# -------- Routes --------
@api_router.get("/")
async def root():
    return {"message": "Orchitek API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "razorpay_configured": not is_test_mode()}


@api_router.post("/enrollments", response_model=OrderResponse)
async def create_enrollment(payload: EnrollmentCreate):
    amount = get_amount(payload.plan)
    enrollment = Enrollment(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        schedule=payload.schedule,
        plan=payload.plan,
        amount=amount,
        message=payload.message,
    )

    order_id = None
    test_mode = is_test_mode()

    if not test_mode and razorpay_client is not None:
        try:
            order = razorpay_client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1,
                "notes": {
                    "enrollment_id": enrollment.id,
                    "schedule": payload.schedule,
                    "plan": payload.plan,
                },
            })
            order_id = order["id"]
            enrollment.razorpay_order_id = order_id
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise HTTPException(status_code=502, detail="Payment gateway error")

    doc = enrollment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enrollments.insert_one(doc)

    return OrderResponse(
        enrollment_id=enrollment.id,
        order_id=order_id,
        key_id=RAZORPAY_KEY_ID,
        amount=amount,
        currency="INR",
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        test_mode=test_mode,
    )


@api_router.post("/enrollments/verify")
async def verify_enrollment(payload: VerifyRequest):
    enrollment = await db.enrollments.find_one(
        {"id": payload.enrollment_id}, {"_id": 0}
    )
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    # Verify signature
    body = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode()
    expected = hmac.new(
        RAZORPAY_KEY_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()

    verified = hmac.compare_digest(expected, payload.razorpay_signature)

    new_status = "paid" if verified else "failed"
    await db.enrollments.update_one(
        {"id": payload.enrollment_id},
        {"$set": {
            "status": new_status,
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature,
        }}
    )

    if not verified:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    return {"status": "paid", "enrollment_id": payload.enrollment_id}


@api_router.post("/leads")
async def create_lead(payload: LeadCreate):
    lead_doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "source": payload.source,
        "message": payload.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(lead_doc)
    lead_doc.pop("_id", None)
    return {"status": "ok", "lead_id": lead_doc["id"]}


@api_router.get("/enrollments", response_model=List[Enrollment])
async def list_enrollments(limit: int = 100):
    items = await db.enrollments.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for it in items:
        if isinstance(it.get("created_at"), str):
            try:
                it["created_at"] = datetime.fromisoformat(it["created_at"])
            except Exception:
                pass
    return items


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
