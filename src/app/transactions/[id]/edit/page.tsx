import { notFound } from 'next/navigation';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  });
  
  const res = { ok: !!transaction, json: async () => ({ success: !!transaction, data: transaction }) };

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getTransaction(id);

  if (!response || !response.success) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-black">Chỉnh Sửa Giao Dịch</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TransactionForm mode="edit" initialData={response.data} />
        </div>
      </div>
    </div>
  );
}
