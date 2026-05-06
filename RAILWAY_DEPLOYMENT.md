# Railway Deployment Guide

## Quick Start (5 minutes)

### 1. Sign up at Railway
- Go to [railway.app](https://railway.app)
- Sign in with GitHub
- Create a new project

### 2. Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repo: `ashishbisht98/app`
4. Railway will auto-detect the Dockerfile

### 3. Set Environment Variables
In Railway project dashboard, go to Variables and set:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
REGISTRATION_FEE_PAISE=10000
CORS_ORIGINS=*
```

### 4. Configure Domain
1. Go to Settings > Domains
2. Add your custom domain: `orchitek.com`
3. Update your DNS provider to point to Railway's domain

### 5. Deploy
Railway will automatically:
- Build Docker image
- Build React frontend
- Start services
- Serve on port 3000

## Deployment Status
- Railway will build in ~3-5 minutes
- Check logs in the Railway dashboard
- Your app is live when status is "Success"

## How It Works
```
User Request → nginx (port 3000)
    ↓
/api/* routes → FastAPI backend (port 8000)
/ routes → React app (static files)
```

## Local Testing
```bash
docker-compose up
```
Visit `http://localhost:3000`

## Troubleshooting
- Check logs: Railway dashboard → Deploy logs
- Backend logs: Railway dashboard → Logs tab
- Build failed? Check `.dockerignore` and `Dockerfile`

## Database
- Firestore is configured via environment variable
- Works automatically with the credentials you provide
