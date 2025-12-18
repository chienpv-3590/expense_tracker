import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CategoryList } from '@/components/categories/CategoryList';
import { prisma } from '@/lib/prisma';

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // Convert Date to string for serialization
  const serializedCategories = categories.map(cat => ({
    ...cat,
    createdAt: cat.createdAt.toISOString(),
  }));

  return {
    success: true,
    data: serializedCategories,
  };
}

export default async function CategoriesPage() {
  const response = await getCategories();

  const incomeCount = response.success
    ? response.data.filter((c: any) => c.type === 'income').length
    : 0;
  const expenseCount = response.success
    ? response.data.filter((c: any) => c.type === 'expense').length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-black">Quản Lý Danh Mục</h1>
              <p className="text-sm text-gray-500 mt-1">
                Tổ chức và quản lý các danh mục giao dịch
              </p>
            </div>
            <Link href="/categories/new">
              <Button className="whitespace-nowrap">✨ Thêm Danh Mục</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {response.success && response.data.length > 0 && (
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-xs font-medium mb-1">Tổng danh mục</div>
                <div className="text-2xl font-bold text-gray-900">{response.data.length}</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-xs font-medium mb-1">💰 Thu nhập</div>
                <div className="text-2xl font-bold text-green-600">{incomeCount}</div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-xs font-medium mb-1">💸 Chi tiêu</div>
                <div className="text-2xl font-bold text-red-600">{expenseCount}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {response.success ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CategoryList categories={response.data} />
          </div>
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
            <p className="text-gray-700 font-medium">Không thể tải danh sách danh mục</p>
            <p className="text-gray-500 text-sm mt-1">Vui lòng thử lại sau</p>
          </div>
        )}
      </div>
    </div>
  );
}
