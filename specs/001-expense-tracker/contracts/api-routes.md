# API Routes Contract

**Feature**: Expense Tracker Application  
**Date**: 2025-12-17  
**Framework**: Next.js 15 App Router API Routes

## Overview

All API routes are server-side endpoints built with Next.js App Router convention. Routes follow RESTful principles with JSON request/response format.

**Base URL**: `/api/`  
**Content-Type**: `application/json` (except CSV export)  
**Error Format**: Standard JSON error response

## Global Error Response Format

All API routes use consistent error response structure:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {} // Optional additional context
  }
}
```

**HTTP Status Codes**:
- `200`: Success
- `201`: Created (POST requests)
- `400`: Bad Request (validation error)
- `404`: Not Found
- `409`: Conflict (e.g., unique constraint violation)
- `500`: Internal Server Error

---

## Transactions API

### `GET /api/transactions`

List and filter transactions with pagination.

**Query Parameters**:
```typescript
{
  page?: number;          // Page number (1-indexed), default: 1
  limit?: number;         // Records per page, default: 50, max: 100
  startDate?: string;     // ISO 8601 date (YYYY-MM-DD)
  endDate?: string;       // ISO 8601 date (YYYY-MM-DD)
  categoryId?: string;    // Filter by category ID
  type?: 'INCOME' | 'EXPENSE'; // Filter by type
  minAmount?: number;     // Minimum amount (inclusive)
  maxAmount?: number;     // Maximum amount (inclusive)
  search?: string;        // Search in description (case-insensitive)
}
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "clx1a2b3c4d5e6f7g8h9",
      "amount": "50000.00",
      "type": "EXPENSE",
      "categoryId": "clx9z8y7x6w5v4u3t2s1",
      "category": {
        "id": "clx9z8y7x6w5v4u3t2s1",
        "name": "Food",
        "type": "EXPENSE"
      },
      "date": "2025-12-17",
      "description": "Lunch at restaurant",
      "createdAt": "2025-12-17T10:30:00.000Z",
      "updatedAt": "2025-12-17T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234,
    "totalPages": 5
  }
}
```

**Error Responses**:
- `400`: Invalid query parameters (e.g., invalid date format)

---

### `POST /api/transactions`

Create a new transaction.

**Request Body**:
```json
{
  "amount": 50000,
  "type": "EXPENSE",
  "categoryId": "clx9z8y7x6w5v4u3t2s1",
  "date": "2025-12-17",
  "description": "Lunch at restaurant"  // Optional
}
```

**Validation Rules**:
- `amount`: Required, positive number, max 2 decimal places
- `type`: Required, must be "INCOME" or "EXPENSE"
- `categoryId`: Required, must exist in database
- `date`: Required, ISO 8601 format, not > 1 year future, not > 5 years past
- `description`: Optional, max 500 characters

**Response** (201 Created):
```json
{
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "amount": "50000.00",
    "type": "EXPENSE",
    "categoryId": "clx9z8y7x6w5v4u3t2s1",
    "category": {
      "id": "clx9z8y7x6w5v4u3t2s1",
      "name": "Food",
      "type": "EXPENSE"
    },
    "date": "2025-12-17",
    "description": "Lunch at restaurant",
    "createdAt": "2025-12-17T10:30:00.000Z",
    "updatedAt": "2025-12-17T10:30:00.000Z"
  },
  "warning": "Similar transaction found within last minute"  // Optional duplicate warning
}
```

**Error Responses**:
- `400`: Validation error (invalid amount, date, missing fields)
- `404`: Category not found

---

### `GET /api/transactions/[id]`

Get a single transaction by ID.

**Path Parameters**:
- `id`: Transaction ID (CUID)

**Response** (200 OK):
```json
{
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "amount": "50000.00",
    "type": "EXPENSE",
    "categoryId": "clx9z8y7x6w5v4u3t2s1",
    "category": {
      "id": "clx9z8y7x6w5v4u3t2s1",
      "name": "Food",
      "type": "EXPENSE"
    },
    "date": "2025-12-17",
    "description": "Lunch at restaurant",
    "createdAt": "2025-12-17T10:30:00.000Z",
    "updatedAt": "2025-12-17T10:30:00.000Z"
  }
}
```

**Error Responses**:
- `404`: Transaction not found

---

### `PUT /api/transactions/[id]`

Update an existing transaction (full update).

**Path Parameters**:
- `id`: Transaction ID (CUID)

**Request Body** (all fields required):
```json
{
  "amount": 45000,
  "type": "EXPENSE",
  "categoryId": "clx9z8y7x6w5v4u3t2s1",
  "date": "2025-12-17",
  "description": "Lunch at restaurant - updated"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "amount": "45000.00",
    "type": "EXPENSE",
    "categoryId": "clx9z8y7x6w5v4u3t2s1",
    "category": {
      "id": "clx9z8y7x6w5v4u3t2s1",
      "name": "Food",
      "type": "EXPENSE"
    },
    "date": "2025-12-17",
    "description": "Lunch at restaurant - updated",
    "createdAt": "2025-12-17T10:30:00.000Z",
    "updatedAt": "2025-12-17T11:15:00.000Z"
  }
}
```

**Error Responses**:
- `400`: Validation error
- `404`: Transaction not found

---

### `DELETE /api/transactions/[id]`

Delete a transaction.

**Path Parameters**:
- `id`: Transaction ID (CUID)

**Response** (200 OK):
```json
{
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "deleted": true
  }
}
```

**Error Responses**:
- `404`: Transaction not found

---

### `GET /api/transactions/export`

Export filtered transactions as CSV file.

**Query Parameters**: Same as `GET /api/transactions` (all filters apply)

**Response** (200 OK):
- **Content-Type**: `text/csv; charset=utf-8`
- **Content-Disposition**: `attachment; filename="transactions_[date_range].csv"`
- **UTF-8 BOM**: Included for Excel compatibility

**CSV Format**:
```csv
Date,Type,Category,Amount,Description
2025-12-17,EXPENSE,Food,50000.00,Lunch at restaurant
2025-12-16,INCOME,Salary,5000000.00,Monthly salary
```

**CSV Specifications**:
- Header row included
- Date format: YYYY-MM-DD (ISO 8601)
- Amount format: Decimal with 2 places (e.g., 50000.00)
- Description: Properly escaped (quotes, commas, newlines per RFC 4180)
- Empty descriptions: Empty string ""

**Filename Pattern**:
- All transactions: `transactions_all.csv`
- Date range: `transactions_2025-12-01_2025-12-31.csv`
- Category filter: `transactions_Food.csv`
- Combined: `transactions_Food_2025-12-01_2025-12-31.csv`

**Error Responses**:
- `400`: Invalid query parameters

---

### `GET /api/transactions/summary`

Get dashboard summary statistics for a date range.

**Query Parameters**:
```typescript
{
  startDate: string;   // Required, ISO 8601 (YYYY-MM-DD)
  endDate: string;     // Required, ISO 8601 (YYYY-MM-DD)
  granularity?: 'day' | 'week' | 'month'; // Optional, default: 'month'
}
```

**Response** (200 OK):
```json
{
  "data": {
    "period": {
      "startDate": "2025-12-01",
      "endDate": "2025-12-31",
      "granularity": "month"
    },
    "totals": {
      "income": "5000000.00",
      "expenses": "1500000.00",
      "balance": "3500000.00",
      "transactionCount": 45
    },
    "byCategory": [
      {
        "categoryId": "clx9z8y7x6w5v4u3t2s1",
        "categoryName": "Food",
        "categoryType": "EXPENSE",
        "total": "500000.00",
        "count": 15,
        "percentage": 33.33
      },
      {
        "categoryId": "clx8y7x6w5v4u3t2s1r0",
        "categoryName": "Transport",
        "categoryType": "EXPENSE",
        "total": "300000.00",
        "count": 10,
        "percentage": 20.00
      }
    ]
  }
}
```

**Error Responses**:
- `400`: Missing or invalid date parameters

---

## Categories API

### `GET /api/categories`

List all categories with optional transaction counts.

**Query Parameters**:
```typescript
{
  includeCounts?: boolean; // Include transaction count per category, default: false
}
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "clx9z8y7x6w5v4u3t2s1",
      "name": "Food",
      "type": "EXPENSE",
      "createdAt": "2025-12-01T00:00:00.000Z",
      "transactionCount": 15  // Only if includeCounts=true
    },
    {
      "id": "clx8y7x6w5v4u3t2s1r0",
      "name": "Salary",
      "type": "INCOME",
      "createdAt": "2025-12-01T00:00:00.000Z",
      "transactionCount": 1
    }
  ]
}
```

---

### `POST /api/categories`

Create a new custom category.

**Request Body**:
```json
{
  "name": "Gym Membership",
  "type": "EXPENSE"
}
```

**Validation Rules**:
- `name`: Required, 1-50 characters, must be unique
- `type`: Required, must be "INCOME", "EXPENSE", or "BOTH"

**Response** (201 Created):
```json
{
  "data": {
    "id": "clx7w6v5u4t3s2r1q0p9",
    "name": "Gym Membership",
    "type": "EXPENSE",
    "createdAt": "2025-12-17T12:00:00.000Z"
  }
}
```

**Error Responses**:
- `400`: Validation error (empty name, invalid type)
- `409`: Category name already exists

---

### `GET /api/categories/[id]`

Get a single category by ID.

**Path Parameters**:
- `id`: Category ID (CUID)

**Response** (200 OK):
```json
{
  "data": {
    "id": "clx9z8y7x6w5v4u3t2s1",
    "name": "Food",
    "type": "EXPENSE",
    "createdAt": "2025-12-01T00:00:00.000Z",
    "transactionCount": 15
  }
}
```

**Error Responses**:
- `404`: Category not found

---

### `PUT /api/categories/[id]`

Update a category (name and/or type).

**Path Parameters**:
- `id`: Category ID (CUID)

**Request Body**:
```json
{
  "name": "Groceries & Food",
  "type": "EXPENSE"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "clx9z8y7x6w5v4u3t2s1",
    "name": "Groceries & Food",
    "type": "EXPENSE",
    "createdAt": "2025-12-01T00:00:00.000Z"
  }
}
```

**Error Responses**:
- `400`: Validation error
- `404`: Category not found
- `409`: Name already exists (if renaming to duplicate name)

---

### `DELETE /api/categories/[id]`

Delete a category (only if no transactions reference it).

**Path Parameters**:
- `id`: Category ID (CUID)

**Response** (200 OK):
```json
{
  "data": {
    "id": "clx9z8y7x6w5v4u3t2s1",
    "deleted": true
  }
}
```

**Error Responses**:
- `404`: Category not found
- `409`: Cannot delete category with existing transactions

**Conflict Response Example**:
```json
{
  "error": {
    "message": "Cannot delete category with existing transactions",
    "code": "CATEGORY_IN_USE",
    "details": {
      "categoryId": "clx9z8y7x6w5v4u3t2s1",
      "transactionCount": 15,
      "suggestion": "Reassign transactions to another category before deleting"
    }
  }
}
```

---

## Request/Response Examples

### Creating a Transaction

**Request**:
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "type": "EXPENSE",
    "categoryId": "clx9z8y7x6w5v4u3t2s1",
    "date": "2025-12-17",
    "description": "Lunch at restaurant"
  }'
```

**Response**:
```json
{
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "amount": "50000.00",
    "type": "EXPENSE",
    "categoryId": "clx9z8y7x6w5v4u3t2s1",
    "category": {
      "id": "clx9z8y7x6w5v4u3t2s1",
      "name": "Food",
      "type": "EXPENSE"
    },
    "date": "2025-12-17",
    "description": "Lunch at restaurant",
    "createdAt": "2025-12-17T10:30:00.000Z",
    "updatedAt": "2025-12-17T10:30:00.000Z"
  }
}
```

---

### Filtering Transactions

**Request**:
```bash
curl "http://localhost:3000/api/transactions?startDate=2025-12-01&endDate=2025-12-31&categoryId=clx9z8y7x6w5v4u3t2s1&page=1&limit=50"
```

**Response**: List of transactions matching filters with pagination metadata.

---

### Exporting to CSV

**Request**:
```bash
curl "http://localhost:3000/api/transactions/export?startDate=2025-11-01&endDate=2025-11-30" \
  -o transactions_november.csv
```

**Response**: CSV file download with proper filename and UTF-8 BOM.

---

## Authentication & Authorization

**Current Version**: No authentication required (single-user application)

**Future Enhancement**: When multi-user support is added:
- Add `userId` field to transactions and categories
- Implement JWT or session-based authentication
- Filter all queries by authenticated user's ID
- Add `Authorization: Bearer <token>` header requirement

---

## Rate Limiting

**Current Version**: No rate limiting

**Future Enhancement**: Consider rate limiting for:
- CSV export endpoint (limit to 5 requests per minute per IP)
- POST/PUT/DELETE operations (limit to 100 requests per minute per IP)

---

## Validation Library

All API routes use **Zod** schemas for validation:

```typescript
// Example: src/lib/validations.ts
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive().multipleOf(0.01),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().cuid(),
  date: z.string().date(),
  description: z.string().max(500).optional(),
});
```

Validation errors return 400 status with detailed field-level errors:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "amount": ["Amount must be positive"],
      "date": ["Invalid date format"]
    }
  }
}
```

---

## Testing Contracts

All API routes should have integration tests verifying:
- ✅ Successful requests return expected data structure
- ✅ Validation errors return 400 with field details
- ✅ Not found errors return 404
- ✅ Conflict errors return 409 (e.g., duplicate category name)
- ✅ Pagination works correctly
- ✅ Filtering returns accurate subsets
- ✅ CSV export generates valid RFC 4180 format

Example test structure:
```typescript
// __tests__/integration/api/transactions.test.ts
describe('POST /api/transactions', () => {
  it('creates transaction with valid data', async () => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ /* valid data */ }),
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data).toHaveProperty('id');
  });

  it('returns 400 for invalid amount', async () => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ amount: -100, /* ... */ }),
    });
    expect(response.status).toBe(400);
  });
});
```
