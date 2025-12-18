import { Category } from '@prisma/client';

export type { Category };

export type CategoryFormData = Omit<Category, 'id' | 'createdAt'>;

export type CategoryUpdateData = Partial<CategoryFormData>;
