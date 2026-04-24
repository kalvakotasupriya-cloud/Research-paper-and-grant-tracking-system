# Production Deployment Checklist

## Backend (Render)
- [ ] render.yaml committed and pushed
- [ ] Railway/PlanetScale MySQL created and schema imported
- [ ] All environment variables set in Render dashboard
- [ ] /api/health returns { status: "OK", database: "connected" }
- [ ] CORS FRONTEND_URL set to Vercel URL
- [ ] JWT_SECRET is a strong random string (not "secret")
- [ ] SESSION_SECRET is a strong random string

## Frontend (Vercel)
- [ ] VITE_API_BASE_URL set to Render backend URL in Vercel env vars
- [ ] vercel.json has rewrites for React Router
- [ ] npm run build passes locally before pushing
- [ ] Login and register work end-to-end
- [ ] Role redirect works after login
- [ ] Charts load on admin dashboard
- [ ] No hardcoded localhost URLs anywhere in src/

## Final Tests After Both Are Live
- [ ] Register new researcher account
- [ ] Login as admin (admin@research.com / password123)
- [ ] Submit a paper as researcher
- [ ] Approve paper as admin
- [ ] Apply for grant as researcher
- [ ] Approve grant as admin
- [ ] Record fund utilization
- [ ] Submit progress report
- [ ] View admin dashboard charts
- [ ] Test on mobile (responsive check)
- [ ] Share /api/health URL to confirm backend live

## Live URLs (fill in after deploy)
- Frontend: https://_________________________.vercel.app
- Backend:  https://_________________________.onrender.com
- Health:   https://_________________________.onrender.com/api/health
