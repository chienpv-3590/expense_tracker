import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/categories/CategoryForm';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getCategory(id: string) {
  return await prisma.category.findUnique({
    where: { id },
  });
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
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
              id: category.id,
              name: category.name,
              type: category.type,
            }}
          />
        </div>
      </div>
    </div>
  );
}
