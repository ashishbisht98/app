# Razorpay Integration Setup Checklist

## Phase 1: Get Credentials ✅

### Razorpay Account
- [ ] Sign up at https://razorpay.com
- [ ] Complete account setup
- [ ] Go to https://dashboard.razorpay.com/app/keys
- [ ] Make sure you're viewing **LIVE** keys (toggle at top)
- [ ] Copy Key ID (example: `rzp_live_XXXXXXXXXXXXX`)
- [ ] Copy Key Secret
- [ ] Store these securely (will use in Vercel)

### Firebase Account
- [ ] Go to https://console.firebase.google.com
- [ ] Select your project
- [ ] Note Project ID
- [ ] Create service account with admin access
- [ ] Download credentials JSON file

---

## Phase 2: Local Testing ✅

### Backend Setup
- [ ] Open terminal, navigate to `backend/`
- [ ] Copy: `cp .env.example .env`
- [ ] Edit `.env` file:
  ```
  RAZORPAY_KEY_ID=rzp_live_XXXXX
  RAZORPAY_KEY_SECRET=your_secret
  FIREBASE_PROJECT_ID=your-project-id
  FIREBASE_CREDENTIALS_PATH=./firebase-admin.json
  CORS_ORIGINS=http://localhost:3000
  ```
- [ ] Save the file
- [ ] Start backend: `python -m uvicorn server:app --reload`
- [ ] Verify logs show: `✓ App initialized - Razorpay mode: LIVE`

### Verify Backend Health
- [ ] Open browser to: `http://localhost:8000/api/health`
- [ ] Confirm response shows:
  ```json
  "razorpay_mode": "LIVE",
  "razorpay_configured": true,
  "razorpay_client_ready": true
  ```

### Frontend Setup
- [ ] Open new terminal, navigate to `frontend/`
- [ ] Copy: `cp .env.example .env.local`
- [ ] Edit `.env.local`:
  ```
  REACT_APP_BACKEND_URL=http://localhost:8000/api
  ```
- [ ] Save the file
- [ ] Start frontend: `npm start`
- [ ] Verify it loads without errors

### Test Enrollment Flow
- [ ] Click "Enroll Now" button
- [ ] Fill in form details
- [ ] Click "Pay ₹100"
- [ ] Verify Razorpay modal opens
- [ ] Use test card: `4111 1111 1111 1111`
- [ ] Use any future expiry (e.g., 12/25)
- [ ] Use any 3-digit CVV (e.g., 123)
- [ ] Verify payment processes
- [ ] Verify success page appears
- [ ] Check Firebase for new enrollment record

---

## Phase 3: Deploy Backend to Vercel ✅

### Create Backend Project
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import backend repository
- [ ] Set Project Name (e.g., `orchitek-api`)
- [ ] Select root directory (if asked): `backend/`
- [ ] Click "Deploy"
- [ ] Wait for initial deployment

### Set Backend Environment Variables
- [ ] Go to **Settings** tab → **Environment Variables**
- [ ] Add each variable (one by one):
  
  | Name | Value |
  |------|-------|
  | `RAZORPAY_KEY_ID` | `rzp_live_XXXXX...` |
  | `RAZORPAY_KEY_SECRET` | Your Razorpay secret |
  | `FIREBASE_PROJECT_ID` | Your Firebase project ID |
  | `FIREBASE_CREDENTIALS_PATH` | `./firebase-admin.json` |
  | `CORS_ORIGINS` | (leave blank for now, will update) |
  | `REGISTRATION_FEE_PAISE` | `10000` |

- [ ] After adding each variable, click "Save"

### Redeploy Backend
- [ ] Go to **Deployments** tab
- [ ] Click "..." on latest deployment
- [ ] Select "Redeploy"
- [ ] Wait for deployment to complete

### Verify Backend Deployment
- [ ] Copy your backend URL (e.g., `https://orchitek-api.vercel.app`)
- [ ] Open: `https://orchitek-api.vercel.app/api/health`
- [ ] Confirm response shows:
  ```json
  "razorpay_mode": "LIVE",
  "razorpay_configured": true,
  "razorpay_client_ready": true
  ```
- [ ] Note down this URL for next step

---

## Phase 4: Deploy Frontend to Vercel ✅

### Create Frontend Project
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Import frontend repository
- [ ] Set Project Name (e.g., `orchitek-web`)
- [ ] Select root directory (if asked): `frontend/`
- [ ] Click "Deploy"
- [ ] Wait for initial deployment

### Set Frontend Environment Variables
- [ ] Go to **Settings** tab → **Environment Variables**
- [ ] Add variable:
  - Name: `REACT_APP_BACKEND_URL`
  - Value: `https://your-backend-url.vercel.app/api`
  - (Replace `your-backend-url` with actual URL from Phase 3)
- [ ] Click "Save"

### Redeploy Frontend
- [ ] Go to **Deployments** tab
- [ ] Click "..." on latest deployment
- [ ] Select "Redeploy"
- [ ] Wait for deployment to complete

---

## Phase 5: Update Backend CORS ✅

### Get Frontend URL
- [ ] Copy your frontend URL from Vercel (e.g., `https://orchitek-web.vercel.app`)

### Update CORS_ORIGINS
- [ ] Go to backend project → **Settings** → **Environment Variables**
- [ ] Find `CORS_ORIGINS` variable
- [ ] Edit it: Set Value to your frontend URL
- [ ] Click "Save"

### Redeploy Backend Again
- [ ] Go to **Deployments** tab
- [ ] Click "..." on latest deployment
- [ ] Select "Redeploy"
- [ ] Wait for deployment to complete

---

## Phase 6: Verify End-to-End Integration ✅

### Health Checks
- [ ] Backend health: `https://your-backend.vercel.app/api/health`
- [ ] Should show: `"razorpay_mode": "LIVE"`
- [ ] Note: Changes take ~1-2 minutes after redeploy

### Browser DevTools Check
- [ ] Open your frontend URL
- [ ] Open DevTools → Network tab
- [ ] Click "Enroll Now"
- [ ] Fill form and submit
- [ ] Look for POST request to `/api/enrollments`
- [ ] Verify it goes to your backend URL (not error)

### Payment Flow Test
- [ ] Fill enrollment form completely
- [ ] Click "Pay ₹100" button
- [ ] Verify Razorpay modal opens
  - ✅ Should show your business name
  - ❌ Should NOT show "Test Mode" UI
- [ ] Use test card:
  - Card: `4111 1111 1111 1111`
  - Expiry: `12/25` (or any future date)
  - CVV: `123` (or any 3 digits)
- [ ] Click Pay
- [ ] Verify success screen appears
- [ ] Check Firebase → Enrollments for new record

### Verify Data
- [ ] Open Firebase Console
- [ ] Check Collections → `enrollments`
- [ ] Verify new enrollment record exists
- [ ] Confirm fields are populated correctly

---

## Phase 7: Monitor & Maintain ✅

### Daily Checks
- [ ] Check Vercel deployment logs for errors
- [ ] Monitor Razorpay dashboard for transactions
- [ ] Check Firebase for data integrity

### Weekly Checks
- [ ] Test payment flow end-to-end
- [ ] Verify environment variables haven't been accidentally changed
- [ ] Check Vercel logs for any warnings

### Monthly Checks
- [ ] Review all transactions in Razorpay
- [ ] Rotate API keys if necessary
- [ ] Update CORS_ORIGINS if adding new domains

---

## Troubleshooting

### ❌ Backend shows "razorpay_mode": "TEST"
- [ ] Check Vercel environment variables are correct
- [ ] Confirm there are no typos in variable names
- [ ] Redeploy after setting variables
- [ ] Wait 2-3 minutes for changes to take effect
- [ ] Check logs for `❌ Razorpay client initialization failed`

### ❌ API calls return 404
- [ ] Verify `REACT_APP_BACKEND_URL` is set correctly
- [ ] Confirm backend URL includes `/api` at end
- [ ] Redeploy frontend after setting variable
- [ ] Check Network tab in DevTools for actual URL being called

### ❌ CORS error in browser console
- [ ] Verify frontend URL is in backend's `CORS_ORIGINS`
- [ ] Remove any trailing slashes from URL
- [ ] Redeploy backend after updating CORS_ORIGINS

### ❌ Razorpay modal doesn't open
- [ ] Check browser console for JavaScript errors
- [ ] Verify Razorpay CDN is accessible (check Network tab)
- [ ] Confirm backend returned valid `key_id` in response
- [ ] Check Razorpay keys are valid (not placeholders)

### ❌ Payment fails
- [ ] Check backend logs for Razorpay errors
- [ ] Verify Razorpay account is in good standing
- [ ] Confirm keys are LIVE mode (not TEST)
- [ ] Check Razorpay dashboard for API errors

---

## Success Criteria ✅

Your integration is working when:

- [x] Backend health shows `razorpay_mode: "LIVE"`
- [x] Frontend loads without CORS errors
- [x] API calls go to correct backend
- [x] Razorpay checkout modal opens (no errors)
- [x] Payment can be completed
- [x] Success page appears after payment
- [x] Data is saved to Firebase
- [x] No errors in Vercel logs

---

## References

- [VERCEL_SETUP_GUIDE.md](./VERCEL_SETUP_GUIDE.md) - Detailed setup guide
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - What code changed
- [RAZORPAY_ENV_ISSUES.md](./RAZORPAY_ENV_ISSUES.md) - Issue analysis
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick reference

---

## Support

If stuck:
1. Check the troubleshooting section above
2. Review the relevant documentation file
3. Check Vercel deployment logs
4. Search error message in Razorpay docs
