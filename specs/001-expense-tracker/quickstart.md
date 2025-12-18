# Quickstart Guide: Expense Tracker Development

**Feature**: Expense Tracker Application  
**Date**: 2025-12-17  
**Prerequisites**: Node.js 20+ LTS, PostgreSQL 16+, Git

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Database Configuration](#database-configuration)
3. [Development Workflow](#development-workflow)
4. [Testing](#testing)
5. [Common Commands](#common-commands)
6. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### 1. Install Prerequisites

**Node.js 20 LTS**:
```bash
# Check Node version
node --version  # Should be >= 20.0.0

# Install via nvm (recommended)
nvm install 20
nvm use 20
```

**PostgreSQL 16**:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-16

# macOS (Homebrew)
brew install postgresql@16

# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql@16  # macOS

# Verify installation
psql --version
```

### 2. Clone Repository and Install Dependencies

```bash
# Clone repository (adjust path as needed)
cd /path/to/workspace
cd expense_tracker

# Install npm dependencies
npm install

# Expected dependencies:
# - next@15.x
# - react@18.x
# - prisma@5.x
# - @prisma/client@5.x
# - tailwindcss@3.4.x
# - zod@3.x
# - typescript@5.3.x
```

---

## Database Configuration

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# In psql prompt:
CREATE DATABASE expense_tracker;
CREATE USER expense_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;

# Grant schema permissions (PostgreSQL 15+)
\c expense_tracker
GRANT ALL ON SCHEMA public TO expense_user;

# Exit psql
\q
```

### 2. Configure Environment Variables

Create `.env.local` file in project root:

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

**`.env.local` content**:
```env
# Database connection string
DATABASE_URL="postgresql://expense_user:your_secure_password@localhost:5432/expense_tracker?schema=public"

# Next.js configuration
NODE_ENV=development
```

**Security Note**: Never commit `.env.local` to version control (already in `.gitignore`).

### 3. Run Database Migrations

```bash
# Generate Prisma Client from schema
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Seed default categories
npx prisma db seed

# Verify database setup
npx prisma studio  # Opens web UI at http://localhost:5555
```

**Expected Output**:
```
✔ Generated Prisma Client
✔ Applied migration: 20251217_init
✔ Seeded 9 default categories
```

---

## Development Workflow

### 1. Start Development Server

```bash
# Start Next.js development server
npm run dev

# Server starts at http://localhost:3000
# API routes available at http://localhost:3000/api/*
```

**Development Features**:
- Hot Module Replacement (HMR) for instant updates
- TypeScript type checking on save
- Tailwind CSS with JIT compilation
- React Fast Refresh for component changes

### 2. Verify Setup

Open browser to `http://localhost:3000`:
- [ ] Dashboard page loads (empty state)
- [ ] Click "Add Transaction" → Form appears
- [ ] Category dropdown shows 9 default categories
- [ ] Can create a test transaction

### 3. Project Structure Navigation

```
expense_tracker/
├── src/
│   ├── app/                 # Pages and API routes (App Router)
│   │   ├── page.tsx         # Dashboard (http://localhost:3000/)
│   │   ├── transactions/    # Transaction pages
│   │   └── api/             # API endpoints
│   ├── components/          # React components
│   ├── lib/                 # Utilities (Prisma client, formatters)
│   └── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration history
│   └── seed.ts              # Seed script
├── __tests__/               # Test files
└── public/                  # Static assets
```

### 4. Making Changes

**Add a New Page**:
```bash
# Create new page at /about
mkdir -p src/app/about
touch src/app/about/page.tsx
```

**Add a New Component**:
```bash
# Create reusable component
touch src/components/ui/Badge.tsx
```

**Modify Database Schema**:
```bash
# 1. Edit prisma/schema.prisma
nano prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_new_field

# 3. Regenerate Prisma Client
npx prisma generate
```

**Add API Route**:
```bash
# Create new API endpoint at /api/stats
mkdir -p src/app/api/stats
touch src/app/api/stats/route.ts
```

---

## Testing

### 1. Unit Tests (Jest + React Testing Library)

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test src/components/forms/TransactionForm.test.tsx
```

**Test Structure**:
```typescript
// Example: __tests__/unit/components/TransactionForm.test.tsx
import { render, screen } from '@testing-library/react';
import TransactionForm from '@/components/forms/TransactionForm';

describe('TransactionForm', () => {
  it('renders all form fields', () => {
    render(<TransactionForm />);
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests (API Routes)

```bash
# Run integration tests
npm run test:integration

# Test specific API route
npm test __tests__/integration/api/transactions.test.ts
```

**Example Integration Test**:
```typescript
// __tests__/integration/api/transactions.test.ts
describe('POST /api/transactions', () => {
  it('creates transaction with valid data', async () => {
    const response = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 50000,
        type: 'EXPENSE',
        categoryId: 'test-category-id',
        date: '2025-12-17',
      }),
    });
    expect(response.status).toBe(201);
  });
});
```

### 3. End-to-End Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific E2E test
npx playwright test tests/e2e/create-transaction.spec.ts
```

**Example E2E Test**:
```typescript
// __tests__/e2e/create-transaction.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a transaction', async ({ page }) => {
  await page.goto('http://localhost:3000/transactions/new');
  await page.fill('input[name="amount"]', '50000');
  await page.selectOption('select[name="categoryId"]', 'food');
  await page.fill('input[name="date"]', '2025-12-17');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/transactions');
});
```

---

## Common Commands

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Lint code
npm run lint

# Format code (if Prettier configured)
npm run format
```

### Database

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage report
npm run test:coverage
```

### Code Quality

```bash
# TypeScript type checking
npx tsc --noEmit

# ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix
```

---

## Troubleshooting

### Database Connection Issues

**Problem**: `Error: Can't reach database server`

**Solutions**:
```bash
# 1. Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# 2. Verify DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# 3. Test connection manually
psql -h localhost -U expense_user -d expense_tracker

# 4. Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log  # Linux
tail -f /usr/local/var/log/postgres.log  # macOS
```

---

### Prisma Migration Issues

**Problem**: `Migration failed to apply`

**Solutions**:
```bash
# 1. Check migration status
npx prisma migrate status

# 2. Reset database (⚠️ loses data)
npx prisma migrate reset

# 3. Apply migrations manually
npx prisma migrate deploy

# 4. If stuck, drop and recreate database
sudo -u postgres psql
DROP DATABASE expense_tracker;
CREATE DATABASE expense_tracker;
\q
npx prisma migrate dev
```

---

### Next.js Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solutions**:
```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
PORT=3001 npm run dev

# Option 3: Find and kill process manually
lsof -i:3000  # Find PID
kill -9 <PID>
```

---

### TypeScript Errors After Schema Changes

**Problem**: TypeScript errors about Prisma types

**Solutions**:
```bash
# 1. Regenerate Prisma Client
npx prisma generate

# 2. Restart TypeScript server (VS Code)
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# 3. Clear Next.js cache
rm -rf .next
npm run dev
```

---

### Hot Reload Not Working

**Problem**: Changes not reflecting in browser

**Solutions**:
```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Restart dev server
# Ctrl + C, then npm run dev

# 3. Hard refresh browser
# Ctrl + Shift + R (Linux/Windows)
# Cmd + Shift + R (macOS)

# 4. Check file watchers limit (Linux)
cat /proc/sys/fs/inotify/max_user_watches
# If low, increase:
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### Seed Script Fails

**Problem**: Default categories not created

**Solutions**:
```bash
# 1. Check seed script exists
ls prisma/seed.ts

# 2. Verify package.json has seed config
cat package.json | grep -A 3 '"prisma"'
# Should show:
# "prisma": {
#   "seed": "ts-node prisma/seed.ts"
# }

# 3. Run seed manually
npx ts-node prisma/seed.ts

# 4. If categories exist, clear and re-seed
npx prisma migrate reset  # Clears all data
```

---

## Environment-Specific Configuration

### Development (.env.local)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/expense_tracker"
NODE_ENV=development
```

### Production (.env.production)
```env
DATABASE_URL="postgresql://user:pass@prod-server:5432/expense_tracker?sslmode=require"
NODE_ENV=production
```

---

## Performance Monitoring

### Development Metrics

```bash
# Next.js build analysis
npm run build -- --profile

# Check bundle size
npm run build
# Look for "Page Size" in output

# Lighthouse score
npx lighthouse http://localhost:3000 --view
```

### Database Query Performance

```bash
# Enable Prisma query logging
# Add to .env.local:
DEBUG="prisma:query"

# Monitor slow queries in PostgreSQL
sudo -u postgres psql expense_tracker
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

---

## Next Steps

Once setup is complete:

1. ✅ Verify all pages load correctly
2. ✅ Test creating a transaction end-to-end
3. ✅ Run test suite (`npm test`)
4. ✅ Review [data-model.md](./data-model.md) for database schema
5. ✅ Review [api-routes.md](./contracts/api-routes.md) for API documentation
6. ✅ Start implementing user stories from [spec.md](./spec.md)

**Ready to start development!** 🚀

For implementation tasks, see [tasks.md](./tasks.md) (generated by `/speckit.tasks` command).

---

## Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
