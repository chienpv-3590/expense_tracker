import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { transactionSchema, filterSchema } from '@/lib/validations';

/**
 * GET /api/transactions - List transactions with filters and pagination
 * 
 * Query Parameters:
 * - type: 'income' | 'expense' (optional)
 * - categoryId: string (optional)
 * - startDate: ISO date string (optional)
 * - endDate: ISO date string (optional)
 * - search: string (optional) - searches description and category name
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * 
 * @returns JSON response with paginated transactions and category data
 * @example GET /api/transactions?type=expense&page=1&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const filterParams = filterSchema.parse({
      type: searchParams.get('type') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    });

    const { page, limit, type, categoryId, startDate, endDate, search } = filterParams;

    // Build where clause
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.transaction.count({ where });

    // Fetch transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        items: transactions.map(t => ({
          ...t,
          date: t.date.toISOString(),
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/transactions - Create new transaction
 * 
 * Request Body:
 * - amount: number (positive, max 2 decimal places)
 * - type: 'income' | 'expense'
 * - categoryId: string (must exist)
 * - date: ISO date string
 * - description: string (optional, max 500 chars)
 * 
 * Validations:
 * - Category must exist
 * - Checks for potential duplicates (same amount/category/date within 1 minute)
 * 
 * @returns JSON response with created transaction including category data
 * @example POST /api/transactions with body { amount: 50000, type: 'expense', categoryId: '...', date: '2025-12-18' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = transactionSchema.parse(body);

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Danh mục không tồn tại',
          code: 'CATEGORY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check for potential duplicate (same amount, category, date within 1 minute)
    const oneMinuteAgo = new Date(validatedData.date);
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    const oneMinuteLater = new Date(validatedData.date);
    oneMinuteLater.setMinutes(oneMinuteLater.getMinutes() + 1);

    const duplicateCheck = await prisma.transaction.findFirst({
      where: {
        amount: validatedData.amount,
        categoryId: validatedData.categoryId,
        date: {
          gte: oneMinuteAgo,
          lte: oneMinuteLater,
        },
      },
    });

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: validatedData.amount,
        type: validatedData.type,
        categoryId: validatedData.categoryId,
        date: validatedData.date,
        description: validatedData.description,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...transaction,
          date: transaction.date.toISOString(),
          createdAt: transaction.createdAt.toISOString(),
          updatedAt: transaction.updatedAt.toISOString(),
        },
        warning: duplicateCheck ? 'Giao dịch tương tự đã tồn tại' : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
