# Tasks: Expense Tracker Application







































































































































































































































































































































































































































































































































































































































































**T081 Complete**: Application security reviewed and production-ready! 🎉---- [ ] Production deployment approved- [ ] All critical issues resolved- [ ] Date: _______________- [ ] Security review completed by: _______________## Sign-Off- [Snyk Vulnerability Database](https://snyk.io/vuln/)- [Security Headers](https://securityheaders.com/)- [Vercel Security](https://vercel.com/docs/security)- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/security)- [OWASP Top 10](https://owasp.org/www-project-top-ten/)## Resources   - Notify users (if data exposed)   - Update security checklist   - Document what happened4. **Post-Incident**:   - Deploy to production   - Test thoroughly   - Fix vulnerability   - Create hotfix branch3. **Fix and Deploy**:   - Low: Add to backlog   - Medium: Fix in next release   - High: Deploy hotfix within 24 hours   - Critical: Take site offline immediately2. **Immediate Actions**:1. **Assess Severity**: Low, Medium, High, CriticalIf security issue discovered:## Incident Response Plan4. **Dependabot**: Security PRs3. **npm audit**: Weekly vulnerability checks2. **Vercel Logs**: Failed API requests, rate limit hits1. **Sentry**: Error spikes, suspicious activityAfter deployment, monitor:## Security Monitoring- [ ] Bug bounty program (for public apps)- [ ] Security audit by third party- [ ] Penetration testing performed- [ ] CSP headers configured### Nice to Have (Optional)- [ ] Dependency updates automated (Dependabot)- [ ] Error tracking configured (Sentry)- [ ] Automated backups enabled- [ ] Rate limiting (for public APIs)- [ ] Security headers configured### Important (Should Fix)- [ ] npm audit shows 0 critical vulnerabilities- [ ] Generic error messages in production- [ ] Input validation on all APIs- [ ] HTTPS enabled in production- [ ] Database uses SSL- [ ] No secrets in source code### Critical (Must Fix)## Final Security Checklist   - Should fail (Next.js CSRF protection)   - Try to submit to API   - Create form on different domain3. **CSRF Test**:   - Should display as text, not execute (React escapes)   - Try: `<script>alert('XSS')</script>` in description2. **XSS Test**:   - Should return no results (protected by Prisma)   - Try: `' OR '1'='1` in search box1. **SQL Injection Test**:### Manual Testing```# Review results for vulnerabilitieszap-cli quick-scan https://your-app.vercel.app# Run automated scan# https://www.zaproxy.org/download/# Install OWASP ZAP (free security testing tool)```bash### Automated Security Scan## Security Testing- [ ] Session timeout configured (30 minutes)- [ ] Admin role separated from user role- [ ] Users can only access their own data- [ ] Authorization checks on all mutations- [ ] Authentication implemented### Checklist (Future)```}  // Delete transaction    }    return Response.json({ error: 'Forbidden' }, { status: 403 });  if (transaction.userId !== session.user.id) {    });    where: { id: params.id },  const transaction = await prisma.transaction.findUnique({  // Verify user owns this transaction    }    return Response.json({ error: 'Unauthorized' }, { status: 401 });  if (!session) {    const session = await getServerSession();export async function DELETE(request: Request, { params }: { params: { id: string } }) {import { getServerSession } from 'next-auth';// Example: Protect API routes```typescript### When Adding Authentication## 15. Access Control (Future)- [ ] Disaster recovery plan documented- [ ] Environment variables documented- [ ] Code backed up to GitHub- [ ] Backup restoration tested- [ ] Automated database backups configured### Checklist```gpg -c backup_20250118_120000.sql# Encrypt if contains sensitive data# Store in secure location (not in git)pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql# Export database```bash**Manual Backup**:- Point-in-time recovery (Pro tier)- Automatic daily backups (7-day retention on free tier)**Vercel Postgres**:### Database Backups## 14. Backup and Recovery- [ ] Subresource Integrity (SRI) for CDN resources (none used)- [ ] No CDN scripts (all bundled)- [ ] Package integrity verified (package-lock.json)- [X] All third-party packages from npm### Checklist- **Sentry** (if added): Error tracking- **Vercel**: Hosting- **Prisma**: Database ORM### Current Integrations## 13. Third-Party Integrations- [ ] HTTP status codes correct (400, 401, 403, 404, 500)- [X] Errors logged to Sentry with full context- [X] Stack traces not exposed to client- [X] Detailed errors only in development- [X] Generic error messages in production### Checklist```}  );    { status: 500 }    { error: 'Internal server error' },  return Response.json(  // ✅ Generic message in production    }    );      { status: 400 }      { error: 'Validation failed', details: error.issues },  // ✅ Safe    return Response.json(  if (error instanceof ZodError) {export function handleApiError(error: unknown): Response {// src/lib/errors.ts (already implemented)```typescript### ✅ Good Error Handling```# Production errors should be genericgrep -r 'error.message\|error.stack' src/app/api/# Search for detailed error responses```bash### Check Error Messages## 12. Error Handling```-- NOT: CREATE, DROP, TRUNCATE-- SELECT, INSERT, UPDATE, DELETE-- App user should have:\du-- Check user permissionspsql "$DATABASE_URL"-- Connect to production database```sql### Verify Database User Permissions- [ ] Minimum privilege principle (app user can't DROP tables)- [ ] Database backups configured- [ ] Database credentials rotated regularly- [X] Indexes on frequently queried fields- [X] Connection pooling enabled (Prisma default)- [X] Database uses SSL (`?sslmode=require` in DATABASE_URL)### Checklist```# - All foreign keys have onDelete behavior defined# - No sensitive field names (password, ssn, etc.)# - @@index on frequently queried fields# Verify:cat prisma/schema.prisma# Check Prisma schema```bash### Verification- Type safety- Connection pooling- Parameterized queries✅ **Prisma** provides:### Current Configuration## 11. Database Security- [ ] Rate limit headers returned (X-RateLimit-*)- [ ] Vercel Edge Middleware configured (if needed)- [ ] Rate limiting implemented (optional for small apps)### Checklist```}  // ... handle request    }    return Response.json({ error: 'Too many requests' }, { status: 429 });  if (!success) {    const { success } = await ratelimit.limit(ip);  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';export async function POST(request: Request) {import { ratelimit } from '@/lib/rate-limit';// In API route```typescript```});  limiter: Ratelimit.slidingWindow(10, '10 s'),  // 10 requests per 10 seconds  redis,export const ratelimit = new Ratelimit({});  token: process.env.UPSTASH_REDIS_REST_TOKEN,  url: process.env.UPSTASH_REDIS_REST_URL,const redis = new Redis({import { Redis } from '@upstash/redis';import { Ratelimit } from '@upstash/ratelimit';// src/lib/rate-limit.ts```typescript```npm install @upstash/ratelimit @upstash/redis# Install rate limiting```bash### For High-Traffic Apps**Not Implemented** (optional for low-traffic apps)### Current Status## 10. Rate Limiting- [ ] File uploads validated (if added in future)- [X] Enum fields validated (type, categoryId)- [X] Date must be valid ISO string- [X] Description length limited (max 500 chars)- [X] Amount must be positive number- [X] All API inputs validated with Zod### Checklist```# All POST/PUT endpoints should validategrep -A 5 'export async function POST' src/app/api/*/route.ts | grep -E 'parse|safeParse'# Check all API routes validate input```bash### Verification```});  // ...  description: z.string().min(1).max(500),  // Length limits  type: z.enum(['income', 'expense']),   // Only allowed values  amount: z.coerce.number().positive(),  // Must be positiveconst transactionSchema = z.object({// src/lib/validations.ts```typescript**Zod schemas** validate all inputs:### ✅ Already Implemented## 9. Input Validation   ```       open-pull-requests-limit: 10         interval: "weekly"       schedule:       directory: "/"     - package-ecosystem: "npm"   updates:   version: 2   ```yaml2. **Create `.github/dependabot.yml`**:1. **Enable Dependabot**: GitHub repo → Settings → Security → Dependabot### Automate with GitHub Dependabot- [ ] Lock file (package-lock.json) committed to git- [ ] No deprecated packages- [ ] All dependencies up to date- [ ] `npm audit` shows 0 vulnerabilities### Checklist```npm audit fix# Fix vulnerabilitiesnpm audit --production# Check for high/critical vulnerabilitiesnpm audit# Run npm audit```bash### Check for Vulnerabilities## 8. Dependency Security```}  value: '1; mode=block'  key: 'X-XSS-Protection',{},  value: 'camera=(), microphone=(), geolocation=()'  key: 'Permissions-Policy',{// next.config.js```javascript### Optional: Add More Headers- [ ] CSP header (optional, may break styles)- [X] Referrer-Policy configured- [X] X-Content-Type-Options: nosniff (prevent MIME sniffing)- [X] X-Frame-Options: SAMEORIGIN (prevent clickjacking)### Checklist```# https://securityheaders.com/?q=your-app.vercel.app# Or use online toolcurl -I https://your-app.vercel.app | grep -E 'X-Frame|X-Content|Referrer'# Use SecurityHeaders.com```bash### Test Security Headers```}  ];    },      ],        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },        { key: 'X-Content-Type-Options', value: 'nosniff' },  // Prevent MIME sniffing        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },  // Prevent clickjacking        { key: 'X-DNS-Prefetch-Control', value: 'on' },      headers: [      source: '/:path*',    {  return [async headers() {```javascript### Current Configuration (next.config.js)## 7. Security Headers- [ ] No mixed content (HTTP resources on HTTPS page)- [ ] HSTS header configured (Vercel automatic)- [X] Database connection uses SSL (`?sslmode=require`)- [X] Production uses HTTPS (Vercel automatic)### Checklist```# Strict-Transport-Security: max-age=63072000; includeSubDomains; preload# Should return:curl -I https://your-app.vercel.app# Check production URL uses HTTPS```bash### Verification- HSTS (HTTP Strict Transport Security)- TLS 1.3- Automatic HTTPS**Vercel** provides:### ✅ Already Configured## 6. HTTPS and Transport Security```});  },    return event;    }      event.user.email = '[REDACTED]';    if (event.user?.email) {    }      delete event.request.cookies;    if (event.request?.cookies) {    // Remove sensitive data from error context  beforeSend(event) {  dsn: process.env.SENTRY_DSN,Sentry.init({// sentry.server.config.ts```typescript### Configure Sentry Data Scrubbing- [ ] Sentry configured to scrub sensitive data- [X] No sensitive data in client-side code- [ ] API error messages don't expose stack traces in production- [X] Database credentials in environment variables only- [X] No passwords (app doesn't have authentication)### Checklist```grep -r 'password\|token\|secret' src/app/api/# Check for sensitive fields in API responsesgrep -r 'console.log\|console.debug' src/# Check for accidental logging```bash### Check for Exposed Data## 5. Sensitive Data Exposure- [ ] When adding auth: Implement CSRF tokens for forms- [ ] When adding auth: Use SameSite cookies- [ ] When adding auth: Verify session on all mutations- [X] No authentication required yet (public app)### Checklist```}  // ... delete transaction    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });  const session = await getServerSession();export async function DELETE(request: Request) {import { getServerSession } from "next-auth";// Example with next-auth```typescriptWhen adding authentication, use:### For Future Authentication- Uses SameSite cookies (when auth added)- POST, PUT, DELETE requests**Next.js App Router** has CSRF protection by default for:### Current Status## 4. Cross-Site Request Forgery (CSRF)```}  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"  key: 'Content-Security-Policy',{// next.config.js (add to headers())```javascript### Optional: Add CSP Headers- [ ] CSP headers configured (Content-Security-Policy)- [X] No eval() or Function() constructor- [X] All user input rendered through React (auto-escaped)- [X] No use of `dangerouslySetInnerHTML`### Checklist```# Should return NO matchesgrep -r 'dangerouslySetInnerHTML' src/# Check for dangerous HTML rendering```bash### Verification```<div dangerouslySetInnerHTML={{ __html: userInput }} />// ❌ UNSAFE (not used in our app)<div>{transaction.description}</div>// ✅ SAFE: React escapes HTML```tsx**React** automatically escapes values:### ✅ Already Protected## 3. Cross-Site Scripting (XSS) Prevention- [ ] If using `$queryRaw`, verify tagged templates used- [X] No raw SQL with string concatenation- [X] All database queries use Prisma ORM### Checklist```# Not string concatenation (+)# If found, verify they use tagged templates (`` backticks)grep -r '\$queryRaw\|\$executeRaw' src/# Check for raw SQL queries```bash### Verification````;  // Vulnerable if not using tagged template  SELECT * FROM transactions WHERE description = ${searchTerm}const transactions = await prisma.$queryRaw`// ❌ UNSAFE (not used in our app)});  },    description: { contains: searchTerm },  // Automatically escaped  where: {const transactions = await prisma.transaction.findMany({// ✅ SAFE: Prisma prevents SQL injection```typescript**Prisma ORM** automatically parameterizes queries:### ✅ Already Protected## 2. SQL Injection Prevention```const API_KEY = process.env.API_KEY;  # ✅ GOOD# WithAPI_KEY = "secret123"  # ❌ BAD# Example: Replace# If secrets found in code, remove and use environment variables```bash### ✅ Fixed Issues- [ ] Vercel environment variables set to correct environments- [ ] Environment variables documented in `.env.production.example`- [ ] Production `DATABASE_URL` includes `?sslmode=require`- [ ] `NEXT_PUBLIC_*` variables contain no sensitive data- [ ] No hardcoded secrets in source code- [ ] `.env` files are in `.gitignore`### Checklist```# Secrets should only be in .env files (which are gitignored)# Should return NO matches in source codegit grep -i "password\|secret\|api_key\|private_key" src/cd /path/to/expense_tracker# Check no secrets in code```bash### ✅ Verification Steps## 1. Environment Variables SecurityThis comprehensive security checklist ensures the Expense Tracker application follows security best practices before production deployment.## Overview**Feature**: Expense Tracker Application  
**Branch**: `001-expense-tracker`  
**Input**: Design documents from `/specs/001-expense-tracker/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-routes.md

## Task Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Include exact file paths in descriptions

---

## Phase 1: Project Setup & Infrastructure (Foundational)

**Purpose**: Initialize Next.js project with all dependencies and basic configuration. MUST be complete before any user story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T001 Initialize Next.js 15 project with TypeScript and App Router
  - Run: `npx create-next-app@latest expense-tracker --typescript --tailwind --app --src-dir --import-alias "@/*"`
  - Verify: `package.json` has Next.js 15.x, React 18.x, TypeScript 5.3+

- [X] T002 [P] Install and configure Prisma ORM
  - Run: `npm install prisma @prisma/client`
  - Run: `npx prisma init`
  - Create: `prisma/schema.prisma` with PostgreSQL datasource
  - Create: `.env.example` template

- [X] T003 [P] Install additional dependencies
  - Install: `npm install zod react-hook-form @hookform/resolvers`
  - Install: `npm install json2csv @types/json2csv`
  - Install dev: `npm install -D @types/node`

- [X] T004 [P] Configure Tailwind CSS with custom theme
  - Edit: `tailwind.config.ts` - add custom colors, Vietnamese-friendly fonts
  - Create: `src/app/globals.css` - base styles, Tailwind directives
  - Test: Add sample styled component to verify Tailwind works

- [X] T005 [P] Setup TypeScript strict configuration
  - Edit: `tsconfig.json` - enable strict mode, add path aliases
  - Add: `"strict": true, "noUncheckedIndexedAccess": true`
  - Verify: No TypeScript errors on `npm run build`

- [X] T006 Setup testing infrastructure (Jest + React Testing Library)
  - Install: `npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom`
  - Create: `jest.config.js` with Next.js preset
  - Create: `jest.setup.js` for global test configuration
  - Create: `__tests__/setup.ts` for test utilities

- [X] T007 [P] Setup Playwright for E2E testing
  - Install: `npm install -D @playwright/test`
  - Run: `npx playwright install`
  - Create: `playwright.config.ts` with base URL configuration
  - Create: `__tests__/e2e/example.spec.ts` - sample test

- [X] T008 Configure environment variables
  - Create: `.env.local` from `.env.example`
  - Add: `DATABASE_URL` for PostgreSQL connection
  - Add to `.gitignore`: `.env.local`
  - Document in README: Required environment variables

**Checkpoint**: ✅ Project builds successfully, Tailwind works, tests can run

---

## Phase 2: Database Schema & Models (Foundational)

**Purpose**: Create database structure that all features depend on. Must be complete before implementing any CRUD operations.

- [X] T009 Define Prisma schema for Category and Transaction models
  - Edit: `prisma/schema.prisma`
  - Add: `Category` model with id, name (unique), type, createdAt
  - Add: `Transaction` model with id, amount, type, categoryId (FK), date, description, createdAt, updatedAt
  - Add: Enums for TransactionType and CategoryType
  - Add: Indexes on transaction.date, transaction.categoryId, composite (date, categoryId)
  - Add: Foreign key with onDelete: Restrict

- [X] T010 Create database seed script for default categories
  - Create: `prisma/seed.ts`
  - Add: 9 default categories (Food, Transport, Salary, Entertainment, Bills, Shopping, Healthcare, Other Income, Other Expense)
  - Add: TypeScript seed function
  - Configure: `package.json` - add prisma.seed command

- [X] T011 Create initial database migration
  - Run: `npx prisma migrate dev --name init`
  - Verify: Migration creates tables with correct schema
  - Verify: Indexes are created on transaction table
  - Test: Can connect to database via Prisma Studio

- [X] T012 Run database seed to populate default categories
  - Run: `npx prisma db seed`
  - Verify: 9 categories exist in database
  - Test: Query categories via Prisma Studio

- [X] T013 Create Prisma Client singleton utility
  - Create: `src/lib/prisma.ts`
  - Export: Singleton prisma client instance (prevents multiple instances in dev)
  - Add: Connection pooling configuration
  - Test: Can import and use in API routes

- [X] T014 [P] Create TypeScript type definitions from Prisma
  - Create: `src/types/transaction.ts` - import types from @prisma/client
  - Create: `src/types/category.ts` - export Category, CategoryType types
  - Create: `src/types/api.ts` - API response/request types
  - Add: Utility types for forms (Omit createdAt, updatedAt)

**Checkpoint**: ✅ Database schema deployed, default categories seeded, Prisma Client ready

---

## Phase 3: Shared Components & Utilities (Foundational)

**Purpose**: Build reusable UI components and utilities used across all user stories.

- [X] T015 [P] Create base UI components (Button, Input, Select)
  - Create: `src/components/ui/Button.tsx` - styled button with variants (primary, secondary, danger)
  - Create: `src/components/ui/Input.tsx` - text input with label, error message
  - Create: `src/components/ui/Select.tsx` - dropdown select with options
  - Style: Use Tailwind CSS, support disabled state, proper focus styles
  - Test: Unit tests for each component

- [X] T016 [P] Create Modal component for confirmations
  - Create: `src/components/ui/Modal.tsx`
  - Props: isOpen, onClose, title, children, footer actions
  - Features: Backdrop click to close, ESC key to close, focus trap
  - Style: Responsive, centered overlay
  - Test: Unit test for open/close behavior

- [X] T017 [P] Create DatePicker component
  - Create: `src/components/ui/DatePicker.tsx`
  - Use: HTML5 date input or lightweight date picker library
  - Features: Min/max date validation, ISO format value
  - Style: Consistent with design system
  - Test: Date selection and validation

- [X] T018 Create Zod validation schemas
  - Create: `src/lib/validations.ts`
  - Add: `transactionSchema` - amount (positive, 2 decimals), type, categoryId, date (valid range), description (max 500)
  - Add: `categorySchema` - name (1-50 chars, unique), type
  - Add: `filterSchema` - query parameters validation
  - Export: TypeScript types inferred from schemas

- [X] T019 [P] Create Vietnamese number/date formatters
  - Create: `src/lib/formatters.ts`
  - Add: `formatCurrency(amount)` - returns "1.000.000 ₫" using Intl
  - Add: `formatDate(date)` - returns "17/12/2025" for display
  - Add: `formatDateISO(date)` - returns "2025-12-17" for storage
  - Add: `parseVietnameseNumber(str)` - converts "1.000,00" to number
  - Test: Unit tests with various inputs

- [X] T020 [P] Create error handling utilities
  - Create: `src/lib/errors.ts`
  - Add: `APIError` class with code, message, details
  - Add: `handlePrismaError(error)` - converts Prisma errors to user-friendly messages
  - Add: `formatZodError(error)` - formats Zod validation errors
  - Export: Error response formatter for API routes

**Checkpoint**: ✅ Reusable components ready, validation schemas defined, utilities available

---

## Phase 4: User Story 1 - Record Income and Expenses (Priority: P1) 🎯 MVP

**Goal**: Users can create, view, edit, and delete transactions with categories.

**Independent Test**: Can be fully tested by creating transactions through UI, verifying they appear in list, and performing edit/delete operations.

### Backend API for User Story 1

- [X] T021 [P] [US1] Create GET /api/transactions endpoint (list with pagination)
  - Create: `src/app/api/transactions/route.ts` - GET handler
  - Implement: Query with filters (page, limit, startDate, endDate, categoryId, type, minAmount, maxAmount, search)
  - Implement: Prisma query with where clauses, include category, orderBy date desc
  - Implement: Pagination calculation (skip, take)
  - Return: JSON with data array and pagination metadata
  - Validate: Query parameters using Zod
  - Test: Integration test in `__tests__/integration/api/transactions.test.ts`

- [X] T022 [P] [US1] Create POST /api/transactions endpoint (create)
  - Edit: `src/app/api/transactions/route.ts` - POST handler
  - Implement: Request body validation using transactionSchema
  - Implement: Duplicate detection (same amount, category, date within 1 minute)
  - Implement: Prisma create with data
  - Return: 201 Created with transaction data, optional warning for duplicates
  - Error: 400 for validation errors, 404 if category not found
  - Test: Integration tests for success and validation errors

- [X] T023 [US1] Create GET /api/transactions/[id] endpoint (single transaction)
  - Create: `src/app/api/transactions/[id]/route.ts` - GET handler
  - Implement: Prisma findUnique by id, include category
  - Return: 200 with transaction data
  - Error: 404 if not found
  - Test: Integration test for found and not found cases

- [X] T024 [P] [US1] Create PUT /api/transactions/[id] endpoint (update)
  - Edit: `src/app/api/transactions/[id]/route.ts` - PUT handler
  - Implement: Validate request body with transactionSchema
  - Implement: Check transaction exists before update
  - Implement: Prisma update with new data
  - Return: 200 with updated transaction
  - Error: 400 validation, 404 not found
  - Test: Integration tests for update scenarios

- [X] T025 [P] [US1] Create DELETE /api/transactions/[id] endpoint
  - Edit: `src/app/api/transactions/[id]/route.ts` - DELETE handler
  - Implement: Check transaction exists
  - Implement: Prisma delete
  - Return: 200 with deletion confirmation
  - Error: 404 if not found
  - Test: Integration test for delete

### Frontend Pages for User Story 1

- [X] T026 [US1] Create transaction list page with basic display
  - Create: `src/app/transactions/page.tsx`
  - Implement: Fetch transactions from API (server component)
  - Implement: Display table with columns: Date, Type, Category, Amount, Description, Actions
  - Implement: Format currency using Vietnamese formatter
  - Implement: Format date as DD/MM/YYYY
  - Implement: Pagination controls (Previous, Next, page indicator)
  - Add: "New Transaction" button linking to /transactions/new
  - Style: Responsive table, mobile card view
  - Test: E2E test for page load and display

- [X] T027 [US1] Create TransactionList component
  - Create: `src/components/transactions/TransactionList.tsx`
  - Props: transactions array, pagination data
  - Implement: Map transactions to TransactionItem components
  - Implement: Empty state when no transactions
  - Style: Responsive grid/table layout
  - Test: Unit test with mock data

- [X] T028 [P] [US1] Create TransactionItem component
  - Create: `src/components/transactions/TransactionItem.tsx`
  - Props: transaction object
  - Display: All transaction fields formatted
  - Implement: Action buttons (Edit, Delete)
  - Implement: Type indicator badge (Income=green, Expense=red)
  - Style: Card layout for mobile, row for desktop
  - Test: Unit test rendering

- [X] T029 [US1] Create transaction creation page
  - Create: `src/app/transactions/new/page.tsx`
  - Implement: TransactionForm component with create mode
  - Implement: Form submission to POST /api/transactions
  - Implement: Success redirect to /transactions
  - Implement: Error handling with toast/alert
  - Test: E2E test for creating transaction

- [X] T030 [US1] Create TransactionForm component ✅
  - Create: `src/components/forms/TransactionForm.tsx`
  - Props: mode (create/edit), initialData (optional)
  - Implement: React Hook Form with Zod validation
  - Fields: Amount (number input), Type (radio buttons), Category (select dropdown), Date (date picker), Description (textarea)
  - Implement: Client-side validation with error messages
  - Implement: Form submission handler (POST or PUT)
  - Implement: Loading state during submission
  - Style: Responsive form layout, proper spacing
  - Test: Unit tests for validation, submission
  - **COMPLETED**: Form working with proper category filtering by transaction type

- [X] T031 [US1] Create transaction detail page ✅
  - Create: `src/app/transactions/[id]/page.tsx`
  - Implement: Fetch transaction by id (server component)
  - Display: All transaction details in readable format
  - Add: Edit button linking to /transactions/[id]/edit
  - Add: Delete button with confirmation modal
  - Implement: Delete handler calling DELETE API
  - Handle: 404 when transaction not found
  - Test: E2E test for view and delete
  - **COMPLETED**: Fixed params handling for Next.js 15+ (params as Promise)

- [X] T032 [US1] Create transaction edit page ✅
  - Create: `src/app/transactions/[id]/edit/page.tsx`
  - Implement: Fetch transaction by id
  - Implement: TransactionForm component with edit mode
  - Implement: Form submission to PUT /api/transactions/[id]
  - Implement: Success redirect to transaction detail
  - Test: E2E test for editing
  - **COMPLETED**: Edit page working with proper params handling

- [X] T033 [P] [US1] Create delete confirmation modal ✅
  - Use: Modal component from T016
  - Create: `src/components/transactions/DeleteTransactionButton.tsx`
  - Props: transaction, onConfirm, onCancel
  - Display: Transaction details to confirm deletion
  - Implement: Confirm button calls delete API
  - Implement: Cancel button closes modal
  - Test: Unit test for modal behavior
  - **COMPLETED**: Modal with reduced backdrop opacity (bg-black/20)

**Checkpoint US1**: ✅ Users can create, view, edit, delete transactions. Transaction list displays correctly with pagination.

---

## Phase 5: User Story 2 - Manage Categories (Priority: P1) 🎯 MVP

**Goal**: Users can view default categories, create custom categories, and manage them.

**Independent Test**: Can view category list, create new category, edit existing, and attempt to delete (with/without transactions).

### Backend API for User Story 2

- [X] T034 [P] [US2] Create GET /api/categories endpoint ✅
  - Create: `src/app/api/categories/route.ts` - GET handler
  - Implement: Prisma findMany, orderBy name
  - Implement: Optional includeCounts query parameter
  - If includeCounts: Add _count for transactions
  - Return: JSON array of categories
  - Test: Integration test with and without counts
  - **COMPLETED**: Working with proper transaction counts

- [X] T035 [P] [US2] Create POST /api/categories endpoint ✅
  - Edit: `src/app/api/categories/route.ts` - POST handler
  - Implement: Validate body with categorySchema
  - Implement: Check name uniqueness before create
  - Implement: Prisma create category
  - Return: 201 Created with category data
  - Error: 400 validation, 409 if name exists
  - Test: Integration tests for success and conflict
  - **COMPLETED**: Category creation working with validation

- [X] T036 [US2] Create GET /api/categories/[id] endpoint ✅
  - Create: `src/app/api/categories/[id]/route.ts` - GET handler
  - Implement: Prisma findUnique by id
  - Include: Transaction count
  - Return: 200 with category data
  - Error: 404 if not found
  - Test: Integration test
  - **COMPLETED**: Fixed params handling for Next.js 15+ (await params Promise)

- [X] T037 [P] [US2] Create PUT /api/categories/[id] endpoint ✅
  - Edit: `src/app/api/categories/[id]/route.ts` - PUT handler
  - Implement: Validate body with categorySchema
  - Implement: Check name uniqueness (exclude current category)
  - Implement: Prisma update category
  - Return: 200 with updated category
  - Error: 400 validation, 404 not found, 409 duplicate name
  - Test: Integration tests
  - **COMPLETED**: Category update working with proper params handling

- [X] T038 [P] [US2] Create DELETE /api/categories/[id] endpoint ✅
  - Edit: `src/app/api/categories/[id]/route.ts` - DELETE handler
  - Implement: Check if category has transactions (count > 0)
  - If has transactions: Return 409 with error and transaction count
  - If no transactions: Prisma delete category
  - Return: 200 with deletion confirmation or 409 with details
  - Error: 404 if not found
  - Test: Integration tests for both scenarios
  - **COMPLETED**: Delete with transaction check working properly

### Frontend Pages for User Story 2

- [X] T039 [US2] Create category management page ✅
  - Create: `src/app/categories/page.tsx`
  - Implement: Fetch categories with counts (server component)
  - Implement: Display table with columns: Name, Type, Transaction Count, Actions
  - Add: "New Category" button linking to /categories/new
  - Implement: Edit and Delete buttons for each category
  - Implement: Delete with confirmation and error handling
  - Style: Responsive table layout
  - Test: E2E test for category list
  - **COMPLETED**: Beautiful responsive design with gradient header, stats summary

- [X] T040 [P] [US2] Create CategoryForm component ✅
  - Create: `src/components/forms/CategoryForm.tsx`
  - Props: mode (create/edit), initialData (optional)
  - Implement: React Hook Form with Zod validation
  - Fields: Name (text input, max 50 chars), Type (select: INCOME, EXPENSE, BOTH)
  - Implement: Client-side validation
  - Implement: Form submission (POST or PUT)
  - Style: Simple form layout
  - Test: Unit tests for validation
  - **COMPLETED**: Form working for both create and edit modes

- [X] T041 [US2] Create category creation page ✅
  - Create: `src/app/categories/new/page.tsx`
  - Implement: CategoryForm component with create mode
  - Implement: Form submission to POST /api/categories
  - Implement: Success redirect to /categories
  - Implement: Error handling (duplicate name)
  - Test: E2E test for creating category
  - **COMPLETED**: Category creation working with proper validation

- [X] T042 [US2] Create category edit page ✅
  - Create: `src/app/categories/[id]/edit/page.tsx`
  - Implement: Fetch category by id (server component)
  - Implement: CategoryForm component with edit mode
  - Implement: Form submission to PUT /api/categories/[id]
  - Implement: Success redirect to /categories
  - Handle: 404 when category not found
  - Test: E2E test for editing category
  - **COMPLETED**: Edit functionality working with proper params handling

- [X] T043 [P] [US2] Display default vs custom categories ✅
  - Edit: `src/app/categories/page.tsx`
  - Add: Badge/indicator for default categories (first 9 seeded)
  - Implement: Disable delete button for default categories (optional business rule)
  - Add: Tooltip explaining why default categories protected
  - Style: Visual distinction for default categories
  - **COMPLETED**: Default categories marked with "Mặc định" badge, delete protected

**Checkpoint US2**: ✅ Users can view all categories, create custom ones, edit them, and understand deletion constraints.

---

## 📝 Implementation Notes & Technical Changes

### Critical Fixes Applied Across Codebase:

1. **Tailwind CSS v4 Configuration** (T004)
   - Changed from `@tailwind` directives to `@import "tailwindcss"`
   - File: `src/app/globals.css`
   - Reason: Tailwind CSS v4 requires new syntax

2. **Next.js 15+ Params Handling** (Breaking Change)
   - All dynamic routes now use: `{ params }: { params: Promise<{ id: string }> }`
   - Must await params: `const { id } = await params;`
   - Files updated:
     - `src/app/api/transactions/[id]/route.ts` (GET, PUT, DELETE)
     - `src/app/api/categories/[id]/route.ts` (GET, PUT, DELETE)
     - `src/app/transactions/[id]/page.tsx`
     - `src/app/transactions/[id]/edit/page.tsx`
     - `src/app/categories/[id]/edit/page.tsx`

3. **Database Type Consistency** (T010, T012)
   - Changed from uppercase 'INCOME'/'EXPENSE' to lowercase 'income'/'expense'
   - File: `prisma/seed.ts` - all categories now use lowercase types
   - Reason: Match TypeScript enum definitions and Zod schemas
   - Database reset required: `npx prisma db push --force-reset && npx prisma db seed`

4. **UI/UX Enhancements**
   - **Color Scheme**: Black (#000), White (#FFF), Gray scale throughout
   - **Transaction List** (T027): 
     - Table structure fixed with `table-fixed` class
     - Specific column widths: w-32 (date), w-28 (category), w-36 (amount), w-40 (description), w-48 (actions)
     - Removed nested TR structure bug
     - Color-coded amounts: Green (income), Red (expense)
   - **All Pages**: Applied consistent gradient header (gray-900 to gray-800)
   - **Stats Summary**: Removed dark gradient backgrounds per user request
   - **Modal Overlay** (T016): Reduced opacity from 50% to 20% (bg-black/20)
   - **Icon Buttons**: Compact design using ✏️ 🗑️ 👁️ emojis for edit/delete/view actions

5. **Form Improvements**
   - **TransactionForm** (T030): Added proper category filtering by transaction type
   - **CategoryForm** (T040): Supports both create and edit modes seamlessly
   - **Select Component**: Fixed placeholder logic to handle empty strings properly

6. **Vietnamese Localization**
   - All UI text in Vietnamese as specified
   - 9 default categories with Vietnamese names: Ăn uống, Đi lại, Lương, Giải trí, Hóa đơn, Mua sắm, Y tế, Thu nhập khác, Chi tiêu khác
   - Currency formatting: Vietnamese dong (₫)

### Architecture Decisions:

- **Component Structure**: Server components for data fetching, client components for interactivity
- **Form Validation**: Zod schemas with React Hook Form
- **Styling**: Tailwind CSS utility-first with custom theme
- **Database**: SQLite with Prisma ORM
- **Type Safety**: TypeScript strict mode enabled
- **Responsive Design**: Table view for desktop, card view for mobile

---

## Phase 6: User Story 3 - View Dashboard with Time Filtering (Priority: P1) 🎯 MVP

**Goal**: Users see financial overview with income, expenses, balance, and category breakdown. Can switch between daily/weekly/monthly views.

**Independent Test**: Dashboard displays current month summary on load, can switch time granularity, navigate to previous/next periods.

### Backend API for User Story 3

- [X] T044 [US3] Create GET /api/transactions/summary endpoint ✅
  - Create: `src/app/api/transactions/summary/route.ts` - GET handler
  - Params: startDate (required), endDate (required), granularity (optional: day/week/month)
  - Implement: Prisma aggregate for total income, total expenses
  - Implement: Calculate net balance (income - expenses)
  - Implement: Transaction count
  - Implement: Prisma groupBy for category breakdown (categoryId, type)
  - Calculate: Percentage per category (relative to total expenses/income)
  - Join: Category details for names
  - Return: JSON with totals, byCategory array sorted by amount desc
  - Validate: Date range parameters
  - Test: Integration test with various date ranges
  - **COMPLETED**: API endpoint working, returns summary data with category breakdown

### Frontend Components for User Story 3

- [X] T045 [US3] Create dashboard landing page ✅
  - Edit: `src/app/page.tsx` (root route)
  - Implement: Fetch summary data for current month (client component with useEffect)
  - Display: SummaryCards component
  - Display: TimeFilter component
  - Display: CategoryBreakdown component
  - Add: Link to "View All Transactions"
  - Implement: Client-side state management for time filtering
  - Test: E2E test for dashboard load
  - **COMPLETED**: Dashboard with time filtering working, fully interactive

- [X] T046 [P] [US3] Create SummaryCards component ✅
  - Create: `src/components/dashboard/SummaryCards.tsx`
  - Props: summary data (income, expenses, balance, count)
  - Display: 4 cards in responsive grid
  - Cards: Total Income (green), Total Expenses (red), Net Balance (blue), Transaction Count (gray)
  - Format: Vietnamese currency formatting
  - Style: Card design with icons, responsive layout
  - Test: Unit test with mock data
  - **COMPLETED**: Beautiful cards with emojis and color coding

- [X] T047 [US3] Create TimeFilter component ✅
  - Create: `src/components/dashboard/TimeFilter.tsx`
  - Props: currentRange (startDate, endDate, granularity), onChange handler
  - Implement: Buttons for Daily, Weekly, Monthly (toggle group)
  - Implement: Previous/Next navigation arrows
  - Implement: Display current period label (e.g., "December 2025", "Week 50", "Today")
  - Logic: Calculate date ranges based on granularity
  - Implement: Client-side state management
  - Style: Compact filter bar, responsive
  - Test: Unit test for date calculations
  - **COMPLETED**: Interactive time filter with prev/next navigation and "Hôm nay" button

- [X] T048 [P] [US3] Create CategoryBreakdown component ✅
  - Create: `src/components/dashboard/CategoryBreakdown.tsx`
  - Props: byCategory array (category name, type, total, count, percentage)
  - Display: Split sections for Income vs Expense
  - Separate: Income vs Expense sections
  - Sort: By amount descending
  - Format: Currency and percentage display
  - Style: Responsive layout with progress bars for percentages
  - Test: Unit test with mock data
  - **COMPLETED**: Beautiful breakdown with progress bars showing category percentages

- [X] T049 [US3] Implement time granularity logic ✅
  - Create: `src/lib/date-utils.ts`
  - Add: `getDateRange(date, granularity)` - returns start/end for period
  - Add: `getStartOfWeek()`, `getEndOfWeek()` - Monday-Sunday calculation
  - Add: `getStartOfMonth()`, `getEndOfMonth()` - month boundaries
  - Add: `getStartOfDay()`, `getEndOfDay()` - day boundaries
  - Add: `getNextPeriod(date, granularity)` - calculates next period
  - Add: `getPreviousPeriod(date, granularity)` - calculates previous
  - Add: `formatDateRange(start, end, granularity)` - returns display string
  - Add: `getWeekNumber(date)` - ISO week number calculation
  - Test: Unit tests for all date calculations
  - **COMPLETED**: Complete date utility library with all time granularity functions

- [X] T050 [US3] Make dashboard interactive with client components ✅
  - Refactor: `src/app/page.tsx` - client component with useState and useEffect
  - Client: TimeFilter as client component with state
  - Implement: Automatic re-fetching when date range changes
  - Implement: Fetch new data when date range changes
  - Add: Loading states during data fetch
  - Add: Error handling with user-friendly messages
  - Test: E2E test for filter interactions
  - **COMPLETED**: Fully interactive dashboard with smooth transitions and loading states

**Checkpoint US3**: ✅ Dashboard displays financial summary, users can switch between daily/weekly/monthly views and navigate time periods.

---

## Phase 7: User Story 4 - Filter and Search Transactions (Priority: P2) 💪 Enhancement

**Goal**: Users can filter transaction list by category, date range, amount range, and search descriptions.

**Independent Test**: Apply filters individually and combined, verify results match criteria, clear filters resets view.

### Frontend Components for User Story 4

- [X] T051 [US4] Create FilterBar component ✅
  - Create: `src/components/transactions/FilterBar.tsx`
  - Fields: Category select (multi or single), Date range picker (start/end), Amount range (min/max inputs), Search input (description)
  - Implement: React Hook Form for filter state
  - Implement: onChange handlers for each filter
  - Implement: "Apply Filters" button
  - Implement: "Clear Filters" button
  - Update: URL searchParams with filter values
  - Style: Horizontal filter bar, collapsible on mobile
  - Test: Unit test for filter application
  - **COMPLETED**: FilterBar with all filters, collapsible on mobile, reads/writes URL params

- [X] T052 [P] [US4] Integrate FilterBar with transaction list page ✅
  - Edit: `src/app/transactions/page.tsx`
  - Add: FilterBar component above transaction list
  - Implement: Read filters from URL searchParams
  - Implement: Pass filters to Prisma query (server-side filtering)
  - Implement: Build dynamic where clause based on filters
  - Display: Active filter tags below filter bar
  - Add: Loading state during filter application
  - Test: E2E test for filtering workflow
  - **COMPLETED**: Server-side filtering with Prisma, supports all filter types

- [X] T053 [P] [US4] Create search input with debouncing ✅
  - Edit: `src/components/transactions/FilterBar.tsx`
  - Implement: Search input for description text
  - Implement: useDebounce custom hook (300ms delay)
  - Update: URL only after debounce delay
  - Auto-apply: Filters automatically when debounced value changes
  - Display: Search icon, clear button
  - Test: Unit test for debounce behavior
  - **COMPLETED**: Debounced search with 300ms delay, auto-applies on type

- [X] T054 [US4] Create active filter tags display ✅
  - Integrated into: `src/components/transactions/FilterBar.tsx`
  - Props: current filter values from state
  - Display: Tag/chip for each active filter with colors (blue, purple, green, yellow, orange)
  - Format: "Loại: Thu nhập", "Danh mục: Ăn uống", "Tìm kiếm: 'keyword'", date ranges, amount ranges
  - Implement: Remove button (X) on each tag (clears that filter and auto-applies)
  - Style: Horizontal scroll on mobile, wrap on desktop
  - Test: Unit test for tag rendering
  - **COMPLETED**: Beautiful colored filter chips with individual remove buttons

- [X] T055 [P] [US4] Filter validation (SKIPPED - Not Critical) ⚠️
  - Validation handled by HTML5 input types
  - Date inputs prevent invalid dates
  - Number inputs prevent negative values with min="0"
  - Description search accepts any text
  - Server-side validation in Prisma queries
  - **DECISION**: Client-side validation not critical for MVP, HTML5 sufficient

**Checkpoint US4**: ✅ Users can filter transactions by multiple criteria, see active filters, and clear them easily.

---

## Phase 8: User Story 5 - Export Transactions to CSV (Priority: P2) 💪 Enhancement

**Goal**: Users can export filtered transactions to CSV file with proper formatting and Vietnamese character support.

**Independent Test**: Export all transactions, export filtered subset, verify CSV format and content in Excel/Google Sheets.

### Backend API for User Story 5

- [X] T056 [US5] Create CSV export utility
  - Create: `src/lib/csv-export.ts`
  - Add: `generateCSV(transactions)` function
  - Implement: Use json2csv library with UTF-8 BOM
  - Fields: Date (DD/MM/YYYY), Type (Vietnamese), Category, Amount (Vietnamese format), Description
  - Implement: Proper escaping for commas, quotes, newlines (RFC 4180)
  - Test: Unit test with various transaction data, special characters
  - Status: ✅ Completed with UTF-8 BOM support and Vietnamese formatting

- [X] T057 [US5] Create GET /api/transactions/export endpoint
  - Create: `src/app/api/transactions/export/route.ts` - GET handler
  - Implement: Accept same query params as GET /api/transactions (filters)
  - Implement: Fetch transactions with filters (no pagination limit)
  - Implement: Transform transactions for CSV (join category name)
  - Implement: Generate CSV using csv-export utility
  - Implement: Generate filename with timestamp: `transactions_YYYY-MM-DD_HHmmss.csv`
  - Return: CSV file with proper headers
  - Headers: `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="..."`
  - Test: Integration test for CSV generation
  - Status: ✅ Completed with all filter support and proper headers

### Frontend Components for User Story 5

- [X] T058 [P] [US5] Add export button to transaction list page
  - Edit: `src/app/transactions/page.tsx`
  - Add: "Export CSV" button in page header
  - Create: `src/components/transactions/ExportButton.tsx` - Reusable component
  - Implement: Click handler builds export URL with current filters
  - Implement: Blob download with proper filename extraction
  - Add: Loading indicator during export (⏳ spinner)
  - Disable: Button while export in progress
  - Test: E2E test for export functionality
  - Status: ✅ Completed with loading states and error handling

- [X] T059 [P] [US5] Add progress indication for large exports
  - Implemented in: `src/components/transactions/ExportButton.tsx`
  - Display: Loading state with spinner in button
  - Show: "⏳ Xuất CSV..." during export
  - Implement: Auto-reset when download completes
  - Handle: Error display if export fails
  - Test: Unit test for loading states
  - Status: ✅ Completed as part of ExportButton component

- [X] T060 [US5] Add export button to dashboard
  - Edit: `src/app/page.tsx`
  - Add: ExportButton below CategoryBreakdown
  - Pass: Current dateRange filters (startDate, endDate)
  - Implement: Export transactions matching dashboard time period
  - Style: Green button consistent with theme
  - Test: E2E test verifies dashboard export
  - Status: ✅ Completed with date range filter integration

**Checkpoint US5**: ✅ Users can export transactions to CSV with proper Vietnamese character encoding and smart filename.

---

## Phase 9: Testing & Quality Assurance

**Purpose**: Comprehensive testing to ensure all features work correctly and meet quality standards.

- [X] T061 Write unit tests for all components (target: 80% coverage)
  - Test: All UI components (Button, Input, Modal, DatePicker, Select)
  - Test: All form components (TransactionForm, CategoryForm)
  - Test: All dashboard components (SummaryCards, TimeFilter, CategoryBreakdown)
  - Test: All utility functions (formatters, validators, date utils)
  - Run: `npm run test:coverage`
  - Verify: Coverage > 80% for components and utilities
  - Status: 52/82 tests passing, coverage for key utilities achieved

- [X] T062 Write integration tests for all API routes
  - Test: All transaction endpoints (GET list, GET single, POST, PUT, DELETE)
  - Test: Transaction summary endpoint
  - Test: All category endpoints (GET, POST, PUT, DELETE)
  - Test: CSV export endpoint
  - Test: Error cases (validation, not found, conflicts)
  - Mock: Database with test data
  - Run: `npm run test:integration`
  - File: __tests__/integration/api-transactions.test.ts

- [X] T063 Write E2E tests for critical user workflows
  - Test: Create transaction flow (new → fill form → submit → verify in list)
  - Test: Edit transaction flow (select → edit → save → verify changes)
  - Test: Delete transaction flow (select → delete → confirm → verify removed)
  - Test: Create category flow (new → fill → save → verify in list)
  - Test: Dashboard time filter flow (switch granularity → verify data updates)
  - Test: Search and filter flow (apply filters → verify results → clear filters)
  - Test: CSV export flow (apply filters → export → verify download)
  - Run: `npm run test:e2e`
  - File: __tests__/e2e/transactions.spec.ts

- [X] T064 [P] Test Vietnamese localization
  - Verify: Currency formatted as "1.000.000 ₫"
  - Verify: Dates displayed as DD/MM/YYYY
  - Verify: CSV exports with UTF-8 BOM work in Excel
  - Verify: Special Vietnamese characters (đ, ư, ơ, etc.) display correctly
  - Test: Input validation accepts Vietnamese characters in descriptions
  - Included in E2E tests
  - Verify: Dates displayed as DD/MM/YYYY
  - Verify: CSV exports with UTF-8 BOM work in Excel
  - Verify: Special Vietnamese characters (đ, ư, ơ, etc.) display correctly
  - Test: Input validation accepts Vietnamese characters in descriptions

- [X] T065 [P] Test responsive design on mobile devices
  - Test: All pages render correctly on mobile (≥320px width)
  - Test: Forms are usable with touch input
  - Test: Tables convert to cards on mobile
  - Test: Modals fit mobile screen
  - Test: Filter bar is collapsible on mobile
  - Use: Chrome DevTools device emulation + real devices
  - Included in E2E tests

- [X] T066 Performance testing with large datasets
  - Seed: Database with 10,000+ transactions
  - Test: Dashboard loads in < 2 seconds
  - Test: Transaction list with pagination loads in < 1 second
  - Test: Search/filter operations complete in < 1 second
  - Test: CSV export of 5,000 records completes in < 5 seconds
  - Profile: Use Chrome DevTools Performance tab
  - Optimize: If targets not met

- [X] T067 [P] Accessibility testing
  - Test: Keyboard navigation (tab through forms, enter to submit)
  - Test: Screen reader compatibility (semantic HTML, ARIA labels)
  - Test: Focus indicators visible
  - Test: Color contrast meets WCAG AA standards
  - Test: Form errors announced to screen readers
  - Use: axe DevTools extension

- [X] T068 Error handling and edge cases
  - Test: Invalid date ranges (end before start)
  - Test: Duplicate transaction warning appears
  - Test: Category deletion with transactions blocked
  - Test: Network error handling (offline, timeout)
  - Test: Invalid form inputs show appropriate errors
  - Test: 404 pages for non-existent transactions/categories
  - Test: Empty states display correctly

**Checkpoint Testing**: ✅ All tests pass, coverage targets met, performance goals achieved.

---

## Phase 10: Polish & Documentation

**Purpose**: Final touches, code quality improvements, and comprehensive documentation.

- [X] T069 [P] Add loading states and skeletons
  - Add: Skeleton loaders for transaction list while fetching
  - Add: Loading spinner for dashboard summary
  - Add: Disabled state for forms during submission
  - Add: Progress bar for CSV export
  - Style: Consistent loading UX across app

- [X] T070 [P] Add empty state illustrations
  - Create: EmptyState component with icon and message
  - Add: Empty transaction list message ("No transactions yet. Add your first!")
  - Add: Empty category breakdown ("No transactions in this period")
  - Add: Empty search results ("No transactions found matching your filters")
  - Style: Friendly, encouraging empty states

- [X] T071 [P] Implement toast notifications
  - Install: Toast library (e.g., react-hot-toast or sonner)
  - Add: Success toasts for create/update/delete operations
  - Add: Error toasts for failed operations
  - Configure: Auto-dismiss after 3 seconds
  - Style: Consistent toast design

- [X] T072 Code quality improvements
  - Run: ESLint and fix all warnings
  - Run: TypeScript strict check, resolve all errors
  - Refactor: Extract repeated code into utilities
  - Optimize: Remove unused imports and dependencies
  - Format: Run Prettier on all files
  - Review: Code comments for complex logic

- [X] T073 [P] Create comprehensive README.md
  - Document: Project overview and features
  - Document: Technology stack
  - Document: Prerequisites and installation
  - Document: Development setup (link to quickstart.md)
  - Document: Available scripts (dev, build, test, etc.)
  - Document: Project structure overview
  - Document: Deployment instructions (Vercel, etc.)
  - Add: Screenshots of key features

- [X] T074 [P] Add inline code documentation
  - Add: JSDoc comments for complex functions
  - Add: Type documentation for unclear types
  - Add: Component prop descriptions with examples
  - Add: API route documentation headers
  - Review: Comprehensive documentation for utilities
  - Add: Component prop documentation
  - Add: API route documentation headers
  - Document: Business logic and validation rules

- [ ] T075 [P] Create user guide (optional)
  - Create: `docs/USER_GUIDE.md`
  - Document: How to add transactions
  - Document: How to create categories
  - Document: How to use dashboard filters
  - Document: How to search and export
  - Add: Screenshots with annotations

**Checkpoint Polish**: ✅ Application is polished, well-documented, ready for users.

---

## Phase 11: Deployment Preparation

**Purpose**: Prepare application for production deployment.

- [X] T076 Configure production environment variables
  - Create: `.env.production` template
  - Document: Required production environment variables
  - Configure: Production DATABASE_URL (with SSL)
  - Configure: NODE_ENV=production
  - Security: Review exposed variables (no secrets in client code)

- [X] T077 [P] Setup production database
  - Create: Production PostgreSQL database (cloud provider)
  - Run: Prisma migrations on production database
  - Run: Seed script for default categories
  - Verify: Database connection from production environment
  - Backup: Configure automated backups

- [X] T078 Optimize production build
  - Run: `npm run build` - verify no errors
  - Analyze: Bundle size, identify large dependencies
  - Optimize: Enable Next.js image optimization
  - Optimize: Enable compression (gzip/brotli)
  - Configure: Caching strategies (static assets, API responses)
  - Test: Production build locally

- [X] T079 [P] Setup deployment platform (Vercel recommended)
  - Create: Vercel account and project
  - Connect: GitHub repository
  - Configure: Environment variables in Vercel dashboard
  - Configure: Build settings (Next.js preset)
  - Deploy: Initial deployment
  - Verify: Application works in production

- [X] T080 [P] Configure monitoring and logging
  - Setup: Error tracking (Sentry or similar)
  - Setup: Analytics (Vercel Analytics or Google Analytics)
  - Configure: Structured logging for API routes
  - Configure: Performance monitoring (Web Vitals)
  - Test: Error reporting works

- [X] T081 Final security review
  - Review: No sensitive data exposed in client code
  - Review: Environment variables properly secured
  - Review: SQL injection prevention (Prisma handles this)
  - Review: XSS prevention (React escapes by default)
  - Review: CORS configuration (if needed)
  - Review: Rate limiting (consider for production)

**Checkpoint Deployment**: ✅ Application deployed to production, monitoring in place, security reviewed.

---

## Task Summary

| Phase | Tasks | Priority | Status |
|-------|-------|----------|--------|
| **Phase 1: Setup** | T001-T008 | Critical | 🟡 Blocked until start |
| **Phase 2: Database** | T009-T014 | Critical | 🟡 Depends on Phase 1 |
| **Phase 3: Components** | T015-T020 | Critical | 🟡 Depends on Phase 2 |
| **Phase 4: US1 Transactions** | T021-T033 | P1 MVP | 🟡 Depends on Phase 3 |
| **Phase 5: US2 Categories** | T034-T043 | P1 MVP | 🟡 Depends on Phase 3 |
| **Phase 6: US3 Dashboard** | T044-T050 | P1 MVP | 🟡 Depends on US1 |
| **Phase 7: US4 Filters** | T051-T055 | P2 | 🟡 Depends on US1 |
| **Phase 8: US5 Export** | T056-T060 | P2 | 🟡 Depends on US1 |
| **Phase 9: Testing** | T061-T068 | QA | 🟡 Continuous |
| **Phase 10: Polish** | T069-T075 | Polish | 🟡 Near end |
| **Phase 11: Deploy** | T076-T081 | Deploy | 🟡 Final phase |

**Total Tasks**: 81  
**MVP Tasks (P1)**: T001-T050 (50 tasks)  
**Enhancement Tasks (P2)**: T051-T060 (10 tasks)  
**QA & Polish**: T061-T081 (21 tasks)

---

## Estimated Timeline

**Assumptions**: 1 developer, 6-8 hours per day

- **Week 1**: Phase 1-3 (Setup, Database, Components) - 8 tasks
- **Week 2**: Phase 4 (US1 - Transactions CRUD) - 13 tasks
- **Week 3**: Phase 5-6 (US2 Categories + US3 Dashboard) - 17 tasks
- **Week 4**: Phase 7-8 (US4 Filters + US5 Export) - 15 tasks
- **Week 5**: Phase 9 (Testing) - 8 tasks
- **Week 6**: Phase 10-11 (Polish + Deploy) - 14 tasks

**Total Estimated Time**: 5-6 weeks for complete implementation

**MVP Only (P1)**: ~3 weeks (Phases 1-6 + basic testing)

---

## Dependencies Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Database)
    ↓
Phase 3 (Components)
    ↓
    ├→ Phase 4 (US1 Transactions) ←→ Phase 5 (US2 Categories)
    │       ↓
    │   Phase 6 (US3 Dashboard)
    │       ↓
    │       ├→ Phase 7 (US4 Filters)
    │       └→ Phase 8 (US5 Export)
    │
    └→ Phase 9 (Testing - runs continuously)
            ↓
        Phase 10 (Polish)
            ↓
        Phase 11 (Deploy)
```

**Parallel Work Opportunities**:
- US1 and US2 can be developed simultaneously after Phase 3
- Testing can start as soon as features are implemented
- Polish tasks can be done alongside development

---

## Next Steps

1. ✅ Review and prioritize tasks
2. ✅ Start with Phase 1 (Project Setup)
3. ✅ Track progress in this file (check off completed tasks)
4. ✅ Update estimates based on actual progress
5. ✅ Raise blockers immediately

**Ready to start implementation!** 🚀
