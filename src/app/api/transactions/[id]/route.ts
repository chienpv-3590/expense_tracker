import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, notFoundError } from '@/lib/errors';
import { transactionSchema } from '@/lib/validations';

// GET /api/transactions/[id] - Get single transaction
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
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

    if (!transaction) {
      throw notFoundError('Giao dịch');
    }

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        date: transaction.date.toISOString(),
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/transactions/[id] - Update transaction
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validatedData = transactionSchema.parse(body);

    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw notFoundError('Giao dịch');
    }

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

    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        date: transaction.date.toISOString(),
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      throw notFoundError('Giao dịch');
    }

    // Delete transaction
    await prisma.transaction.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Giao dịch đã được xóa thành công' },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
