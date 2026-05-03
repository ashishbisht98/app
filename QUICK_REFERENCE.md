# Quick Reference - Razorpay Integration Fix

## What Was Fixed ✅

| Issue | Status | Solution |
|-------|--------|----------|
| Env vars loaded at module init | ❌ BROKEN | ✅ Load at app startup |
| Silent failures in test mode | ❌ BROKEN | ✅ Explicit logging |
| No startup validation | ❌ BROKEN | ✅ Validation on startup |
| Frontend URL not configured | ❌ BROKEN | ✅ Added guidance |
| Ambiguous mode detection | ❌ BROKEN | ✅ `RAZORPAY_MODE` variable |

---

## 5-Minute Setup for Vercel

### 1. Backend (Vercel Settings → Environment Variables)
```
RAZORPAY_KEY_ID = rzp_live_XXXXX...
RAZORPAY_KEY_SECRET = your_secret
FIREBASE_PROJECT_ID = your-id
CORS_ORIGINS = https://your-frontend.vercel.app
```
Then: **Redeploy**

### 2. Frontend (Vercel Settings → Environment Variables)
```
REACT_APP_BACKEND_URL = https://your-backend.vercel.app/api
```
Then: **Redeploy**

### 3. Verify
```bash
curl https://your-backend.vercel.app/api/health
# Look for: "razorpay_mode": "LIVE"
```

---

## Local Development

```bash
# 1. Backend
cd backend
cp .env.example .env
# Edit .env with your credentials

# 2. Frontend
cd frontend
cp .env.example .env.local
# Set REACT_APP_BACKEND_URL = http://localhost:8000/api

# 3. Run
# Terminal 1: python -m uvicorn server:app --reload
# Terminal 2: npm start
```

---

## Health Check

```bash
# Returns current configuration status
curl https://your-api.vercel.app/api/health

# Expected response:
{
  "razorpay_mode": "LIVE",           # ← Look for this
  "razorpay_configured": true,
  "razorpay_client_ready": true
}
```

---

## Files to Review

1. **[VERCEL_SETUP_GUIDE.md](./VERCEL_SETUP_GUIDE.md)** ← Start here
2. [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - What changed
3. [RAZORPAY_ENV_ISSUES.md](./RAZORPAY_ENV_ISSUES.md) - Root cause analysis

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "razorpay_mode": "TEST" | Env vars not set. Check Vercel settings. |
| CORS error | Add frontend URL to `CORS_ORIGINS` |
| API not found | Set `REACT_APP_BACKEND_URL` and redeploy frontend |
| 404 on `/api/` | Incorrect backend URL in frontend config |

---

## Code Changes Made

✅ `backend/server.py`
  - Moved env var loading to startup event
  - Added `initialize_razorpay()` function
  - Updated health endpoint
  - Added startup logging

✅ `backend/.env.example` - Created
✅ `frontend/.env.example` - Created
✅ `VERCEL_SETUP_GUIDE.md` - Created
✅ `RAZORPAY_ENV_ISSUES.md` - Created
✅ `CHANGES_SUMMARY.md` - Created

---

## Get Razorpay Live Keys

1. Go to: https://dashboard.razorpay.com/app/keys
2. Click **LIVE** button (top right)
3. Copy Key ID (example: `rzp_live_XXXXXXXXXXXXX`)
4. Copy Key Secret
5. Add to Vercel environment variables
6. Redeploy

---

## Test Payment

After deployment:
1. Visit your frontend
2. Click "Enroll Now"
3. Fill form → Submit
4. Razorpay modal appears
5. Use card: `4111 1111 1111 1111`
6. Any expiry date, any CVV
7. Payment completes → Success screen

---

## Success Indicators ✓

- [ ] Backend health check shows `razorpay_mode: "LIVE"`
- [ ] Frontend loads without errors
- [ ] API calls go to correct backend URL
- [ ] Razorpay checkout modal opens
- [ ] Payment can be completed
- [ ] Success confirmation appears

---

## Common Mistakes ❌

1. ❌ Setting env vars but not redeploying
2. ❌ Using test keys when live keys available
3. ❌ Typos in env var names
4. ❌ Forgetting `/api` suffix in frontend URL
5. ❌ Not updating CORS_ORIGINS for new frontend domain

---

## Questions?

1. Check Vercel deployment logs
2. Run health endpoint check
3. Review VERCEL_SETUP_GUIDE.md
4. Check RAZORPAY_ENV_ISSUES.md for detailed analysis
