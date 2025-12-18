import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Dữ liệu không hợp lệ',
        code: 'VALIDATION_ERROR',
        details: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'Dữ liệu đã tồn tại',
          code: 'DUPLICATE_ERROR',
        },
        { status: 409 }
      );
    }

    // Foreign key constraint violation
    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          success: false,
          error: 'Tham chiếu không hợp lệ',
          code: 'FOREIGN_KEY_ERROR',
        },
        { status: 400 }
      );
    }

    // Record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy dữ liệu',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }
  }

  // Default error
  return NextResponse.json(
    {
      success: false,
      error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

export function notFoundError(resource: string): AppError {
  return new AppError(`${resource} không tồn tại`, 404, 'NOT_FOUND');
}

export function badRequestError(message: string): AppError {
  return new AppError(message, 400, 'BAD_REQUEST');
}

export function forbiddenError(message: string = 'Không có quyền truy cập'): AppError {
  return new AppError(message, 403, 'FORBIDDEN');
}
