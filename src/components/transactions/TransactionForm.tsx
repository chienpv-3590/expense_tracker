'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { formatDateISO } from '@/lib/formatters';
import { Category } from '@/types/category';

interface TransactionFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    amount: number;
    type: string;
    categoryId: string;
    date: string;
    description?: string | null;
  };
}

export function TransactionForm({ mode, initialData }: TransactionFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: initialData?.amount?.toString() || '',
    type: initialData?.type || 'expense',
    categoryId: initialData?.categoryId || '',
    date: initialData?.date ? formatDateISO(new Date(initialData.date)) : formatDateISO(new Date()),
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        console.log('Categories fetched:', data);
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Filter categories by type
  const filteredCategories = categories.filter((cat) => cat.type === formData.type);
  console.log('Filtered categories:', filteredCategories, 'for type:', formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrors({});

    try {
      const url = mode === 'create' 
        ? '/api/transactions' 
        : `/api/transactions/${initialData?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          type: formData.type,
          categoryId: formData.categoryId,
          date: new Date(formData.date).toISOString(),
          description: formData.description || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          mode === 'create' 
            ? '✅ Tạo giao dịch thành công!' 
            : '✅ Cập nhật giao dịch thành công!'
        );
        router.push('/transactions');
        router.refresh();
      } else {
        toast.error(data.error || '❌ Đã xảy ra lỗi');
        setError(data.error || 'Đã xảy ra lỗi');
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        }
      }
    } catch (error) {
      toast.error('❌ Không thể kết nối đến máy chủ');
      setError('Không thể kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear category when type changes
    if (name === 'type') {
      setFormData((prev) => ({
        ...prev,
        categoryId: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-lg">
          <p className="font-medium">⚠️ Lỗi</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <Select
        label="Loại giao dịch"
        name="type"
        value={formData.type}
        onChange={handleChange}
        options={[
          { value: 'income', label: '💰 Thu nhập' },
          { value: 'expense', label: '💸 Chi tiêu' },
        ]}
        error={errors.type}
        required
      />

      <Select
        label="Danh mục"
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        options={filteredCategories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))}
        placeholder="-- Chọn danh mục --"
        error={errors.categoryId}
        required
      />
      {filteredCategories.length === 0 && (
        <p className="text-sm text-gray-600 -mt-4">Không có danh mục {formData.type === 'income' ? 'thu nhập' : 'chi tiêu'}</p>
      )}

      <Input
        label="Số tiền (₫)"
        name="amount"
        type="number"
        step="0.01"
        min="0"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
        placeholder="Ví dụ: 50000"
        required
      />

      <DatePicker
        label="Ngày giao dịch"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
          Mô tả (tùy chọn)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange as any}
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900 placeholder-gray-500"
          placeholder="Thêm mô tả cho giao dịch..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-gray-700">{errors.description}</p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          fullWidth
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading} fullWidth>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              Đang lưu...
            </span>
          ) : (
            mode === 'create' ? 'Tạo giao dịch' : 'Cập nhật'
          )}
        </Button>
      </div>
    </form>
  );
}
