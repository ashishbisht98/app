# Razorpay Test Flow - Setup & Debugging Guide

## Quick Start

### Step 1: Get Razorpay Test Keys
1. Go to https://dashboard.razorpay.com/app/keys
2. Toggle to **Test Mode** (in top-left)
3. Copy your **Key ID** (starts with `rzp_test_`)
4. Copy your **Key Secret**

### Step 2: Set Environment Variables in Vercel

**Backend (Python):**
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_key_secret
REGISTRATION_FEE_PAISE=10000
CORS_ORIGINS=https://orchitek.com,https://www.orchitek.com
FIREBASE_PROJECT_ID=orchitek-b1379
FIREBASE_CREDENTIALS_PATH=/app/backend/firebase-admin.json
```

**Frontend (React):**
```
REACT_APP_BACKEND_URL=https://your-backend-url.vercel.app/api
```

> **Important:** The backend URL in `REACT_APP_BACKEND_URL` must be the actual Vercel backend URL, not `localhost`

### Step 3: Verify Configuration

1. **Check backend debug endpoint:**
   ```bash
   curl https://your-backend-url.vercel.app/api/debug/config
   ```
   
   Look for:
   - `"razorpay_mode": "TEST"` or `"razorpay_mode": "LIVE"`
   - `"razorpay_client_ready": true`
   - `"registration_fee_paise": 10000`

2. **Check health endpoint:**
   ```bash
   curl https://your-backend-url.vercel.app/api/health
   ```
   
   Should show:
   - `"firestore_ok": true`
   - `"razorpay_configured": true` (if NOT in test mode)

---

## Testing the Flow

### In Test Mode (Development)

When Razorpay is in TEST mode:
- **No order is created** with Razorpay
- Enrollment is saved to Firestore
- Frontend shows: "✓ Test mode: Details saved..."
- User details are stored; no payment is attempted

### For Live Testing

Once you're ready to test actual payments:

1. **Upgrade keys to LIVE** in Razorpay
   - Go to https://dashboard.razorpay.com/app/keys
   - Create a Live Key (disabled by default for security)

2. **Update Vercel environment variables:**
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_key_secret
   ```

3. **Test with test card numbers:**
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits

---

## Troubleshooting

### Issue: "Something went wrong"

**Check browser console (F12):**
- Open DevTools → Console tab
- Fill out the enrollment form
- Look for logs starting with `[Razorpay]`

**Common issues:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read property 'post' of undefined` | `REACT_APP_BACKEND_URL` not set | Set `REACT_APP_BACKEND_URL` in Vercel |
| `POST .../enrollments 404` | Wrong backend URL | Verify backend URL in Vercel env vars |
| `POST .../enrollments 502` | Razorpay authentication failed | Check Razorpay API keys in backend |
| `razorpay_mode: "TEST"` | Using test keys | Expected in dev; use live keys for production |
| `razorpay_client_ready: false` | Client not initialized | Check Razorpay key format (should start with `rzp_`) |

### Issue: Razorpay SDK not loading

1. Check if Razorpay script is in `public/index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

2. Verify script loaded in DevTools:
   - Open DevTools → Network tab
   - Search for "checkout.razorpay"
   - Should return 200 (success)

### Issue: CORS errors

**In browser console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
1. Update `CORS_ORIGINS` in backend Vercel env vars
2. Include both variants of your domain:
   ```
   https://orchitek.com,https://www.orchitek.com
   ```

---

## Environment Variables Checklist

### Backend (Vercel)

- [ ] `RAZORPAY_KEY_ID` - Starts with `rzp_test_` or `rzp_live_`
- [ ] `RAZORPAY_KEY_SECRET` - 20+ character string
- [ ] `REGISTRATION_FEE_PAISE` - Set to `10000` (₹100)
- [ ] `CORS_ORIGINS` - Includes your domain
- [ ] `FIREBASE_PROJECT_ID` - Set to `orchitek-b1379`
- [ ] `FIREBASE_CREDENTIALS_PATH` - Set to `/app/backend/firebase-admin.json`

### Frontend (Vercel)

- [ ] `REACT_APP_BACKEND_URL` - Full backend URL with `/api` (e.g., `https://backend-xyz.vercel.app/api`)

---

## Test Workflow

1. **Local Testing:**
   ```bash
   cd backend
   python server.py
   ```
   - Visit `http://localhost:3000`
   - Test payments should work with test Razorpay keys

2. **Vercel Preview:**
   - Push to a branch and create a PR
   - Vercel creates a preview URL
   - Test with that URL

3. **Production:**
   - Merge to main
   - Vercel deploys to https://orchitek.com
   - Switch to live Razorpay keys
   - Test with real payments

---

## Razorpay Test Cards

Use these for testing in TEST mode:

| Scenario | Card | Expiry | CVV |
|----------|------|--------|-----|
| Success | 4111 1111 1111 1111 | Any future | Any 3 digits |
| 3D Secure | 5105 1051 0510 5100 | Any future | Any 3 digits |
| Failure | 4000 0000 0000 0002 | Any future | Any 3 digits |

---

## API Endpoints

### Create Enrollment (with Razorpay order)
```
POST /api/enrollments
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "plan": "regular",
  "schedule": "weekday",
  "message": "Optional message"
}

Response:
{
  "enrollment_id": "uuid",
  "order_id": "order_xxxxxx",  // null in TEST mode
  "key_id": "rzp_test_xxx",
  "amount": 10000,
  "currency": "INR",
  "test_mode": true,
  "course_fee": 5999
}
```

### Debug Config
```
GET /api/debug/config

Response:
{
  "razorpay_mode": "TEST",
  "razorpay_key_id_prefix": "rzp_test_xxx***",
  "razorpay_client_ready": false,
  "registration_fee_paise": 10000,
  "cors_origins": "*",
  "firebase_project": "orchitek-b1379",
  "environment": "test/development"
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "healthy",
  "firestore_ok": true,
  "razorpay_mode": "TEST",
  "razorpay_configured": false,
  "razorpay_client_ready": false
}
```

---

## Next Steps

1. ✅ Set Razorpay test keys in Vercel backend env vars
2. ✅ Set `REACT_APP_BACKEND_URL` in Vercel frontend env vars
3. ✅ Verify `/api/debug/config` endpoint
4. ✅ Test enrollment form on deployed site
5. ✅ Check browser console for `[Razorpay]` logs
6. ✅ Once working, switch to live keys

For more details, see [Razorpay Docs](https://razorpay.com/docs/payments/payments-integration).
