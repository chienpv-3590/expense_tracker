interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}

export default function SummaryCards({
  totalIncome,
  totalExpenses,
  netBalance,
  transactionCount,
}: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Income Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Tổng thu nhập</h3>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </p>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Tổng chi tiêu</h3>
          <span className="text-2xl">💸</span>
        </div>
        <p className="text-2xl font-bold text-red-600">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* Net Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Số dư</h3>
          <span className="text-2xl">📊</span>
        </div>
        <p
          className={`text-2xl font-bold ${
            netBalance >= 0 ? 'text-blue-600' : 'text-red-600'
          }`}
        >
          {formatCurrency(netBalance)}
        </p>
      </div>

      {/* Transaction Count Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Số giao dịch</h3>
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{transactionCount}</p>
      </div>
    </div>
  );
}
