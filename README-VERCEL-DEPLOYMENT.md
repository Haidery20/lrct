# Land Rover Club Tanzania - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Set up a PostgreSQL database (Vercel Postgres, Neon, or other)

## Environment Variables

You'll need to set these environment variables in your Vercel project settings:

### Required Environment Variables:
```
DATABASE_URL=your_postgresql_connection_string
PGHOST=your_db_host
PGDATABASE=your_db_name
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGPORT=5432
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework Preset: Select "Other"
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the required environment variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add PGHOST
   vercel env add PGDATABASE
   vercel env add PGUSER
   vercel env add PGPASSWORD
   vercel env add PGPORT
   ```

## Database Setup

### Using Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Click on "Storage" tab
3. Create a new Postgres database
4. Copy the connection string to your environment variables
5. Run database migration:
   ```bash
   npm run db:push
   ```

### Using External Database (Neon, Railway, etc.)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string
3. Add it to your Vercel environment variables
4. Ensure the database allows connections from Vercel's IP ranges

## Post-Deployment

1. **Test the Application**:
   - Visit your deployment URL
   - Test the membership application form
   - Verify PDF/ODF downloads work
   - Check sequential reference numbers

2. **Database Migration**:
   - If this is the first deployment, run:
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Verify DATABASE_URL is correct
   - Check if database allows external connections
   - Ensure all environment variables are set

2. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure TypeScript compilation succeeds

3. **API Routes Not Working**:
   - Verify vercel.json configuration
   - Check function timeout limits
   - Review serverless function logs

### Environment Variables Checklist:
- [ ] DATABASE_URL
- [ ] PGHOST
- [ ] PGDATABASE
- [ ] PGUSER
- [ ] PGPASSWORD
- [ ] PGPORT

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic)

## Performance Optimization

- Static files are automatically cached by Vercel's CDN
- API routes run as serverless functions
- Database connections are pooled for efficiency

Your Land Rover Club Tanzania website will be live at: `https://your-project-name.vercel.app`