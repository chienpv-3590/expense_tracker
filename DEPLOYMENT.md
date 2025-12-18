# Deployment Guide - Expense Tracker

## 📋 Pre-Deployment Checklist

- [ ] Production database created (PostgreSQL)
- [ ] Environment variables configured
- [ ] Production build tested locally
- [ ] All tests passing
- [ ] Security review completed
- [ ] Monitoring setup (optional)

---

## 🗄️ Production Database Setup

For detailed step-by-step database setup instructions, see **[docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)**.

### Quick Overview

**Recommended Providers**:
- **Vercel Postgres**: Best for Vercel deployments (seamless integration)
- **Supabase**: Best free tier (500MB, backups, UI)
- **Railway**: Simplest setup (1-click PostgreSQL)
- **Neon**: Serverless, cost-effective (auto-scales to zero)

### Quick Start (Vercel Postgres)

1. **Create Database** in Vercel dashboard → Storage → Postgres
2. **Copy Connection String** from database settings
3. **Add to Environment Variables**:
   ```env
   DATABASE_URL=postgresql://default:pass@host.vercel-storage.com:5432/verceldb?sslmode=require
   ```
4. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

See [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) for complete instructions for all providers.

---

## 🚀 Vercel Deployment (Recommended)

### Step 1: Prepare Repository

1. **Push to GitHub**:
   ```bash
   git add -A
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Verify `.gitignore`**:
   ```
   .env*
   !.env.example
   !.env.production.example
   ```

### Step 2: Create Vercel Project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Framework Preset**: Next.js (auto-detected)
4. **Root Directory**: `./` (default)

### Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important**:
- Set environment for: Production, Preview, Development (select all)
- Never expose `DATABASE_URL` to client (no `NEXT_PUBLIC_` prefix)

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build (2-3 minutes)
3. Visit deployment URL

### Step 5: Run Database Migrations

**Via Vercel CLI**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration command
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

**Or manually**:
- Set `DATABASE_URL` locally to production database
- Run migrations from local machine

---

## 🔧 Alternative Platforms

### Netlify

1. **Not Recommended**: Limited Node.js runtime for API routes
2. Consider using Netlify for frontend + separate API hosting

### Railway

1. **Create Project**: railway.app
2. **Add PostgreSQL Service**
3. **Deploy from GitHub**
4. **Environment Variables**: Same as Vercel
5. **Custom Domain**: Configure in Railway dashboard

### Render

1. **Create Web Service**: render.com
2. **Connect GitHub**
3. **Build Command**: `npm install && npx prisma generate && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add in dashboard

---

## ⚡ Performance Optimization

### Next.js Configuration

Already configured in `next.config.js`:
```javascript
// Automatic optimizations enabled:
- Code splitting
- Image optimization
- Font optimization
- Static generation where possible
```

### Caching Strategy

```typescript
// API Routes with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Page with ISR
export const revalidate = 3600; // Revalidate every hour
```

### Database Connection Pooling

Prisma handles connection pooling automatically.
For high traffic, consider:
```env
DATABASE_URL="postgresql://...?connection_limit=10"
```

---

## 🔒 Security Checklist

- ✅ Environment variables secured (not in client code)
- ✅ Database uses SSL (`?sslmode=require`)
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS prevention (React auto-escapes)
- ✅ CSRF protection (SameSite cookies if using auth)
- ✅ No sensitive data in error messages
- ⚠️ Consider rate limiting for production (optional)

---

## 📊 Monitoring Setup (Optional)

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// In src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Follow wizard to configure Sentry DSN.

---

## 🧪 Testing Production Build Locally

```bash
# Build for production
npm run build

# Start production server
npm start

# Test on http://localhost:3000
```

**Verify**:
- [ ] All pages load correctly
- [ ] API endpoints work
- [ ] Database operations succeed
- [ ] CSV export works
- [ ] Images load correctly
- [ ] No console errors

---

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- **Push to `main`**: Production deployment
- **Pull Requests**: Preview deployments
- **Push to branches**: Preview deployments

**Custom Domains**:
1. Vercel → Settings → Domains
2. Add your domain
3. Configure DNS (CNAME or A record)

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Database Connection Fails

- Verify `DATABASE_URL` format
- Check SSL mode: `?sslmode=require`
- Ensure database allows connections from Vercel IPs
- Check Prisma schema matches database

### 500 Errors in Production

1. Check Vercel logs: Dashboard → Deployments → Logs
2. Enable error tracking (Sentry)
3. Check database migrations: `npx prisma migrate status`

---

## 📝 Post-Deployment Tasks

1. **Test Critical Paths**:
   - Create transaction
   - View dashboard
   - Export CSV
   - Filter transactions

2. **Monitor Performance**:
   - Check Web Vitals in Vercel
   - Monitor API response times
   - Check database query performance

3. **Setup Backups**:
   - Vercel Postgres: Automatic backups
   - Supabase: Point-in-time recovery
   - Manual: `pg_dump` regularly

4. **Documentation**:
   - Update README with production URL
   - Document deployment process for team
   - Create runbook for common issues

---

## 🎉 Success!

Your Expense Tracker is now live! 🚀

**Production URL**: https://your-app.vercel.app
**Admin Panel**: https://vercel.com/dashboard

**Next Steps**:
- Share with users
- Gather feedback
- Monitor usage
- Plan improvements
