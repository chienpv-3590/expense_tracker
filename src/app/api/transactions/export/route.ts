import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCSV, generateCSVFilename } from '@/lib/csv-export';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build where clause from query params (same as transaction list)
    const where: any = {};

    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const search = searchParams.get('search');

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) {
        where.amount.gte = Number(minAmount);
      }
      if (maxAmount) {
        where.amount.lte = Number(maxAmount);
      }
    }

    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Fetch all matching transactions (no pagination limit for export)
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Check if any transactions found
    if (transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found to export' },
        { status: 404 }
      );
    }

    // Generate CSV content
    const csvContent = generateCSV(transactions);
    const filename = generateCSVFilename('transactions');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error exporting transactions:', error);
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}
