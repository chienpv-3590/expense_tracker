import Link from 'next/link';
import { TransactionList } from '@/components/transactions/TransactionList';
import { Button } from '@/components/ui/Button';
import FilterBar from '@/components/transactions/FilterBar';
import ExportButton from '@/components/transactions/ExportButton';
import { prisma } from '@/lib/prisma';

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, type: true },
  });
  return categories;
}

async function getTransactions(searchParams: {
  page?: string;
  categoryId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  search?: string;
}) {
  const page = Number(searchParams.page) || 1;
  const limit = 20;

  // Build where clause
  const where: any = {};

  if (searchParams.categoryId) {
    where.categoryId = searchParams.categoryId;
  }

  if (searchParams.type) {
    where.type = searchParams.type;
  }

  if (searchParams.startDate || searchParams.endDate) {
    where.date = {};
    if (searchParams.startDate) {
      where.date.gte = new Date(searchParams.startDate);
    }
    if (searchParams.endDate) {
      const endDate = new Date(searchParams.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.date.lte = endDate;
    }
  }

  if (searchParams.minAmount || searchParams.maxAmount) {
    where.amount = {};
    if (searchParams.minAmount) {
      where.amount.gte = Number(searchParams.minAmount);
    }
    if (searchParams.maxAmount) {
      where.amount.lte = Number(searchParams.maxAmount);
    }
  }

  if (searchParams.search) {
    where.description = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    success: true,
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function TransactionsPage(props: {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const [response, categories] = await Promise.all([
    getTransactions(searchParams),
    getCategories(),
  ]);

  // Extract page for pagination UI
  const currentPage = response.data.page;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-black">Tất Cả Giao Dịch</h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý và theo dõi tất cả giao dịch của bạn
              </p>
            </div>
            <ExportButton 
              filters={{
                categoryId: searchParams.categoryId || '',
                type: searchParams.type || '',
                startDate: searchParams.startDate || '',
                endDate: searchParams.endDate || '',
                minAmount: searchParams.minAmount || '',
                maxAmount: searchParams.maxAmount || '',
                search: searchParams.search || '',
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {response.success && response.data.items.length > 0 && (
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-xs font-medium mb-1">Tổng giao dịch</div>
                <div className="text-2xl font-bold text-gray-900">{response.data.total}</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-xs font-medium mb-1">Trang hiện tại</div>
                <div className="text-2xl font-bold text-gray-900">{response.data.page} / {response.data.totalPages}</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-xs font-medium mb-1">Số lượng / trang</div>
                <div className="text-2xl font-bold text-gray-900">{response.data.items.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <FilterBar categories={categories} />

        {response.success ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <TransactionList
                transactions={response.data.items}
                pagination={response.data}
              />
            </div>

            {/* Pagination */}
            {response.data.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                {currentPage > 1 && (
                  <Link href={`/transactions?page=${currentPage - 1}`}>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      ← Trang trước
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-black text-white font-medium rounded-lg">
                    {currentPage}
                  </span>
                  <span className="text-gray-500">/</span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg border border-gray-300">
                    {response.data.totalPages}
                  </span>
                </div>
                {currentPage < response.data.totalPages && (
                  <Link href={`/transactions?page=${currentPage + 1}`}>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      Trang sau →
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Không thể tải danh sách giao dịch</p>
            <p className="text-gray-500 text-sm mt-1">Vui lòng thử lại sau</p>
          </div>
        )}
      </div>
    </div>
  );
}
