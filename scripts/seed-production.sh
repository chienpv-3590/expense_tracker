#!/bin/bash

# Seed production database with default categories
# Usage: ./scripts/seed-production.sh

echo "🌱 Seeding production database..."

# Supabase connection string (direct connection for migrations/seeds)
DATABASE_URL="postgres://postgres.piiamfecztapvwgahnzn:kehYdNYmdtzETfAy@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Setup PostgreSQL provider
DATABASE_URL=$DATABASE_URL node scripts/setup-db.js

# Generate Prisma Client
DATABASE_URL=$DATABASE_URL npx prisma generate

# Run seed
DATABASE_URL=$DATABASE_URL npx prisma db seed

# Switch back to SQLite for local
node scripts/setup-db.js
npx prisma generate

echo "✅ Production database seeded successfully!"
