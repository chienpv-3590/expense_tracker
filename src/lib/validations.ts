import { z } from 'zod';

// Transaction validation schema
export const transactionSchema = z.object({
  amount: z
    .number()
    .positive('Số tiền phải lớn hơn 0')
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: 'Số tiền chỉ được có tối đa 2 chữ số thập phân',
    }),
  type: z.enum(['income', 'expense'], {
    required_error: 'Loại giao dịch là bắt buộc',
  }),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  date: z.coerce.date({
    required_error: 'Ngày giao dịch là bắt buộc',
    invalid_type_error: 'Ngày giao dịch không hợp lệ',
  }),
  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional()
    .nullable(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

// Category validation schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(50, 'Tên danh mục không được vượt quá 50 ký tự')
    .trim(),
  type: z.enum(['income', 'expense'], {
    required_error: 'Loại danh mục là bắt buộc',
  }),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Filter parameters validation schema
export const filterSchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  categoryId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type FilterParams = z.infer<typeof filterSchema>;
