# Phase 0: Research & Technology Decisions

**Feature**: Expense Tracker Application  
**Date**: 2025-12-17  
**Purpose**: Resolve technical uncertainties and document technology choices

## Research Tasks Completed

### 1. Next.js 15 App Router Best Practices

**Research Question**: How to structure a full-stack Next.js application with database integration and optimal performance?

**Decision**: Next.js 15 App Router with React Server Components

**Rationale**:
- **Server Components by default**: Dashboard data loads on server, reducing client-side JavaScript and improving initial load time (<2s target)
- **File-based routing**: Intuitive URL structure matching folder hierarchy (transactions/, categories/)
- **Colocation of API routes**: API endpoints live in app/api/ alongside pages, eliminating need for separate backend
- **Built-in optimizations**: Automatic code splitting, image optimization, font optimization
- **Streaming SSR**: React Suspense boundaries enable progressive page rendering

**Alternatives Considered**:
- Next.js Pages Router: Rejected due to lack of Server Components, less intuitive data fetching patterns
- Separate React + Express backend: Rejected as over-engineered for single-user app, violates Principle V (Simplicity)
- Create React App: Rejected due to lack of SSR capabilities, poor initial load performance for dashboard

**Implementation Approach**:
- Use Server Components for data-heavy pages (dashboard, transaction list)
- Use Client Components only where interactivity needed (forms, filters, modals)
- Leverage Next.js caching strategies (revalidate, cache tags) for dashboard performance

---

### 2. Database Choice and ORM

**Research Question**: What database and ORM provide reliable data persistence with strong type safety for transactions?

**Decision**: PostgreSQL 16+ with Prisma ORM 5.x

**Rationale**:
- **PostgreSQL strengths**:
  - ACID compliance ensures data integrity (Principle I: Data Accuracy)
  - Decimal/Numeric type for precise financial amounts (no floating-point errors)
  - Date/timestamp types with timezone support
  - Foreign key constraints prevent orphaned transactions
  - Excellent indexing performance for date-range queries
  - Proven reliability for financial applications

- **Prisma ORM benefits**:
  - Type-safe database client generated from schema
  - Migration system for schema evolution
  - Intuitive query API with TypeScript autocomplete
  - Built-in connection pooling
  - Supports complex WHERE clauses for filtering (amount range, date range, category, description LIKE)

**Alternatives Considered**:
- SQLite: Rejected due to lack of native Decimal type, limited concurrent write support
- MongoDB: Rejected as NoSQL unnecessary for structured financial data, lacks foreign key constraints
- MySQL: Viable alternative, but PostgreSQL has better JSON support for future extensibility
- TypeORM: Rejected due to decorator-heavy syntax, less intuitive than Prisma
- Raw SQL queries: Rejected as error-prone, loses type safety (violates Principle V: Maintainability)

**Implementation Approach**:
```prisma
// Key schema patterns
model Transaction {
  id          String   @id @default(cuid())
  amount      Decimal  @db.Decimal(12, 2)  // Max 9,999,999,999.99
  date        DateTime @db.Date
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([date])           // Fast date-range queries
  @@index([categoryId])     // Fast category filtering
}
```

---

### 3. Styling Solution

**Research Question**: What CSS framework enables rapid UI development with responsive design and Vietnamese number formatting support?

**Decision**: Tailwind CSS 3.4 with custom configuration

**Rationale**:
- **Utility-first approach**: Rapid prototyping, no CSS file management overhead
- **Responsive design**: Mobile-first breakpoints (sm:, md:, lg:) for responsive dashboard
- **Consistent design system**: Pre-defined spacing, colors, typography scales
- **Small bundle size**: PurgeCSS removes unused styles in production
- **Customization**: Easy to add Vietnamese-specific utilities (number formatting, date formats)
- **No runtime overhead**: CSS-only, no JavaScript framework lock-in

**Alternatives Considered**:
- Bootstrap: Rejected as too opinionated, harder to customize, larger bundle size
- Material-UI (MUI): Rejected as overkill for simple CRUD app, increases bundle size significantly
- Vanilla CSS: Rejected as too time-consuming, hard to maintain consistency
- CSS Modules: Viable but more boilerplate than Tailwind utilities

**Implementation Approach**:
```javascript
// tailwind.config.ts - Vietnamese localization support
module.exports = {
  theme: {
    extend: {
      // Custom utilities for Vietnamese number formatting can be added via plugins
    }
  }
}
```
Use JavaScript formatters for Vietnamese conventions:
```typescript
// lib/formatters.ts
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount); // "1.000.000 ₫"
}
```

---

### 4. Form Validation and Type Safety

**Research Question**: How to ensure data validation across client/server boundary with type safety?

**Decision**: Zod schema validation library

**Rationale**:
- **Single source of truth**: Define schema once, use on client (React forms) and server (API routes)
- **TypeScript integration**: Infer types from schemas automatically
- **Runtime validation**: Catches invalid data at boundaries (API requests, form submissions)
- **Detailed error messages**: User-friendly validation errors for each field
- **Prisma integration**: Can validate before database operations

**Alternatives Considered**:
- Yup: Less TypeScript-friendly, weaker type inference
- Joi: Server-side only, no React integration
- Manual validation: Error-prone, duplicated logic, no type inference
- React Hook Form built-in validation: Too basic, lacks schema-level validation

**Implementation Approach**:
```typescript
// lib/validations.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive().multipleOf(0.01), // 2 decimal places
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().cuid(),
  date: z.date().max(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)), // Not > 1 year future
  description: z.string().max(500).optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
```

Use in API routes:
```typescript
// app/api/transactions/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const validated = transactionSchema.parse(body); // Throws if invalid
  // ... save to database
}
```

---

### 5. CSV Export Implementation

**Research Question**: How to generate CSV exports for 5,000+ records with proper encoding for Vietnamese characters and Excel compatibility?

**Decision**: Server-side CSV generation with UTF-8 BOM

**Rationale**:
- **Server-side processing**: Handles large datasets without client memory constraints
- **Streaming**: Can use Node.js streams for very large exports (future-proof)
- **UTF-8 BOM**: Makes Excel correctly detect UTF-8 encoding for Vietnamese characters
- **RFC 4180 compliance**: Proper escaping of commas, quotes, newlines in descriptions
- **Library choice**: `json2csv` or custom implementation (both viable)

**Alternatives Considered**:
- Client-side CSV generation: Rejected due to browser memory limits for large datasets
- Excel library (xlsx): Rejected as over-engineered, larger dependency, CSV sufficient per spec
- Tab-separated values (TSV): Less universal than CSV

**Implementation Approach**:
```typescript
// lib/csv-export.ts
import { Parser } from 'json2csv';

export function generateCSV(transactions: Transaction[]) {
  const fields = ['date', 'type', 'category', 'amount', 'description'];
  const opts = { fields, withBOM: true }; // UTF-8 BOM for Excel
  const parser = new Parser(opts);
  const csv = parser.parse(transactions);
  return csv;
}

// API route: app/api/transactions/export/route.ts
export async function GET(request: Request) {
  const transactions = await prisma.transaction.findMany(/* filters */);
  const csv = generateCSV(transactions);
  
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="transactions_${dateRange}.csv"`,
    },
  });
}
```

---

### 6. Date and Number Formatting for Vietnamese Locale

**Research Question**: How to properly display dates and numbers according to Vietnamese conventions?

**Decision**: Intl API with vi-VN locale

**Rationale**:
- **Native browser support**: No external dependencies
- **Consistent formatting**: Same API for dates and numbers
- **Locale-aware**: Automatically handles Vietnamese conventions:
  - Numbers: 1.000.000 (space as thousands separator)
  - Currency: 50.000 ₫ (VND symbol)
  - Dates: Can be formatted to DD/MM/YYYY for display

**Implementation Approach**:
```typescript
// lib/formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // VND typically doesn't show decimals
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date); // "17/12/2025"
};

// Store in ISO 8601 (YYYY-MM-DD) in database
// Display in DD/MM/YYYY in UI
```

---

### 7. Performance Optimization Strategy

**Research Question**: How to ensure <2 second dashboard load for 10,000 transactions?

**Decision**: Multi-layer optimization approach

**Rationale**:
- **Database level**:
  - Indexes on date and category columns (composite index possible)
  - LIMIT queries to date range only (don't load all 10K records)
  - Aggregation queries (SUM, GROUP BY) run on database, not in JavaScript
  
- **Next.js level**:
  - Server Components for dashboard (data fetched on server)
  - React cache() function to deduplicate requests
  - revalidate strategy for dashboard data (e.g., 60 seconds)
  
- **Application level**:
  - Pagination for transaction list (50 records per page)
  - Virtualized scrolling for large lists (future enhancement if needed)
  - Debounced search input (300ms delay) to reduce query frequency

**Benchmarking Plan**:
- Test with 10,000 seeded transactions
- Measure with Chrome DevTools Performance tab
- Target: Time to Interactive (TTI) < 2 seconds

**Implementation Approach**:
```typescript
// Database query optimization
const dashboard = await prisma.transaction.aggregate({
  where: {
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _sum: { amount: true },
  _count: true,
  by: ['type', 'categoryId'],
});

// Index in Prisma schema
@@index([date, categoryId]) // Composite index for date + category queries
```

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 15.x | Full-stack React framework with App Router |
| **Language** | TypeScript | 5.3+ | Type safety across frontend/backend |
| **UI Library** | React | 18.x | Component-based UI |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS framework |
| **Database** | PostgreSQL | 16+ | Relational database for transactions |
| **ORM** | Prisma | 5.x | Type-safe database access |
| **Validation** | Zod | 3.x | Schema validation (client + server) |
| **Testing** | Jest + RTL | Latest | Unit & integration tests |
| **E2E Testing** | Playwright | Latest | End-to-end browser tests |
| **CSV Export** | json2csv | 6.x | CSV generation with proper encoding |

## Resolved Clarifications

All items from Technical Context have been researched and resolved:

✅ **Language/Version**: TypeScript 5.3+ confirmed  
✅ **Primary Dependencies**: Next.js 15, Prisma, Tailwind documented  
✅ **Storage**: PostgreSQL chosen with rationale  
✅ **Testing**: Jest + Playwright strategy defined  
✅ **Performance Goals**: Optimization strategies documented  
✅ **Vietnamese Localization**: Intl API approach confirmed

## Next Steps

Proceed to **Phase 1: Design & Contracts**
- Generate data-model.md with Prisma schema
- Generate API contracts (OpenAPI-style documentation)
- Generate quickstart.md with development setup
