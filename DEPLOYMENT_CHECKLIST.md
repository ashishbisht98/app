# Vercel Deployment Checklist

## ✅ Files Created/Updated

- ✅ `/frontend/.env.production` - Production backend URL configured
- ✅ `/frontend/.env.local` - Local development backend URL (localhost:8000)
- ✅ `/backend/.env` - Local environment variables
- ✅ `/backend/.env.production` - Production environment template
- ✅ `/backend/vercel.json` - Vercel build configuration for Python
- ✅ `/backend/server.py` - Updated to handle Firebase from environment variables

## 🚀 Steps to Deploy to Vercel

### For Frontend (React App)

1. **Set Vercel Environment Variable**
   - Go to Vercel Dashboard → Your Frontend Project
   - Settings → Environment Variables
   - Add: `REACT_APP_BACKEND_URL` = `https://app-nine-lake-80.vercel.app/api`
   - Redeploy

2. **Or just push to git** (if auto-deploy is enabled)
   ```bash
   git add .
   git commit -m "Add production environment config"
   git push
   ```

### For Backend (Python/FastAPI)

1. **Verify Vercel Environment Variables**
   - Go to Vercel Dashboard → Your Backend Project
   - Settings → Environment Variables
   - Make sure these are set:
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`
     - `REGISTRATION_FEE_PAISE`
     - `FIREBASE_PROJECT_ID`
     - `CORS_ORIGINS` (includes your frontend domain)

2. **For Firebase (Optional - for data persistence)**
   - Get your `firebase-admin.json` from Firebase Console
   - Add environment variable in Vercel:
     - Variable Name: `FIREBASE_CREDENTIALS_JSON`
     - Value: (paste the entire JSON content)
   - Or keep using mock database (current setup)

3. **Push backend changes**
   ```bash
   git add backend/
   git commit -m "Add Vercel config and environment handling"
   git push
   ```

## 🧪 Testing After Deployment

### Test Frontend
```bash
# Visit your frontend Vercel URL
https://your-frontend-domain.vercel.app/
```

### Test Backend API
```bash
# Check if backend is running
curl https://app-nine-lake-80.vercel.app/api/health

# Should return:
{
  "status": "healthy",
  "firestore_ok": false,  # OK to be false if using mock
  "razorpay_mode": "TEST",
  "razorpay_configured": false,  # OK for test keys
  "razorpay_client_ready": false,  # OK for test keys
  "registration_fee_inr": 100
}
```

### Test Transaction Flow
1. Open frontend URL
2. Click "Enroll Now"
3. Fill form and submit
4. Should connect to backend and show Razorpay payment modal
5. Check browser console for any errors

## ⚠️ Important Notes

### Current Limitations (Using Mock Database)
- Data is NOT persisted (resets on backend restart)
- Suitable for: Testing, development, staging
- Not suitable for: Production with real transactions

### To Use Real Firebase
1. Download firebase-admin.json from Firebase Console
2. Add as `FIREBASE_CREDENTIALS_JSON` environment variable in Vercel backend
3. Data will be persisted in Firestore

### To Switch to Live Payments
1. Update Razorpay keys to LIVE mode
2. Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel environment
3. Update REGISTRATION_FEE_PAISE if needed

## 🔗 CORS Configuration

Your backend CORS_ORIGINS should include:
```
https://your-frontend-domain.vercel.app,http://localhost:3000
```

Replace `your-frontend-domain` with your actual Vercel frontend domain.

## 🐛 Troubleshooting

### "API endpoints not found" error
- Check CORS_ORIGINS includes your frontend domain
- Verify REACT_APP_BACKEND_URL in frontend environment variables
- Check browser console for CORS errors

### "Something went wrong" error
- Check backend logs in Vercel dashboard
- Verify environment variables are set in backend Vercel project
- Check if Razorpay keys are valid

### Firebase errors
- If using real Firebase: Upload credentials as environment variable
- If using mock: Data won't persist but API calls will work

## 📚 Additional Resources

- Vercel Python Support: https://vercel.com/docs/concepts/runtimes/python
- FastAPI Deployment: https://fastapi.tiangiao.io/deployment/
- Firebase Admin Setup: https://firebase.google.com/docs/admin/setup
