'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface Category {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // First 9 categories are default (seeded)
  const defaultCategoryIds = categories.slice(0, 9).map(c => c.id);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setDeletingId(null);
        router.refresh();
      } else {
        setDeleteError(data.error || 'Không thể xóa danh mục');
      }
    } catch (error) {
      setDeleteError('Đã xảy ra lỗi khi xóa danh mục');
    } finally {
      setIsDeleting(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có danh mục</h3>
        <p className="text-gray-500">Thêm danh mục đầu tiên của bạn</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                📝 Tên Danh Mục
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-36">
                🏷️ Loại
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-36">
                ⚙️ Trạng Thái
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider w-40">
                🗑️ Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => {
              const isDefault = defaultCategoryIds.includes(category.id);
              const typeBadge = category.type === 'income'
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300';
              
              return (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                      {isDefault && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-gray-900 text-white rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border ${typeBadge}`}>
                      {category.type === 'income' ? '💰 Thu nhập' : '💸 Chi tiêu'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {isDefault ? '🔒 Hệ thống' : '✏️ Tùy chỉnh'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/categories/${category.id}/edit`}>
                        <Button
                          variant="secondary"
                          className="text-xs px-2.5 py-1.5"
                        >
                          ✏️
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="text-xs px-2.5 py-1.5"
                        onClick={() => setDeletingId(category.id)}
                        disabled={isDefault}
                        title={isDefault ? 'Không thể xóa danh mục mặc định' : 'Xóa danh mục'}
                      >
                        {isDefault ? '🔒' : '🗑️'}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-3">
        {categories.map((category) => {
          const isDefault = defaultCategoryIds.includes(category.id);
          const typeBadge = category.type === 'income'
            ? 'bg-green-100 text-green-800 border-green-300'
            : 'bg-red-100 text-red-800 border-red-300';
          
          return (
            <div key={category.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      {category.name}
                    </h3>
                    {isDefault && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-gray-900 text-white rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border ${typeBadge}`}>
                    {category.type === 'income' ? '💰 Thu nhập' : '💸 Chi tiêu'}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                <Link href={`/categories/${category.id}/edit`} className="flex-1">
                  <Button
                    variant="secondary"
                    className="text-sm w-full"
                  >
                    ✏️ Sửa
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="text-sm px-4"
                  onClick={() => setDeletingId(category.id)}
                  disabled={isDefault}
                >
                  {isDefault ? '🔒' : '🗑️'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <Modal
          isOpen={true}
          onClose={() => !isDeleting && setDeletingId(null)}
          title="⚠️ Xác nhận xóa danh mục"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(deletingId)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa danh mục'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-900">
              Bạn có chắc chắn muốn xóa danh mục này?
            </p>
            <p className="text-sm text-gray-600">
              ⚠️ Lưu ý: Bạn chỉ có thể xóa danh mục nếu không có giao dịch nào sử dụng danh mục này.
            </p>

            {deleteError && (
              <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-lg">
                <p className="font-medium">Lỗi</p>
                <p className="text-sm mt-1">{deleteError}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
