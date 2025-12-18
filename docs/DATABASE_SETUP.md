# Production Database Setup Guide

## Overview

This guide walks through setting up a PostgreSQL database for production deployment of the Expense Tracker application.

## Option 1: Vercel Postgres (Recommended for Vercel Deployment)

### Step 1: Create Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose your database name (e.g., `expense-tracker-db`)
6. Select region closest to your users
7. Click **Create**

### Step 2: Get Connection String

1. In database settings, find **Connection Strings**
2. Copy the **Postgres** connection string (not Prisma URL)
3. Format: `postgresql://default:password@host-region.postgres.vercel-storage.com:5432/verceldb?sslmode=require`

### Step 3: Configure Environment Variable

**In Vercel Project**:
1. Go to Project Settings → Environment Variables
2. Add variable:
   ```
   Name: DATABASE_URL
   Value: <your-connection-string>
   Environments: Production, Preview, Development (select all)
   ```

**For Local Testing**:
```bash
# Create .env.production.local (NEVER commit this file)
DATABASE_URL="postgresql://default:password@host-region.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

### Step 4: Run Migrations

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull production environment variables
vercel env pull .env.production.local

# Generate Prisma Client
npx prisma generate

# Run migrations (NEVER use migrate dev in production)
npx prisma migrate deploy

# Seed default categories
npx prisma db seed
```

### Step 5: Verify

```bash
# Test connection
npx prisma db execute --stdin <<< "SELECT NOW();"

# Check tables
npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE schemaname='public';"

# Count seeded categories
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM categories;"
```

**Expected output**:
- Tables: `_prisma_migrations`, `categories`, `transactions`
- Categories: 9 (2 income + 7 expense)

---

## Option 2: Supabase (Free Tier Available)

### Step 1: Create Project

1. Go to [Supabase](https://supabase.com)
2. Click **New Project**
3. Choose organization
4. Fill in:
   - Name: `expense-tracker`
   - Database Password: (generate strong password)
   - Region: Closest to users
5. Click **Create new project**

### Step 2: Get Connection String

1. Go to **Project Settings** → **Database**
2. Find **Connection string** section
3. Select **URI** format (not Session mode)
4. Copy connection string
5. **Important**: Replace `[YOUR-PASSWORD]` with actual password
6. **Add** `?sslmode=require` at the end

Example:
```
postgresql://postgres.abc123:YourPassword@aws-0-region.pooler.supabase.com:5432/postgres?sslmode=require
```

### Step 3: Configure & Migrate

Same as Vercel (Steps 3-5 above)

### Advantages

- ✅ Free tier: 500MB database
- ✅ Built-in PostgreSQL extensions
- ✅ Automatic backups (point-in-time recovery)
- ✅ Database UI explorer
- ✅ SQL editor

---

## Option 3: Railway (Easy Setup)

### Step 1: Create Service

1. Go to [Railway](https://railway.app)
2. Click **New Project**
3. Select **Provision PostgreSQL**
4. Database is created instantly

### Step 2: Get Connection String

1. Click on PostgreSQL service
2. Go to **Connect** tab
3. Copy **Postgres Connection URL**
4. Already includes SSL configuration

Example:
```
postgresql://postgres:password@region.railway.app:5432/railway
```

### Step 3: Configure & Migrate

Same as Vercel (Steps 3-5 above)

### Advantages

- ✅ Simplest setup (1 click)
- ✅ Free tier: $5 credit/month
- ✅ Automatic SSL
- ✅ Built-in monitoring
- ⚠️ Requires credit card for free tier

---

## Option 4: Neon (Serverless Postgres)

### Step 1: Create Project

1. Go to [Neon](https://neon.tech)
2. Click **Create a project**
3. Fill in project name
4. Select region
5. Click **Create project**

### Step 2: Get Connection String

1. In project dashboard, find **Connection Details**
2. Select **Connection string**
3. Copy the string (already includes SSL)

Example:
```
postgresql://user:password@ep-region-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Advantages

- ✅ Serverless (auto-scales to zero)
- ✅ Free tier: 512MB storage
- ✅ Branching (database branches for dev/staging)
- ✅ Auto-suspend when idle
- ✅ Pay per use (cost-effective for low traffic)

---

## Troubleshooting

### Connection Fails

**Error**: `ENOTFOUND` or `connection refused`
- ✅ Check SSL mode: ensure `?sslmode=require` in connection string
- ✅ Verify firewall: some providers require IP whitelisting
- ✅ Check credentials: ensure password has no special chars causing issues

**Fix**:
```bash
# Test connection manually
npx prisma db execute --stdin <<< "SELECT 1;"
```

### Migration Fails

**Error**: `P3009: migrate.lock file is not present`
- ✅ Ensure you've committed migrations to git
- ✅ Run `npx prisma migrate dev` locally first

**Error**: `P3005: Database schema not empty`
- ✅ Production database shouldn't be manually altered
- ✅ Drop all tables if testing: `npx prisma migrate reset` (⚠️ DELETES DATA)

### Seed Fails

**Error**: Categories already exist
- ✅ Seed script has `createMany({ skipDuplicates: true })`
- ✅ Re-running seed is safe (won't duplicate)

**Error**: `PrismaClientInitializationError`
- ✅ Check DATABASE_URL is set correctly
- ✅ Run `npx prisma generate` first

---

## Security Best Practices

### ✅ DO:
- Use strong passwords (16+ characters, mixed case, numbers, symbols)
- Enable SSL (`?sslmode=require`)
- Use environment variables for credentials
- Restrict database access to application only
- Enable automated backups
- Monitor database logs for suspicious activity

### ❌ DON'T:
- Commit `.env.production` or `.env.production.local` to git
- Use default passwords
- Expose database publicly without authentication
- Share connection strings in plain text (use secret management)
- Give application user unnecessary database permissions (no DROP, TRUNCATE)

---

## Backup & Recovery

### Vercel Postgres
- Automatic daily backups
- Point-in-time recovery (Enterprise plan)

### Supabase
- Automatic daily backups (free tier)
- Point-in-time recovery available
- Manual backup: Project Settings → Database → Backup now

### Railway
- Automatic daily snapshots
- Manual backup via UI: PostgreSQL service → Backups

### Manual Backup (Any Provider)
```bash
# Export database to file
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d).sql

# Restore from backup
psql "$DATABASE_URL" < backup_20250118.sql
```

---

## Performance Monitoring

### Check Connection Pool
```sql
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

### Check Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Slow Queries
```sql
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

---

## Next Steps

After setting up production database:

1. ✅ Verify connection works
2. ✅ Run migrations (`npx prisma migrate deploy`)
3. ✅ Seed default categories (`npx prisma db seed`)
4. ✅ Test with sample data
5. ✅ Configure automated backups
6. ✅ Set up monitoring alerts
7. ➡️ Proceed to **T078: Optimize production build**

---

## Quick Reference

| Provider | Free Tier | SSL | Backups | Best For |
|----------|-----------|-----|---------|----------|
| **Vercel Postgres** | 256MB | ✅ | ✅ | Vercel deployments |
| **Supabase** | 500MB | ✅ | ✅ | Feature-rich free tier |
| **Railway** | $5/month | ✅ | ✅ | Simplest setup |
| **Neon** | 512MB | ✅ | ✅ | Serverless, cost-effective |

**Recommendation**: 
- **Vercel deployment** → Use **Vercel Postgres** (seamless integration)
- **Other platforms** → Use **Supabase** (best free tier)
- **Budget-conscious** → Use **Neon** (serverless, pay per use)
