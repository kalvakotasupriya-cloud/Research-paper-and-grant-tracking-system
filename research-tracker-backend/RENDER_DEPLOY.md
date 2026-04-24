# Deploying Backend to Render

## Steps

### 1. Push latest backend code to GitHub
Make sure research-tracker-backend/ is committed and pushed to main.

### 2. Create Render Web Service
1. Go to https://render.com -> New -> Web Service
2. Connect your GitHub repo
3. Set Root Directory: research-tracker-backend
4. Build Command: npm install
5. Start Command: npm start
6. Instance Type: Free

### 3. Set Environment Variables in Render Dashboard
Add ALL of these in the Environment tab:

| Variable | Value |
|----------|-------|
| PORT | 10000 |
| NODE_ENV | production |
| DB_HOST | (from Railway) |
| DB_USER | (from Railway) |
| DB_PASSWORD | (from Railway) |
| DB_NAME | (from Railway) |
| JWT_SECRET | (generate: openssl rand -base64 32) |
| JWT_EXPIRES_IN | 7d |
| SESSION_SECRET | (generate: openssl rand -base64 32) |
| FRONTEND_URL | https://your-app.vercel.app |

### 4. After Deploy - Test Health Endpoint
Visit: https://your-backend.onrender.com/api/health
Should return:
{
  "status": "OK",
  "database": "connected",
  "environment": "production"
}

### 5. Update Frontend .env on Vercel
In Vercel dashboard -> your project -> Settings -> Environment Variables:
VITE_API_BASE_URL = https://your-backend.onrender.com

Then redeploy frontend on Vercel.
