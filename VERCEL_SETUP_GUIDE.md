# Vercel Deployment Guide - Environment Variables

## Overview
This guide walks you through setting up environment variables in Vercel for your Orchitek project to enable live Razorpay payments.

---

## Step 1: Deploy Backend to Vercel (if not already done)

### Create Backend Project
```bash
cd backend
vercel
# Follow prompts to create new project
```

### Set Backend Environment Variables

Go to **Vercel Dashboard** → **Your Backend Project** → **Settings** → **Environment Variables**

Add the following variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `RAZORPAY_KEY_ID` | `rzp_live_XXXXX...` | From https://dashboard.razorpay.com/app/keys (LIVE key) |
| `RAZORPAY_KEY_SECRET` | `your_secret_key` | From https://dashboard.razorpay.com/app/keys (LIVE secret) |
| `FIREBASE_PROJECT_ID` | `your-project-id` | From Firebase Console |
| `FIREBASE_CREDENTIALS_PATH` | `./firebase-admin.json` | Path to credentials file in repo |
| `REGISTRATION_FEE_PAISE` | `10000` | Optional - defaults to ₹100 |
| `CORS_ORIGINS` | `https://your-frontend.vercel.app` | Your frontend URL |

⚠️ **Important**: After setting environment variables, **redeploy** the backend for changes to take effect:
```bash
vercel --prod
```

---

## Step 2: Deploy Frontend to Vercel

### Create Frontend Project
```bash
cd frontend
vercel
# Follow prompts to create new project
```

### Set Frontend Environment Variables

Go to **Vercel Dashboard** → **Your Frontend Project** → **Settings** → **Environment Variables**

Add the following variable:

| Variable | Value | Notes |
|----------|-------|-------|
| `REACT_APP_BACKEND_URL` | `https://your-backend.vercel.app/api` | Your backend project URL |

**Important Notes:**
- The URL should include `/api` at the end
- This must be set BEFORE build time
- After setting, trigger a redeploy

### Redeploy Frontend
```bash
vercel --prod
```

---

## Step 3: Verify Setup

### Check Backend Health
```bash
curl https://your-backend.vercel.app/api/health
```

Expected response (LIVE mode):
```json
{
  "status": "healthy",
  "razorpay_mode": "LIVE",
  "razorpay_configured": true,
  "razorpay_client_ready": true,
  "registration_fee_inr": 100
}
```

⚠️ If you see `"razorpay_mode": "TEST"`, the environment variables didn't load. Check:
- Variables are correctly set in Vercel
- Backend was redeployed after setting variables
- Keys don't have typos

### Check Frontend Connection
1. Open your frontend in browser
2. Open DevTools → Network tab
3. Click "Enroll Now" button
4. Look for API calls to your backend URL
5. Verify no CORS errors

### Test Payment Flow
1. Complete the enrollment form
2. Verify Razorpay checkout modal opens
3. Check that it shows your business name (not test mode UI)
4. Use Razorpay test card to verify flow (in TEST mode only)

---

## Environment Variables Reference

### Backend Variables

**Razorpay Configuration**
- `RAZORPAY_KEY_ID`: Your Razorpay Key ID
  - TEST: `rzp_test_placeholder` (default)
  - LIVE: Starts with `rzp_live_`
  - Get from: https://dashboard.razorpay.com/app/keys

- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
  - Get from: https://dashboard.razorpay.com/app/keys
  - Keep this secret! Never commit to version control

- `REGISTRATION_FEE_PAISE`: Registration token amount in paise
  - Default: `10000` (₹100)
  - Must be integer

**Firebase Configuration**
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
  - Get from: Firebase Console → Project Settings

- `FIREBASE_CREDENTIALS_PATH`: Path to Firebase service account JSON
  - Default: `./firebase-admin.json`
  - File must be in backend root directory

**CORS Configuration**
- `CORS_ORIGINS`: Comma-separated list of allowed origins
  - Local: `http://localhost:3000`
  - Production: `https://your-frontend.vercel.app`
  - Multiple: `https://domain1.com,https://domain2.com`

### Frontend Variables

**API Configuration**
- `REACT_APP_BACKEND_URL`: Your backend API base URL
  - Must include `/api` suffix
  - Local: `http://localhost:8000/api`
  - Production: `https://your-backend.vercel.app/api`
  - Build-time only (cannot be changed at runtime)

---

## Troubleshooting

### Issue: "Payment SDK failed to load"
- Check `REACT_APP_BACKEND_URL` is correctly set and redeployed
- Verify Razorpay CDN is accessible (not blocked by firewall/proxy)
- Check browser console for errors

### Issue: "Something went wrong. Try again"
- Check backend health endpoint
- Verify `razorpay_mode` is `LIVE` not `TEST`
- Check Razorpay keys don't have typos
- Ensure backend was redeployed after setting env vars

### Issue: CORS errors in console
- Verify `CORS_ORIGINS` includes your frontend domain
- Check domain doesn't have trailing `/`
- Ensure backend was redeployed after setting CORS_ORIGINS

### Issue: "razorpay_mode": "TEST" in health check
- Environment variables not loaded
- Vercel may need to rebuild after env var changes
- Try: Settings → Deployments → Redeploy → Deployment

### Issue: API calls going to wrong URL
- Verify `REACT_APP_BACKEND_URL` is set in frontend Vercel settings
- Check frontend was redeployed after setting the variable
- Look at Network tab to see actual API call URL

---

## Quick Setup Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend env vars set (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, FIREBASE_PROJECT_ID, CORS_ORIGINS)
- [ ] Backend redeployed after setting env vars
- [ ] Backend health check returns `razorpay_mode: "LIVE"`
- [ ] Frontend deployed to Vercel
- [ ] Frontend env var set (REACT_APP_BACKEND_URL)
- [ ] Frontend redeployed after setting env var
- [ ] Frontend can access backend API without CORS errors
- [ ] Razorpay checkout opens with live keys
- [ ] Test payment flow end-to-end

---

## Getting Razorpay Live Keys

1. Go to https://dashboard.razorpay.com/app/keys
2. Make sure you're viewing **LIVE** keys (toggle at top)
3. Copy Key ID (looks like `rzp_live_...`)
4. Copy Key Secret
5. ⚠️ Keep the secret private - never commit it or share it

## Razorpay Test Cards

For testing in TEST mode:
- Card: 4111111111111111
- Expiry: Any future date
- CVV: Any 3 digits

---

## Security Best Practices

1. **Never commit secrets** to version control
   - Use `.env` file locally (add to `.gitignore`)
   - Use Vercel's UI for production secrets

2. **Rotate keys periodically**
   - Razorpay dashboard → Keys → Rotate

3. **Monitor API usage**
   - Check Vercel logs for errors
   - Monitor Razorpay dashboard for suspicious activity

4. **Use separate credentials** for dev/prod
   - Razorpay test keys for development
   - Razorpay live keys for production

---

## Still Having Issues?

1. Check the [detailed issue analysis](../RAZORPAY_ENV_ISSUES.md)
2. Verify using the checklist at the end of this guide
3. Check Vercel deployment logs for errors
4. Check Razorpay dashboard for API errors
