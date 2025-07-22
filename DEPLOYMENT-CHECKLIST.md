# Git Push and Deployment Checklist

## Files Added/Modified for Vercel Deployment:

### New Files:
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `api/membership-applications.ts` - Serverless function for form submissions
- ✅ `api/next-reference-number.ts` - Serverless function for reference numbers
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `README-VERCEL-DEPLOYMENT.md` - Complete deployment guide
- ✅ `DEPLOYMENT-CHECKLIST.md` - This checklist

### Modified Files:
- ✅ `client/src/App.tsx` - Added TanStack Query provider
- ✅ `client/src/pages/Membership.tsx` - Added API integration and sequential reference numbers
- ✅ `server/routes.ts` - Added membership application API endpoints
- ✅ `server/storage.ts` - Added DatabaseStorage with membership application methods
- ✅ `shared/schema.ts` - Added membership applications database schema
- ✅ `replit.md` - Updated with deployment configuration and recent changes

## Git Commands to Push Changes:

```bash
# 1. Add all changes
git add .

# 2. Commit with descriptive message
git commit -m "feat: Add Vercel deployment config and sequential reference numbers

- Set up PostgreSQL database with membership applications table
- Implemented sequential reference number system (LRCT/Adm/001, etc.)
- Added TanStack Query for API state management
- Created Vercel serverless functions for deployment
- Updated membership form with real-time reference numbers
- Added comprehensive deployment guide"

# 3. Push to your main branch (replace 'main' with your default branch if different)
git push origin main
```

## After Pushing to GitHub:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import Project**: Click "New Project" and select your GitHub repository
3. **Configure Environment Variables** (in Vercel project settings):
   - `DATABASE_URL`
   - `PGHOST`
   - `PGDATABASE` 
   - `PGUSER`
   - `PGPASSWORD`
   - `PGPORT`
4. **Deploy**: Click deploy button

## Verification Steps:

After deployment, test these features:
- [ ] Membership form loads with reference number
- [ ] Form submission works and increments reference numbers
- [ ] PDF download includes correct reference number
- [ ] ODF download includes correct reference number
- [ ] All static pages load correctly

## Notes:

- The sequential reference number system requires a PostgreSQL database
- Reference numbers start at LRCT/Adm/001 and increment automatically
- All form data is stored in the database with proper validation
- Club logo appears in top-left corner of PDF/ODF downloads