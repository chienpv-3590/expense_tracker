'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TransactionWithCategory } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface TransactionItemProps {
  transaction: TransactionWithCategory;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
        setIsDeleteModalOpen(false);
      } else {
        alert('Không thể xóa giao dịch');
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi xóa giao dịch');
    } finally {
      setIsDeleting(false);
    }
  };

  const typeColor = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';
  const amountBgColor = transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50';
  const typeBadge = transaction.type === 'income' 
    ? 'bg-green-100 text-green-800 border border-green-300' 
    : 'bg-red-100 text-red-800 border border-red-300';

  return (
    <>
      {/* Desktop table row */}
      <tr className="hidden md:table-row hover:bg-gray-50 transition-colors">
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {formatDate(transaction.date)}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md ${typeBadge}`}>
            {transaction.type === 'income' ? '💰 Thu' : '💸 Chi'}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="text-sm font-medium text-gray-900">{transaction.category.name}</span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${amountBgColor}`}>
            <span className={`text-sm font-bold ${typeColor}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
          </div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-600">
          <div className="truncate" title={transaction.description || undefined}>
            {transaction.description || <span className="text-gray-400 italic">Không có mô tả</span>}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right">
          <div className="flex justify-end gap-1.5">
            <Link href={`/transactions/${transaction.id}`}>
              <Button variant="secondary" className="text-xs px-2.5 py-1.5">
                👁️
              </Button>
            </Link>
            <Link href={`/transactions/${transaction.id}/edit`}>
              <Button variant="secondary" className="text-xs px-2.5 py-1.5">
                ✏️
              </Button>
            </Link>
            <Button
              variant="danger"
              className="text-xs px-2.5 py-1.5"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              🗑️
            </Button>
          </div>
        </td>
      </tr>

      {/* Mobile card view */}
      <div className="md:hidden">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1.5">
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md ${typeBadge} w-fit`}>
                {transaction.type === 'income' ? '💰 Thu nhập' : '💸 Chi tiêu'}
              </span>
              <span className="text-sm font-medium text-gray-900">{transaction.category.name}</span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg ${amountBgColor}`}>
              <div className={`text-lg font-bold ${typeColor}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="mr-1">📅</span>
            {formatDate(transaction.date)}
          </div>
          
          {transaction.description ? (
            <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-md border border-gray-200">
              📝 {transaction.description}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic mb-3">Không có mô tả</div>
          )}
          
          <div className="flex gap-2">
            <Link href={`/transactions/${transaction.id}`} className="flex-1">
              <Button variant="secondary" fullWidth className="text-sm">
                👁️ Xem
              </Button>
            </Link>
            <Link href={`/transactions/${transaction.id}/edit`} className="flex-1">
              <Button variant="secondary" fullWidth className="text-sm">
                ✏️ Sửa
              </Button>
            </Link>
            <Button
              variant="danger"
              className="text-sm px-4"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              🗑️
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa giao dịch này?</p>
        <p className="text-sm text-gray-500 mt-2">Hành động này không thể hoàn tác.</p>
      </Modal>
    </>
  );
}
