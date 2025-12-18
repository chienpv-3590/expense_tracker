# Automatic Database Provider Setup

## Overview

The project automatically configures the correct database provider based on your environment:

- **Local Development**: SQLite (`file:./prisma/dev.db`)
- **Production**: PostgreSQL (Supabase/Vercel Postgres)

## How It Works

The `scripts/setup-db.js` script automatically:
1. Reads your `DATABASE_URL` environment variable
2. Detects database type (SQLite or PostgreSQL)
3. Updates `prisma/schema.prisma` with the correct provider
4. Runs automatically before `dev`, `build`, and `postinstall`

## Setup Scripts

### Automatic Setup (Recommended)
```bash
# Development - automatically uses SQLite
npm run dev

# Production build - automatically uses PostgreSQL
npm run build

# Manual setup
npm run db:setup
```

### How Detection Works
```javascript
// Detects from DATABASE_URL
postgres://... → PostgreSQL
file:... → SQLite
```

## Environment Variables

### .env (Local Development)
```env
DATABASE_URL="file:./prisma/dev.db"
NODE_ENV="development"
```

### .env.production (Vercel/Production)
```env
DATABASE_URL="postgres://user:password@host:6543/db?pgbouncer=true"
NODE_ENV="production"
```

## Benefits

✅ **No Manual Editing**: Never edit schema.prisma manually
✅ **Automatic Detection**: Works on any environment
✅ **CI/CD Compatible**: Works with Vercel, GitHub Actions, etc.
✅ **Developer Friendly**: Just `npm run dev` and it works

## Troubleshooting

### Provider Mismatch Error
```bash
# Clear cache and regenerate
rm -rf .next
npm run db:setup
npx prisma generate
npm run dev
```

### Force Specific Provider
```bash
# Override detection
DATABASE_URL="file:./prisma/dev.db" npm run dev
```

## Migration Guide

### Local (SQLite)
```bash
npx prisma migrate dev --name migration_name
npx prisma db seed
```

### Production (PostgreSQL)  
```bash
# Use direct connection (port 5432, not pooled 6543)
DATABASE_URL="postgres://...@host:5432/db" npx prisma migrate deploy
DATABASE_URL="postgres://...@host:5432/db" npx prisma db seed
```

**Note**: Always use direct connection for migrations, pooled connection for runtime.
