# Razorpay Integration Issues - Environment Variables Analysis

## Summary
The Razorpay integration has environment variable loading issues that prevent it from working properly when deployed to Vercel. The problem is that environment variables are loaded **once at module initialization time** in the backend, but the keys aren't being read correctly in the serverless environment.

---

## Issues Found

### 🔴 **CRITICAL ISSUE #1: Backend Environment Variables Loaded at Module Load Time**

**Location**: [backend/server.py](backend/server.py#L44-L50)

```python
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_secret')

razorpay_client = None
try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    logging.warning(f"Razorpay client init failed: {e}")
```

**Problem**: 
- These variables are read **once** when Python loads the module
- In Vercel's serverless environment, environment variables from the project settings may not be available at cold start
- If the variables fail to load, the `razorpay_client` stays `None` and a warning is just logged
- The app silently falls back to test mode without alerting you

**Why it's broken on Vercel**:
- Vercel environment variables are injected into the serverless function's environment
- But if the module loads before these are available, or if there's a timing issue, the placeholder values are used
- Once the module is loaded, it's not reloaded for subsequent requests, so the placeholder values persist

**Solution**:
- Move env var loading into a function that's called at request time OR at app startup in an explicit initialization function
- Add explicit validation that the keys are NOT placeholders when NOT in test mode

---

### 🔴 **CRITICAL ISSUE #2: Frontend Backend URL Not Set**

**Location**: [frontend/src/components/landing/EnrollmentDialog.jsx](frontend/src/components/landing/EnrollmentDialog.jsx#L22)

```javascript
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
```

**Problem**:
- This environment variable must be available **at build time** (when `npm run build` is executed)
- Frontend builds are static, so `process.env.REACT_APP_BACKEND_URL` is interpolated during build
- If `REACT_APP_BACKEND_URL` is not set during build, it will be `undefined/api` or empty
- The frontend won't know where to send the enrollment request

**Why it's broken on Vercel**:
- Vercel environment variables set in the project UI are available during deployment
- BUT: You need to ensure `REACT_APP_BACKEND_URL` is explicitly set in Vercel's environment for the frontend build
- If not set, the API calls will fail with CORS or 404 errors

**Solution**:
- Ensure `REACT_APP_BACKEND_URL` is set in Vercel project environment variables
- It should point to your backend URL (e.g., `https://your-backend.vercel.app`)

---

### 🟡 **ISSUE #3: Silent Failure - No Error Logging When Razorpay Client Init Fails**

**Location**: [backend/server.py](backend/server.py#L47-L51)

```python
razorpay_client = None
try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    logging.warning(f"Razorpay client init failed: {e}")
```

**Problem**:
- If the Razorpay client fails to initialize, only a warning is logged
- The app continues as if nothing happened, defaulting to test mode
- You won't know if the real keys were loaded successfully or if it's just using placeholders

**Solution**:
- Add explicit logging to show which mode is active
- Validate that keys are not placeholders in production environments

---

### 🟡 **ISSUE #4: Missing Key Validation at Startup**

**Location**: [backend/server.py](backend/server.py#L112-113)

```python
def is_test_mode() -> bool:
    return RAZORPAY_KEY_ID == "rzp_test_placeholder" or RAZORPAY_KEY_SECRET == "placeholder_secret"
```

**Problem**:
- There's no explicit check or warning if the app starts in test mode when it shouldn't
- If a user is on production but keys aren't loaded, they're silently in test mode
- No way to know if this is intentional or a configuration error

**Solution**:
- Add explicit validation at app startup
- Log clearly which mode is active
- Optionally raise an error if test mode is detected in production

---

### 🟡 **ISSUE #5: Frontend Razorpay SDK Dependency Not Explicit**

**Location**: [frontend/public/index.html](frontend/public/index.html)

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

**Problem**:
- The Razorpay SDK is loaded from a CDN
- If the CDN is slow or fails, the checkout fails
- No fallback mechanism

**Note**: This is less critical but worth noting.

---

## How Environment Variables Flow

### ✅ **Correct Flow (Expected)**
```
1. Vercel deploys backend
   └─ Env vars (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) injected
   └─ Python module loads → reads env vars ✓
   └─ Razorpay client initialized with real keys ✓

2. Vercel deploys frontend
   └─ Env var (REACT_APP_BACKEND_URL) injected at build time
   └─ npm run build → interpolates REACT_APP_BACKEND_URL ✓
   └─ Frontend knows where to send API calls ✓

3. User enrolls
   └─ Frontend sends POST to API/enrollments
   └─ Backend creates Razorpay order with real keys ✓
   └─ Frontend opens Razorpay checkout with real key_id ✓
   └─ Payment succeeds ✓
```

### ❌ **Actual Flow (Current Issue)**
```
1. Backend module loads
   └─ If RAZORPAY_KEY_ID/SECRET not available → uses 'rzp_test_placeholder'/'placeholder_secret' 
   └─ Razorpay client init fails (invalid keys) → razorpay_client = None
   └─ is_test_mode() returns True

2. Frontend build happens
   └─ If REACT_APP_BACKEND_URL not set → API = 'undefined/api'
   └─ or API calls go to wrong URL

3. User tries to enroll
   └─ Request goes to wrong backend or returns test mode
   └─ Razorpay checkout never opens or opens with test key
   └─ Payment fails or doesn't process
```

---

## Vercel Configuration Checklist

### Backend Environment Variables (Python - Vercel Settings)
- [ ] `RAZORPAY_KEY_ID` - Set to your live Razorpay Key ID (starts with `rzp_live_`)
- [ ] `RAZORPAY_KEY_SECRET` - Set to your live Razorpay Secret
- [ ] `FIREBASE_PROJECT_ID` - Set to your Firebase project ID
- [ ] `FIREBASE_CREDENTIALS_PATH` - Path to Firebase credentials file (or use inline)
- [ ] `REGISTRATION_FEE_PAISE` - Optional, defaults to 10000 (₹100)
- [ ] `CORS_ORIGINS` - Set to your frontend URL(s)

### Frontend Environment Variables (React - Vercel Settings)
- [ ] `REACT_APP_BACKEND_URL` - Set to your backend URL (e.g., `https://your-api.vercel.app`)

---

## Recommended Fixes

### Fix #1: Add Explicit Initialization Function (Backend)

```python
def initialize_razorpay():
    global razorpay_client
    key_id = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_placeholder')
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_secret')
    
    logger.info(f"Initializing Razorpay - Mode: {'TEST' if is_test_mode() else 'LIVE'}")
    
    if key_id == "rzp_test_placeholder" or key_secret == "placeholder_secret":
        logger.warning("⚠️  Razorpay running in TEST mode - keys not properly configured")
        razorpay_client = None
        return
    
    try:
        razorpay_client = razorpay.Client(auth=(key_id, key_secret))
        logger.info("✓ Razorpay client initialized with live keys")
    except Exception as e:
        logger.error(f"❌ Razorpay initialization failed: {e}")
        razorpay_client = None

# Call at app startup
@app.on_event("startup")
async def startup():
    initialize_razorpay()
```

### Fix #2: Add Health Check Endpoint Validation

```python
@api_router.get("/health")
async def health():
    mode = "TEST" if is_test_mode() else "LIVE"
    return {
        "status": "healthy",
        "razorpay_mode": mode,
        "razorpay_client_ready": razorpay_client is not None,
    }
```

### Fix #3: Ensure Frontend Env Var in Vercel

In Vercel project settings:
```
Name: REACT_APP_BACKEND_URL
Value: https://your-backend-url.vercel.app
```

---

## Testing Checklist

1. **Backend Health Check**
   ```bash
   curl https://your-backend.vercel.app/api/health
   # Should show: "razorpay_mode": "LIVE" (not "TEST")
   ```

2. **Frontend Connection**
   - Open DevTools Console → Network tab
   - Click "Enroll Now"
   - Check that API calls go to the correct backend URL
   - Verify no CORS errors

3. **Razorpay Integration**
   - Submit enrollment form
   - Verify Razorpay checkout modal opens
   - Verify it shows your business name (not test mode UI)

---

## Summary of Root Causes

| Issue | Root Cause | Impact | Fix |
|-------|-----------|--------|-----|
| Env vars loaded at module init | Python loads module once at cold start | Keys not available → test mode | Move to startup function |
| Frontend URL not set | Build-time variable injection | API calls fail | Set `REACT_APP_BACKEND_URL` in Vercel |
| Silent failures | No logging/validation | Hard to debug | Add explicit health checks |
| No startup validation | Missing initialization handler | Can't verify config at deploy time | Add startup event handler |

