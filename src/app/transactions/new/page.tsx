import { TransactionForm } from '@/components/transactions/TransactionForm';
import Link from 'next/link';

export default function NewTransactionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-black">Thêm Giao Dịch Mới</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TransactionForm mode="create" />
        </div>
      </div>
    </div>
  );
}
