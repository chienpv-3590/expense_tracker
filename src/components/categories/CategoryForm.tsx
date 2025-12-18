'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    name: string;
    type: string;
  };
}

export function CategoryForm({ mode, initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'expense',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrors({});

    try {
      const url = mode === 'create' 
        ? '/api/categories' 
        : `/api/categories/${initialData?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/categories');
        router.refresh();
      } else {
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-gray-100 border border-gray-300 text-gray-900 px-4 py-3 rounded-lg">
          <p className="font-medium">⚠️ Lỗi</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <Input
        label="Tên danh mục"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Ví dụ: Ăn uống, Đi lại, Lương"
        maxLength={50}
        required
      />

      <Select
        label="Loại danh mục"
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

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          fullWidth
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading} fullWidth>
          {isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo danh mục' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  );
}
