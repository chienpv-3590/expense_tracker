import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set end date to end of day
    end.setHours(23, 59, 59, 999);

    // Validate date range
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json(
        { error: 'startDate cannot be after endDate' },
        { status: 400 }
      );
    }

    // Fetch all transactions in date range
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionCount = 0;

    // Group by category
    const categoryMap = new Map<string, {
      categoryId: string;
      categoryName: string;
      type: 'income' | 'expense';
      amount: number;
      count: number;
    }>();

    transactions.forEach((transaction) => {
      transactionCount++;
      const amount = Number(transaction.amount);

      if (transaction.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
      }

      // Group by category
      const key = transaction.categoryId;
      if (categoryMap.has(key)) {
        const existing = categoryMap.get(key)!;
        existing.amount += amount;
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          categoryId: transaction.categoryId,
          categoryName: transaction.category.name,
          type: transaction.type as 'income' | 'expense',
          amount: amount,
          count: 1,
        });
      }
    });

    // Calculate net balance
    const netBalance = totalIncome - totalExpenses;

    // Convert category map to array and calculate percentages
    const byCategory = Array.from(categoryMap.values()).map((cat) => {
      const total = cat.type === 'income' ? totalIncome : totalExpenses;
      const percentage = total > 0 ? (cat.amount / total) * 100 : 0;
      
      return {
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        type: cat.type,
        amount: cat.amount,
        count: cat.count,
        percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
      };
    });

    // Sort by amount descending
    byCategory.sort((a, b) => b.amount - a.amount);

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        transactionCount,
      },
      byCategory,
      dateRange: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction summary' },
      { status: 500 }
    );
  }
}
