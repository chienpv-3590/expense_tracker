import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { DeleteTransactionButton } from '@/components/transactions/DeleteTransactionButton';

async function getTransaction(id: string) {
  return await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  });
}

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await getTransaction(id);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/transactions"
            className="text-sm text-gray-600 hover:text-black mb-2 inline-block"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold text-black">Chi Tiết Giao Dịch</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Transaction Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Loại giao dịch
                </label>
                <span
                  className={`inline-flex px-3 py-1.5 text-sm font-medium rounded border ${
                    transaction.type === 'income'
                      ? 'bg-gray-100 text-gray-900 border-gray-300'
                      : 'bg-gray-200 text-gray-900 border-gray-400'
                  }`}
                >
                  {transaction.type === 'income' ? '💰 Thu nhập' : '💸 Chi tiêu'}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Danh mục</label>
                <p className="text-lg font-semibold text-gray-900">{transaction.category.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Số tiền</label>
                <p className="text-2xl font-bold text-black">
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Ngày giao dịch
                </label>
                <p className="text-lg text-gray-900">{formatDate(transaction.date)}</p>
              </div>

              {transaction.description && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Mô tả</label>
                  <p className="text-gray-900">{transaction.description}</p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                <label className="font-medium block mb-1">Ngày tạo</label>
                <p>{new Date(transaction.createdAt).toLocaleString('vi-VN')}</p>
              </div>

              {transaction.updatedAt && transaction.createdAt !== transaction.updatedAt && (
                <div className="text-sm text-gray-500">
                  <label className="font-medium block mb-1">Cập nhật lần cuối</label>
                  <p>{new Date(transaction.updatedAt).toLocaleString('vi-VN')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
            <Link href={`/transactions/${transaction.id}/edit`} className="flex-1">
              <Button variant="secondary" fullWidth>
                ✏️ Chỉnh sửa
              </Button>
            </Link>
            <div className="flex-1">
              <DeleteTransactionButton transaction={transaction} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
