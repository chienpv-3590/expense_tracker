import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/categories/CategoryForm';
import Link from 'next/link';

async function getCategory(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/categories/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getCategory(id);

  if (!response || !response.success) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-black">Sửa Danh Mục</h1>
          <p className="text-sm text-gray-500 mt-1">Chỉnh sửa thông tin danh mục</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CategoryForm
            mode="edit"
            initialData={{
              id: response.data.id,
              name: response.data.name,
              type: response.data.type,
            }}
          />
        </div>
      </div>
    </div>
  );
}
