'use client';

import { TransactionWithCategory } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: TransactionWithCategory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function TransactionList({ transactions, pagination }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-300 mb-6">
          <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">📝 Chưa có giao dịch</h3>
        <p className="text-gray-500">Bắt đầu bằng cách thêm giao dịch đầu tiên của bạn</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-32">
                📅 Ngày
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-28">
                🏷️ Loại
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-36">
                📁 Danh mục
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-40">
                💵 Số tiền
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                📝 Mô tả
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider w-48">
                ⚙️ Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden p-4 space-y-3">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {/* Footer info */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Hiển thị <span className="font-semibold text-gray-900">{transactions.length}</span> giao
            dịch
          </span>
          <span className="text-gray-500">
            Tổng: <span className="font-semibold text-gray-900">{pagination.total}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
