# Data Model: Expense Tracker

**Feature**: Expense Tracker Application  
**Date**: 2025-12-17  
**Database**: PostgreSQL 16+ with Prisma ORM

## Overview

The data model consists of two core entities: **Transaction** and **Category**. Transactions represent individual income or expense records, while Categories provide classification for spending analysis.

## Entity Relationship Diagram

```
┌──────────────────────┐          ┌──────────────────────┐
│      Category        │          │    Transaction       │
├──────────────────────┤          ├──────────────────────┤
│ id (PK)              │◄────────┐│ id (PK)              │
│ name (unique)        │         ││ amount               │
│ type (enum)          │         ││ type (enum)          │
│ createdAt            │         └│ categoryId (FK)      │
└──────────────────────┘          │ date                 │
                                  │ description          │
   1                              │ createdAt            │
   │                              │ updatedAt            │
   │ has many                     └──────────────────────┘
   │
   └───────────────────────────── many : 1
           (Category.id → Transaction.categoryId)
```

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enumerations
enum TransactionType {
  INCOME
  EXPENSE
}

enum CategoryType {
  INCOME
  EXPENSE
  BOTH
}

// Entities
model Category {
  id           String        @id @default(cuid())
  name         String        @unique @db.VarChar(50)
  type         CategoryType
  createdAt    DateTime      @default(now())
  
  // Relations
  transactions Transaction[]
  
  @@map("categories")
}

model Transaction {
  id          String          @id @default(cuid())
  amount      Decimal         @db.Decimal(12, 2)  // Max: 9,999,999,999.99
  type        TransactionType
  categoryId  String
  date        DateTime        @db.Date
  description String?         @db.VarChar(500)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  // Relations
  category    Category        @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  
  // Indexes for performance
  @@index([date])                    // Fast date-range queries
  @@index([categoryId])              // Fast category filtering
  @@index([date, categoryId])        // Composite index for combined filters
  
  @@map("transactions")
}
```

## Entity Specifications

### Category

**Purpose**: Classify transactions into meaningful spending/income categories for analysis and reporting.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY, NOT NULL | Unique identifier |
| `name` | String | UNIQUE, NOT NULL, Max 50 chars | Category display name (e.g., "Food", "Salary") |
| `type` | CategoryType Enum | NOT NULL | Category classification: INCOME, EXPENSE, or BOTH |
| `createdAt` | DateTime | NOT NULL, Default: now() | Timestamp of category creation |

**Business Rules**:
- Category name MUST be unique across all categories
- Category name length: 1-50 characters
- Category type determines which transaction types can use it:
  - `INCOME`: Only income transactions
  - `EXPENSE`: Only expense transactions
  - `BOTH`: Either income or expense transactions
- Category CANNOT be deleted if it has associated transactions (enforced by onDelete: Restrict)
- User attempting deletion must reassign transactions to another category first

**Default Categories** (seeded on first database setup):
```typescript
// prisma/seed.ts
const defaultCategories = [
  { name: 'Food', type: 'EXPENSE' },
  { name: 'Transport', type: 'EXPENSE' },
  { name: 'Entertainment', type: 'EXPENSE' },
  { name: 'Bills', type: 'EXPENSE' },
  { name: 'Shopping', type: 'EXPENSE' },
  { name: 'Healthcare', type: 'EXPENSE' },
  { name: 'Salary', type: 'INCOME' },
  { name: 'Other Income', type: 'INCOME' },
  { name: 'Other Expense', type: 'EXPENSE' },
];
```

---

### Transaction

**Purpose**: Record individual financial transactions (income or expenses) with precise amount, date, and categorization.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY, NOT NULL | Unique identifier |
| `amount` | Decimal(12,2) | NOT NULL, CHECK (amount > 0) | Transaction amount with 2 decimal precision |
| `type` | TransactionType Enum | NOT NULL | Transaction classification: INCOME or EXPENSE |
| `categoryId` | String (CUID) | FOREIGN KEY, NOT NULL | Reference to Category.id |
| `date` | Date | NOT NULL | Transaction date (no time component) |
| `description` | String | NULLABLE, Max 500 chars | Optional transaction notes/memo |
| `createdAt` | DateTime | NOT NULL, Default: now() | Record creation timestamp |
| `updatedAt` | DateTime | NOT NULL, Auto-update | Last modification timestamp |

**Business Rules**:
- Amount MUST be positive (> 0)
- Amount precision: exactly 2 decimal places (e.g., 50000.00)
- Amount maximum: 9,999,999,999.99 (nearly 10 billion)
- Date MUST be valid and not more than 5 years in past or 1 year in future (validated at application level)
- Date stored in ISO 8601 format (YYYY-MM-DD) without timezone
- Description is optional, max 500 characters
- Category MUST exist (enforced by foreign key)
- Transaction type SHOULD match category type (validated at application level, not database level)
- Soft validation: Warn user if creating duplicate transaction (same amount, category, date within 1 minute)

**Indexes**:
- `date`: Single-column index for fast date-range queries (dashboard, filters)
- `categoryId`: Single-column index for category-based filtering
- `(date, categoryId)`: Composite index for combined date + category filters (most common dashboard query)

**Audit Trail**:
- `createdAt`: Immutable timestamp of when transaction was created
- `updatedAt`: Automatically updated by Prisma on every modification

---

## Relationships

### Category → Transaction (One-to-Many)

- **Cardinality**: One Category can have many (0-∞) Transactions
- **Foreign Key**: Transaction.categoryId → Category.id
- **Delete Behavior**: `onDelete: Restrict` (prevents category deletion if transactions exist)
- **Referential Integrity**: Enforced at database level

**Implications**:
- Every Transaction MUST belong to exactly one Category
- Categories with no transactions can be deleted freely
- Attempting to delete a Category with transactions will throw a database error
- Application layer must handle deletion by:
  1. Checking if category has transactions
  2. If yes, prompt user to reassign transactions to another category
  3. If no, proceed with deletion

---

## Query Patterns

### Common Queries (Prisma Examples)

**1. Dashboard Summary (Monthly)**
```typescript
const startDate = new Date('2025-12-01');
const endDate = new Date('2025-12-31');

const summary = await prisma.transaction.aggregate({
  where: {
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _sum: {
    amount: true,
  },
  _count: true,
});

// Group by category for breakdown
const byCategory = await prisma.transaction.groupBy({
  by: ['categoryId', 'type'],
  where: {
    date: { gte: startDate, lte: endDate },
  },
  _sum: {
    amount: true,
  },
  _count: true,
});
```

**2. Filtered Transaction List**
```typescript
const transactions = await prisma.transaction.findMany({
  where: {
    AND: [
      { date: { gte: startDate, lte: endDate } },
      { categoryId: categoryFilter },
      { amount: { gte: minAmount, lte: maxAmount } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ],
  },
  include: {
    category: true, // Include category details
  },
  orderBy: {
    date: 'desc',
  },
  take: 50, // Pagination
  skip: page * 50,
});
```

**3. Category with Transaction Count**
```typescript
const categories = await prisma.category.findMany({
  include: {
    _count: {
      select: { transactions: true },
    },
  },
});
```

**4. CSV Export Data**
```typescript
const exportData = await prisma.transaction.findMany({
  where: { /* filters */ },
  include: {
    category: {
      select: { name: true },
    },
  },
  orderBy: {
    date: 'desc',
  },
});

// Transform for CSV
const csvData = exportData.map(t => ({
  date: t.date.toISOString().split('T')[0],
  type: t.type,
  category: t.category.name,
  amount: t.amount.toFixed(2),
  description: t.description || '',
}));
```

---

## Validation Rules Summary

### Database Level (Enforced by PostgreSQL + Prisma)
- ✅ NOT NULL constraints on required fields
- ✅ UNIQUE constraint on category.name
- ✅ Foreign key integrity (categoryId references category.id)
- ✅ Decimal precision (12 digits, 2 decimal places)
- ✅ Check constraint: amount > 0
- ✅ onDelete: Restrict (prevent orphaned transactions)

### Application Level (Enforced by Zod + Business Logic)
- ✅ Date range validation (not > 1 year in future, not > 5 years in past)
- ✅ Transaction type matches category type compatibility
- ✅ Description max length: 500 characters
- ✅ Category name max length: 50 characters
- ✅ Duplicate transaction warning (same amount, category, date within 1 minute)

---

## Migration Strategy

**Initial Migration** (creates tables):
```sql
-- Generated by Prisma Migrate

CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE', 'BOTH');

CREATE TABLE "categories" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(50) UNIQUE NOT NULL,
  "type" "CategoryType" NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "transactions" (
  "id" TEXT PRIMARY KEY,
  "amount" DECIMAL(12,2) NOT NULL CHECK ("amount" > 0),
  "type" "TransactionType" NOT NULL,
  "categoryId" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "description" VARCHAR(500),
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT
);

CREATE INDEX "transactions_date_idx" ON "transactions"("date");
CREATE INDEX "transactions_categoryId_idx" ON "transactions"("categoryId");
CREATE INDEX "transactions_date_categoryId_idx" ON "transactions"("date", "categoryId");
```

**Seed Data** (default categories):
```bash
npx prisma db seed
```

---

## Performance Considerations

### Index Strategy
- **Single-column indexes**: Fast for single-dimension queries (date-only filter, category-only filter)
- **Composite index**: Optimized for most common dashboard query (date range + category breakdown)
- **Trade-off**: Indexes speed up reads but slightly slow down writes (acceptable for this use case)

### Expected Query Performance (10,000 transactions)
- Dashboard summary (date range + aggregation): ~50-100ms
- Filtered list (50 records with pagination): ~20-50ms
- Category list with counts: ~10-30ms
- CSV export (5,000 records): ~500-1000ms

### Scalability Notes
- Current schema handles up to ~10 million transactions before performance degradation
- For larger datasets, consider:
  - Partitioning transactions table by date range
  - Materialized views for dashboard aggregations
  - Archive old transactions (> 5 years) to separate table

---

## Future Enhancements (Out of Scope)

These are **not included** in the current implementation but documented for future reference:

1. **Budget Tracking**: Add `Budget` entity with monthly limits per category
2. **Recurring Transactions**: Add `RecurringTransaction` entity with schedule rules
3. **Attachments**: Add `Attachment` entity for receipt images (file storage required)
4. **Tags**: Many-to-many relationship for multiple tags per transaction
5. **Multi-Currency**: Add currency field, exchange rates table
6. **User Accounts**: Add `User` entity with authentication (if multi-user support added)

---

## TypeScript Types (Generated by Prisma)

```typescript
// Auto-generated by Prisma Client

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  createdAt: Date;
};

export type Transaction = {
  id: string;
  amount: Decimal;
  type: TransactionType;
  categoryId: string;
  date: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  BOTH = 'BOTH',
}
```

These types are used throughout the application for type safety.
