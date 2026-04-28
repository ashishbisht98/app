"""Backend API tests for Orchitek landing page."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://mobile-learn-pro.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health ----
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        d = r.json()
        assert d.get("status") == "ok"

    def test_health(self, client):
        r = client.get(f"{API}/health")
        assert r.status_code == 200
        d = r.json()
        assert d["status"] == "healthy"
        # Test mode placeholder => razorpay_configured False
        assert d["razorpay_configured"] is False


# ---- Enrollments ----
class TestEnrollments:
    def test_create_regular(self, client):
        payload = {
            "name": "TEST_Aarav",
            "email": "test_aarav@example.com",
            "phone": "+919999999999",
            "schedule": "weekday",
            "plan": "regular",
            "message": "Looking forward",
        }
        r = client.post(f"{API}/enrollments", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["amount"] == 599900
        assert d["currency"] == "INR"
        assert d["test_mode"] is True
        assert d["order_id"] is None
        assert d["key_id"] == "rzp_test_placeholder"
        assert isinstance(d["enrollment_id"], str) and len(d["enrollment_id"]) > 0
        assert d["name"] == "TEST_Aarav"

    def test_create_student(self, client):
        payload = {
            "name": "TEST_Diya",
            "email": "test_diya@example.com",
            "phone": "+919888888888",
            "schedule": "weekend",
            "plan": "student",
        }
        r = client.post(f"{API}/enrollments", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["amount"] == 499900
        assert d["test_mode"] is True

    def test_create_invalid_plan(self, client):
        r = client.post(f"{API}/enrollments", json={
            "name": "TEST_X", "email": "x@example.com", "phone": "1234567",
            "schedule": "weekday", "plan": "invalid",
        })
        assert r.status_code == 422

    def test_create_invalid_email(self, client):
        r = client.post(f"{API}/enrollments", json={
            "name": "TEST_X", "email": "not-an-email", "phone": "1234567",
            "schedule": "weekday", "plan": "regular",
        })
        assert r.status_code == 422

    def test_create_missing_fields(self, client):
        r = client.post(f"{API}/enrollments", json={"name": "TEST_X"})
        assert r.status_code == 422

    def test_list_no_objectid(self, client):
        r = client.get(f"{API}/enrollments")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for it in items:
            assert "_id" not in it
            assert "id" in it

    def test_create_then_listed(self, client):
        payload = {
            "name": "TEST_Persistence",
            "email": "test_persist@example.com",
            "phone": "+911234567890",
            "schedule": "weekday",
            "plan": "regular",
        }
        r = client.post(f"{API}/enrollments", json=payload)
        assert r.status_code == 200
        eid = r.json()["enrollment_id"]
        r2 = client.get(f"{API}/enrollments?limit=200")
        assert r2.status_code == 200
        ids = [it["id"] for it in r2.json()]
        assert eid in ids


# ---- Verify ----
class TestVerify:
    def test_verify_bad_signature(self, client):
        # First create
        r = client.post(f"{API}/enrollments", json={
            "name": "TEST_Verify",
            "email": "test_verify@example.com",
            "phone": "+910000000000",
            "schedule": "weekday",
            "plan": "regular",
        })
        eid = r.json()["enrollment_id"]
        r2 = client.post(f"{API}/enrollments/verify", json={
            "enrollment_id": eid,
            "razorpay_order_id": "order_test_xyz",
            "razorpay_payment_id": "pay_test_xyz",
            "razorpay_signature": "deadbeef",
        })
        assert r2.status_code == 400
        assert "Invalid" in r2.json().get("detail", "")

    def test_verify_unknown_enrollment(self, client):
        r = client.post(f"{API}/enrollments/verify", json={
            "enrollment_id": "nonexistent-id-xxx",
            "razorpay_order_id": "o", "razorpay_payment_id": "p", "razorpay_signature": "s",
        })
        assert r.status_code == 404


# ---- Leads ----
class TestLeads:
    def test_create_lead(self, client):
        r = client.post(f"{API}/leads", json={
            "name": "TEST_Lead",
            "email": "test_lead@example.com",
            "phone": "+910000000001",
            "source": "website",
            "message": "Interested",
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["status"] == "ok"
        assert isinstance(d["lead_id"], str)

    def test_lead_invalid_email(self, client):
        r = client.post(f"{API}/leads", json={"name": "TEST_X", "email": "bad"})
        assert r.status_code == 422
