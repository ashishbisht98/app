# Vercel Deployment Guide

## Current Setup
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Vercel at `https://app-nine-lake-80.vercel.app/api`

## Frontend Configuration

### Step 1: Set Environment Variables in Vercel Dashboard
Go to your Vercel project settings → Environment Variables and set:

```
REACT_APP_BACKEND_URL=https://app-nine-lake-80.vercel.app/api
```

### Step 2: Verify .env Files
✅ `.env.local` - For local development (localhost:8000)
✅ `.env.production` - For production (created with Vercel backend URL)

### Step 3: Deploy Frontend
```bash
# Vercel will auto-deploy on git push, or manually:
vercel deploy --prod
```

---

## Backend Configuration

### Step 1: Update Environment Variables in Vercel Backend Project Settings

Go to your backend Vercel project → Settings → Environment Variables

**Add these variables:**

```
RAZORPAY_KEY_ID=rzp_test_Skr6LuqBdGs8We
RAZORPAY_KEY_SECRET=NCR6BFKHBmlv2TVnehuLDlKJ
REGISTRATION_FEE_PAISE=10000
FIREBASE_PROJECT_ID=orchitek-b1379
CORS_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```

### Step 2: Firebase Credentials Setup (IMPORTANT)

**Option A: Upload Firebase JSON (Recommended for Production)**
1. Get your `firebase-admin.json` file from Firebase Console
2. Set it as a Vercel environment variable (raw JSON):
   - Go to Settings → Environment Variables
   - Add a new variable `FIREBASE_CREDENTIALS_JSON` with the full JSON content
   - Update backend/server.py to load from this variable (see below)

**Option B: Use Mock Database (Current Setup)**
- Currently configured to use in-memory mock database when credentials aren't found
- This works fine for testing but won't persist data

### Step 3: Update Backend for Environment Variables

Add this to your `server.py` after the Firebase section (around line 20-40):

```python
import json

# Handle Firebase credentials from Vercel environment
if 'FIREBASE_CREDENTIALS_JSON' in os.environ:
    try:
        cred_data = json.loads(os.environ['FIREBASE_CREDENTIALS_JSON'])
        with open('/tmp/firebase-admin.json', 'w') as f:
            json.dump(cred_data, f)
        os.environ['FIREBASE_CREDENTIALS_PATH'] = '/tmp/firebase-admin.json'
    except Exception as e:
        logger.warning(f"Could not load Firebase credentials from env: {e}")
```

### Step 4: CORS Configuration

Update the CORS_ORIGINS in Vercel backend environment to include:
```
https://your-frontend-domain.vercel.app
```

Replace `your-frontend-domain` with your actual Vercel frontend domain.

---

## Troubleshooting Checklist

- [ ] Frontend can reach backend (check browser console for CORS errors)
- [ ] Backend is responding to health check: `https://app-nine-lake-80.vercel.app/api/health`
- [ ] Environment variables are set in both Vercel projects
- [ ] Firebase credentials are either uploaded as JSON or mock database is in use
- [ ] CORS_ORIGINS includes your frontend Vercel domain
- [ ] Razorpay keys are correctly set in backend environment

## Testing in Production

1. Open your frontend Vercel URL
2. Click "Enroll Now"
3. Fill in the form and submit
4. You should see the Razorpay payment modal (if keys are live mode)
5. Check browser console for any API errors
6. Check Vercel backend logs for any errors

---

## Local Development vs Production

| Aspect | Local | Vercel |
|--------|-------|--------|
| Frontend URL | http://localhost:3000 | https://your-domain.vercel.app |
| Backend URL | http://localhost:8000 | https://app-nine-lake-80.vercel.app |
| .env file | .env.local | .env.production / Environment Variables |
| Database | Mock (in-memory) | Firebase (if credentials provided) or Mock |
| Razorpay | Test mode | Test mode (change to live for production) |

---

## Important Notes

1. **Firebase Credentials**: The backend currently falls back to a mock in-memory database if Firebase credentials aren't found. This is fine for development but won't persist data.

2. **Razorpay Keys**: The current keys are in TEST mode. To process real payments, update to LIVE mode keys.

3. **CORS**: Make sure to update CORS_ORIGINS with your actual frontend Vercel domain after deployment.

4. **Environment Variables**: Never commit `.env` files to git. Always set them in the Vercel dashboard.
