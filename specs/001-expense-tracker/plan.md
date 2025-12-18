# Implementation Plan: Expense Tracker Application

**Branch**: `001-expense-tracker` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-expense-tracker/spec.md`

## Summary

Build a web-based expense tracking application enabling users to record income/expense transactions, categorize them, view time-based dashboard analytics (daily/weekly/monthly), and export data to CSV. The application will use Next.js 15 with App Router for full-stack development, Tailwind CSS for styling, and PostgreSQL for persistent data storage. Target performance: <2 second dashboard load for 10,000 transactions with efficient database queries and server-side rendering.

## Technical Context

**Language/Version**: TypeScript 5.3+ with Node.js 20 LTS  
**Primary Dependencies**: Next.js 15 (App Router), React 18, Tailwind CSS 3.4, Prisma ORM 5.x  
**Storage**: PostgreSQL 16+ (relational database for transactions and categories)  
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E)  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), responsive design for mobile  
**Project Type**: Web application (Next.js full-stack with App Router)  
**Performance Goals**: <2s dashboard load (10K transactions), <1s search/filter operations, <5s CSV export (5K records)  
**Constraints**: Server-side rendering for initial page loads, database query optimization with indexing, Vietnamese localization (number/date formats)  
**Scale/Scope**: Single-user application, ~10K transactions typical, 4-5 main pages, CRUD operations with filtering/export

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Data Accuracy & Integrity ✅ COMPLIANT

- ✅ Required fields enforced: Prisma schema validation for amount, date, type, category_id
- ✅ Decimal precision: Prisma Decimal type for amounts (2 decimal places)
- ✅ Date validation: ISO 8601 format with Prisma DateTime type
- ✅ Category validation: Foreign key constraints prevent invalid category references
- ✅ Explicit confirmations: UI confirmation dialogs for delete operations
- ✅ Audit trail: created_at, updated_at timestamps on all records

**Implementation**: Database schema with NOT NULL constraints, foreign keys, and check constraints for amount > 0.

### Principle II: Category-Based Organization ✅ COMPLIANT

- ✅ Default categories: Database seed script with 9 pre-populated categories
- ✅ Custom categories: CRUD API endpoints for category management
- ✅ Unique names: Prisma unique constraint on category.name field
- ✅ Type indicator: Category type enum (INCOME, EXPENSE, BOTH)
- ✅ Orphan prevention: Foreign key with onDelete: Restrict (prevent deletion if transactions exist)
- ✅ Efficient statistics: Database aggregation queries with GROUP BY category

**Implementation**: Category model with unique constraints, database-level referential integrity.

### Principle III: Flexible Time-Based Reporting ✅ COMPLIANT

- ✅ Time granularities: Server-side aggregation for daily/weekly/monthly views
- ✅ Date filtering: URL query parameters for date range with ISO format
- ✅ Accurate aggregations: SQL SUM() and GROUP BY with proper date functions
- ✅ Performance target: Database indexes on transaction.date for fast queries, LIMIT 10000 on aggregations
- ✅ Clear visualizations: Tailwind CSS responsive tables with percentage calculations

**Implementation**: Indexed date column, server-side data aggregation, React Server Components for initial load.

### Principle IV: Search, Filter & Export Capabilities ✅ COMPLIANT

- ✅ Multi-criteria search: Prisma where clauses with AND logic (description LIKE, amount range, date range, category)
- ✅ Combinable filters: URL query string parameters for filter state management
- ✅ CSV export: Server-side CSV generation with proper RFC 4180 formatting
- ✅ Special character handling: UTF-8 encoding with BOM for Excel compatibility
- ✅ Smart naming: File name includes date range/category from active filters
- ✅ Progress indication: React Suspense boundaries for export operations

**Implementation**: Prisma complex queries with filtering, server-side CSV streaming for large exports.

### Principle V: Simplicity & Maintainability ✅ COMPLIANT

- ✅ Standard libraries: Next.js built-in routing, Prisma ORM (industry standard), Tailwind (utility-first CSS)
- ✅ No premature optimization: Start with server-side pagination (50 records), optimize only if slow
- ✅ UI simplicity: Core transaction creation ≤3 clicks (New → Fill Form → Submit)
- ✅ Readable code: TypeScript strict mode, consistent naming conventions
- ✅ YAGNI: No charts/graphs (out of scope), no authentication (single-user)
- ✅ Technical debt tracking: Comments in code for future enhancements

**Implementation**: Next.js App Router convention-based routing, minimal custom abstractions.

**GATE STATUS**: ✅ **PASS** - All constitution principles have clear implementation strategies with no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-tracker/
├── plan.md              # This file (implementation plan)
├── research.md          # Technology research and decisions
├── data-model.md        # Database schema and entities
├── quickstart.md        # Development setup guide
├── contracts/           # API specifications
│   └── api-routes.md    # Next.js API route contracts
└── checklists/
    └── requirements.md  # Specification quality validation
```

### Source Code (repository root)

```text
expense-tracker/         # Next.js App Router structure
├── src/
│   ├── app/             # Next.js 15 App Router pages
│   │   ├── layout.tsx           # Root layout with Tailwind
│   │   ├── page.tsx             # Dashboard (home page)
│   │   ├── transactions/
│   │   │   ├── page.tsx         # Transaction list with filters
│   │   │   ├── new/
│   │   │   │   └── page.tsx     # Create transaction form
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # View transaction details
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit transaction form
│   │   ├── categories/
│   │   │   ├── page.tsx         # Category management
│   │   │   └── new/
│   │   │       └── page.tsx     # Create category form
│   │   └── api/                 # API routes (server-side)
│   │       ├── transactions/
│   │       │   ├── route.ts     # GET (list/filter), POST (create)
│   │       │   ├── [id]/
│   │       │   │   └── route.ts # GET, PUT, DELETE (single transaction)
│   │       │   └── export/
│   │       │       └── route.ts # GET (CSV export)
│   │       └── categories/
│   │           ├── route.ts     # GET, POST
│   │           └── [id]/
│   │               └── route.ts # PUT, DELETE
│   ├── components/      # React components
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── DatePicker.tsx
│   │   ├── forms/               # Form components
│   │   │   ├── TransactionForm.tsx
│   │   │   └── CategoryForm.tsx
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── CategoryBreakdown.tsx
│   │   │   └── TimeFilter.tsx
│   │   └── transactions/        # Transaction components
│   │       ├── TransactionList.tsx
│   │       ├── TransactionItem.tsx
│   │       └── FilterBar.tsx
│   ├── lib/             # Utility libraries
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── validations.ts       # Zod schemas for validation
│   │   ├── formatters.ts        # Date/number formatting (Vietnamese)
│   │   └── csv-export.ts        # CSV generation logic
│   ├── types/           # TypeScript type definitions
│   │   ├── transaction.ts
│   │   └── category.ts
│   └── constants/       # Constants and enums
│       └── categories.ts        # Default category seed data
├── prisma/
│   ├── schema.prisma    # Database schema (Transaction, Category models)
│   ├── migrations/      # Database migrations
│   └── seed.ts          # Seed script for default categories
├── public/              # Static assets
│   └── images/
├── __tests__/           # Test files
│   ├── unit/                    # Unit tests (components, utils)
│   ├── integration/             # Integration tests (API routes)
│   └── e2e/                     # End-to-end tests (Playwright)
├── .env.example         # Environment variables template
├── .env.local           # Local environment (DATABASE_URL)
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
├── jest.config.js       # Jest test configuration
└── playwright.config.ts # Playwright E2E test configuration
```

**Structure Decision**: Next.js 15 App Router structure chosen for:
- **Full-stack in single codebase**: API routes co-located with pages (no separate backend/frontend)
- **Server Components by default**: Improved performance for dashboard data loading
- **File-based routing**: Convention over configuration (app/ directory structure = URL routes)
- **Prisma ORM**: Type-safe database access with migrations for PostgreSQL
- **Colocation**: Components organized by feature domain (dashboard/, transactions/, categories/)

This structure eliminates the need for separate backend/frontend directories, keeping all code in a unified Next.js application.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected** - All complexity is justified and aligned with constitution principles. Using industry-standard tools (Next.js, Prisma, Tailwind) that promote simplicity and maintainability.
