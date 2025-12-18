import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';
import { categorySchema } from '@/lib/validations';

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where = type ? { type } : {};

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = categorySchema.parse(body);

    // Create category
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
