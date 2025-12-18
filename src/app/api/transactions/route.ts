import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { transactionSchema, filterSchema } from '@/lib/validations';

// GET /api/transactions - List transactions with filters and pagination
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
        items: transactions,
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

// POST /api/transactions - Create new transaction
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
        data: transaction,
        warning: duplicateCheck ? 'Giao dịch tương tự đã tồn tại' : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
