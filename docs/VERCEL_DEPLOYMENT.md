# Vercel Deployment Guide

## Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [X] Production build tested locally (`npm run build && npm start`)
- [X] Environment variables documented (.env.production.example)
- [X] Database setup completed (see docs/DATABASE_SETUP.md)
- [X] All tests passing (`npm test`)
- [X] Code pushed to GitHub
- [ ] Production database created
- [ ] Database migrations run
- [ ] Default categories seeded

## Step-by-Step Deployment

### Step 1: Prepare GitHub Repository

1. **Commit All Changes**:
   ```bash
   git add -A
   git commit -m "feat: Ready for production deployment"
   git push origin main
   ```

2. **Verify Repository**:
   - Go to your GitHub repository
   - Check that all files are present
   - Ensure `.env*` files are **NOT** committed (should be in `.gitignore`)

### Step 2: Create Vercel Account

1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Click **Continue with GitHub**
3. Authorize Vercel to access your repositories
4. Complete account setup

### Step 3: Import Project to Vercel

1. **Go to Vercel Dashboard**: [https://vercel.com/new](https://vercel.com/new)

2. **Import Git Repository**:
   - Select your GitHub account
   - Find your `expense_tracker` repository
   - Click **Import**

3. **Configure Project**:
   ```
   Project Name: expense-tracker (or your preferred name)
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./ (default)
   Build Command: npm run build (default)
   Output Directory: .next (default)
   Install Command: npm install (default)
   ```

4. **Click "Deploy"** (don't configure environment variables yet)
   - First deployment will fail (expected - database not configured)
   - This creates the project in Vercel

### Step 4: Setup Vercel Postgres Database

1. **In Vercel Dashboard**:
   - Go to your project
   - Click **Storage** tab
   - Click **Create Database**
   - Select **Postgres**

2. **Configure Database**:
   ```
   Database Name: expense-tracker-db
   Region: Select closest to your users (e.g., US East for North America)
   ```

3. **Create Database**: Click **Create**

4. **Get Connection String**:
   - In database page, go to **Settings** → **Connection Strings**
   - Copy the **Postgres** connection string (not Prisma URL)
   - Format: `postgresql://default:***@***-pooler.aws-****-region-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require`

### Step 5: Configure Environment Variables

1. **Go to Project Settings** → **Environment Variables**

2. **Add Production Variables**:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `DATABASE_URL` | (your Vercel Postgres connection string) | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production only |
   | `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Production |

   **Important**: 
   - Select **all three environments** for DATABASE_URL (Production, Preview, Development)
   - Use production DATABASE_URL for all environments initially
   - Later, create separate databases for Preview/Development if needed

3. **Click "Save"** for each variable

### Step 6: Run Database Migrations

**Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   # Follow browser prompts
   ```

3. **Link Project**:
   ```bash
   cd /path/to/expense_tracker
   vercel link
   # Select your team and project
   ```

4. **Pull Environment Variables**:
   ```bash
   vercel env pull .env.production.local
   # This creates .env.production.local with production DATABASE_URL
   ```

5. **Run Migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

6. **Verify**:
   ```bash
   npx prisma studio
   # Open http://localhost:5555
   # Check that Categories table has 9 rows
   ```

**Option B: Direct Connection (Alternative)**

1. **Set DATABASE_URL Locally**:
   ```bash
   export DATABASE_URL="postgresql://default:***@***-pooler.aws-****-region-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
   ```

2. **Run Migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Step 7: Redeploy Application

1. **In Vercel Dashboard**:
   - Go to **Deployments** tab
   - Find the failed deployment
   - Click **⋯** (three dots) → **Redeploy**
   - Select **Use existing Build Cache**: No
   - Click **Redeploy**

2. **Monitor Deployment**:
   - Watch the build logs in real-time
   - Build should complete in 2-3 minutes
   - Check for errors in logs

3. **Verify Deployment**:
   - Once build completes, click **Visit** button
   - Your app should open at `https://your-project.vercel.app`

### Step 8: Test Production Application

Visit your deployment URL and test:

1. **Homepage Dashboard**:
   - [ ] Homepage loads without errors
   - [ ] Dashboard shows 0₫ (no transactions yet)
   - [ ] Layout renders correctly

2. **Create Transaction**:
   - [ ] Go to Giao dịch → Thêm Giao dịch
   - [ ] Create a test transaction
   - [ ] Success toast appears
   - [ ] Redirected to transaction list
   - [ ] New transaction appears in list

3. **Dashboard Updates**:
   - [ ] Go back to homepage
   - [ ] Dashboard shows updated statistics
   - [ ] Category breakdown shows data

4. **Other Features**:
   - [ ] Search works
   - [ ] Filters work
   - [ ] CSV export works
   - [ ] Can create categories
   - [ ] Can edit/delete transactions

## Post-Deployment Configuration

### Custom Domain (Optional)

1. **In Vercel Dashboard**: Go to **Settings** → **Domains**
2. **Add Domain**: Enter your domain (e.g., `expense-tracker.example.com`)
3. **Configure DNS**:
   - If using Vercel DNS: Follow automatic setup
   - If using external DNS: Add CNAME record pointing to `cname.vercel-dns.com`

4. **Update Environment Variable**:
   - Go to **Settings** → **Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Redeploy application

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`**: Production deployment
- **Push to other branches**: Preview deployment
- **Pull Requests**: Preview deployment with unique URL

### Preview Deployments

Every PR gets a unique preview URL:
- Example: `https://expense-tracker-git-feature-name.vercel.app`
- Test features before merging to main
- Share with team for review

## Continuous Integration

### GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Format check
      run: npm run format:check
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
```

This runs before Vercel deployment to catch errors early.

## Monitoring & Alerts

### Vercel Analytics

1. **Enable in Dashboard**: Go to **Analytics** tab → Enable

2. **Or Install Package**:
   ```bash
   npm install @vercel/analytics
   ```

   ```typescript
   // In src/app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';

   <body>
     {children}
     <Analytics />
   </body>
   ```

### Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
// In src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

<body>
  {children}
  <SpeedInsights />
</body>
```

### Deployment Notifications

1. **In Vercel Dashboard**: Go to **Settings** → **Notifications**
2. **Enable**:
   - Deployment Started
   - Deployment Ready
   - Deployment Failed

3. **Integrations**:
   - Slack: Get notifications in Slack channel
   - Email: Send to team members

## Troubleshooting

### Build Fails on Vercel

**Check Build Logs**:
1. Go to **Deployments** → Click failed deployment
2. Check **Build Logs** for errors

**Common Issues**:

1. **TypeScript Errors**:
   ```
   Error: Type error: ...
   ```
   Fix: Run `npm run type-check` locally and fix errors

2. **Missing Environment Variables**:
   ```
   Error: DATABASE_URL is not defined
   ```
   Fix: Add DATABASE_URL in **Settings** → **Environment Variables**

3. **Prisma Generate Fails**:
   ```
   Error: Prisma schema not found
   ```
   Fix: Ensure `prisma/schema.prisma` is committed to git

4. **Out of Memory**:
   ```
   Error: JavaScript heap out of memory
   ```
   Fix: Contact Vercel support or upgrade plan

### Application Runs But Shows Errors

1. **500 Internal Server Error**:
   - Check **Runtime Logs** in Vercel dashboard
   - Look for database connection errors
   - Verify DATABASE_URL is correct

2. **Database Connection Fails**:
   ```
   PrismaClientInitializationError
   ```
   - Verify DATABASE_URL includes `?sslmode=require`
   - Check database is accessible from Vercel
   - Ensure migrations were run

3. **Missing Data**:
   - Run `npx prisma db seed` again
   - Check database tables exist: `npx prisma studio`

### Revert Deployment

If something goes wrong:

1. **Go to Deployments**
2. **Find Last Working Deployment**
3. **Click ⋯ → Promote to Production**

## Performance Optimization

After deployment, check performance:

1. **Lighthouse Audit**:
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit on production URL
   - Target: All scores > 90

2. **Vercel Analytics**:
   - Check Web Vitals (LCP, FID, CLS)
   - Monitor page load times
   - Identify slow pages

3. **Optimize If Needed**:
   - Add caching headers
   - Optimize images
   - Reduce bundle size (see docs/BUILD_OPTIMIZATION.md)

## Security Review

After deployment, verify:

- [ ] No sensitive data in client code (run `git grep "password\|secret\|key"`)
- [ ] Environment variables properly scoped (no `NEXT_PUBLIC_` for secrets)
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Security headers configured (check next.config.js)
- [ ] Database uses SSL (`?sslmode=require` in connection string)

## Backup Strategy

### Vercel Postgres Backups

- **Automatic**: Daily backups (retained 7 days on free tier)
- **Manual Backup**:
  ```bash
  # Export to SQL file
  pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d).sql
  ```

### Git Backups

- **Code**: Always on GitHub
- **Database Schema**: `prisma/schema.prisma` in git
- **Migrations**: `prisma/migrations/` in git

## Cost Estimation

### Vercel Free Tier

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Analytics
- ⚠️ No commercial use (upgrade to Pro for production apps)

### Vercel Pro ($20/month)

- ✅ Commercial use
- ✅ 1TB bandwidth
- ✅ Advanced analytics
- ✅ Team collaboration
- ✅ Password protection
- ✅ Preview deployment comments

### Vercel Postgres Pricing

- **Free Tier**: 256MB storage, 60 hours compute
- **Pro**: $0.00036/GB/hour storage, $0.10/compute hour

**Estimated for Expense Tracker**:
- Storage: ~50MB (small dataset) → ~$0.15/month
- Compute: ~100 hours/month → ~$10/month
- **Total**: ~$10-15/month (Pro plan + database)

## Next Steps

After successful deployment:

1. ✅ T079 Complete: Application deployed to Vercel
2. ➡️ T080: Setup monitoring and logging
3. ➡️ T081: Security review
4. 🎉 Share production URL with users

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
