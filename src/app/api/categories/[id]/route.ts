import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { categorySchema } from '@/lib/validations';

// GET /api/categories/[id] - Get single category with transaction count
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy danh mục',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        createdAt: category.createdAt.toISOString(),
        transactionCount: category._count.transactions,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy danh mục',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check for duplicate name (excluding current category)
    if (validatedData.name !== existingCategory.name) {
      const duplicateName = await prisma.category.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          {
            success: false,
            error: 'Tên danh mục đã tồn tại',
            code: 'DUPLICATE_NAME',
          },
          { status: 409 }
        );
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        type: validatedData.type,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedCategory,
        createdAt: updatedCategory.createdAt.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/categories/[id] - Delete category (only if no transactions)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if category exists and get transaction count
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy danh mục',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if category has transactions
    if (category._count.transactions > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Không thể xóa danh mục có ${category._count.transactions} giao dịch. Vui lòng chuyển các giao dịch sang danh mục khác trước.`,
          code: 'HAS_TRANSACTIONS',
          details: {
            transactionCount: category._count.transactions,
          },
        },
        { status: 409 }
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Đã xóa danh mục thành công',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
