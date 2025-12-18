interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 max-w-md mb-6">{description}</p>
      )}
      {action && (
        <a
          href={action.href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          ✨ {action.label}
        </a>
      )}
    </div>
  );
}

export function EmptyTransactionList() {
  return (
    <EmptyState
      icon="💸"
      title="Chưa có giao dịch nào"
      description="Bắt đầu theo dõi chi tiêu của bạn bằng cách thêm giao dịch đầu tiên!"
      action={{
        label: 'Thêm giao dịch đầu tiên',
        href: '/transactions/new',
      }}
    />
  );
}

export function EmptySearchResults() {
  return (
    <EmptyState
      icon="🔍"
      title="Không tìm thấy kết quả"
      description="Không có giao dịch nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh các tiêu chí tìm kiếm."
    />
  );
}

export function EmptyCategoryBreakdown() {
  return (
    <EmptyState
      icon="📊"
      title="Chưa có dữ liệu"
      description="Không có giao dịch nào trong khoảng thời gian này. Thêm giao dịch để xem phân tích chi tiết!"
    />
  );
}

export function EmptyCategoryList() {
  return (
    <EmptyState
      icon="📁"
      title="Chưa có danh mục nào"
      description="Tạo danh mục để phân loại giao dịch của bạn một cách dễ dàng hơn!"
      action={{
        label: 'Tạo danh mục đầu tiên',
        href: '/categories/new',
      }}
    />
  );
}
