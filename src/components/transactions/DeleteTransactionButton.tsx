'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface DeleteTransactionButtonProps {
  transaction: {
    id: string;
    amount: number;
    type: string;
    date: string;
    description?: string | null;
    category: {
      name: string;
    };
  };
  fullWidth?: boolean;
}

export function DeleteTransactionButton({ 
  transaction, 
  fullWidth = false 
}: DeleteTransactionButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        router.push('/transactions');
        router.refresh();
      } else {
        setError(data.error || 'Không thể xóa giao dịch');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xóa giao dịch');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setIsModalOpen(true)}
        fullWidth={fullWidth}
      >
        🗑️ Xóa
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isDeleting && setIsModalOpen(false)}
        title="⚠️ Xác nhận xóa giao dịch"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete} 
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa giao dịch'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-900">
            Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác.
          </p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loại:</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Danh mục:</span>
                <span className="text-sm font-medium text-gray-900">
                  {transaction.category.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số tiền:</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ngày:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(transaction.date)}
                </span>
              </div>
              {transaction.description && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Mô tả:</span>
                  <p className="text-sm text-gray-900">{transaction.description}</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-lg">
              <p className="font-medium">Lỗi</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
