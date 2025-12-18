import { EmptyCategoryBreakdown } from '@/components/ui/EmptyState';

interface CategoryData {
  categoryId: string;
  categoryName: string;
  type: 'income' | 'expense';
  amount: number;
  count: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  categories: CategoryData[];
  totalIncome: number;
  totalExpenses: number;
}

export default function CategoryBreakdown({
  categories,
  totalIncome,
  totalExpenses,
}: CategoryBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const incomeCategories = categories.filter((cat) => cat.type === 'income');
  const expenseCategories = categories.filter((cat) => cat.type === 'expense');

  const CategorySection = ({
    title,
    items,
    total,
    colorClass,
  }: {
    title: string;
    items: CategoryData[];
    total: number;
    colorClass: string;
  }) => {
    if (items.length === 0) {
      return (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {items.map((category) => (
            <div key={category.categoryId} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{category.categoryName}</span>
                  <span className="text-xs text-gray-500 ml-2">({category.count} giao dịch)</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${colorClass}`}>
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    category.type === 'income' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Tổng cộng</span>
            <span className={`text-sm font-bold ${colorClass}`}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Phân tích theo danh mục</h2>

      {categories.length === 0 ? (
        <EmptyCategoryBreakdown />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Income Categories */}
          <CategorySection
            title="Thu nhập"
            items={incomeCategories}
            total={totalIncome}
            colorClass="text-green-600"
          />

          {/* Expense Categories */}
          <CategorySection
            title="Chi tiêu"
            items={expenseCategories}
            total={totalExpenses}
            colorClass="text-red-600"
          />
        </div>
      )}
    </div>
  );
}
