import { Transaction } from '@prisma/client';

export type { Transaction };

export type TransactionWithCategory = Transaction & {
  category: {
    id: string;
    name: string;
    type: string;
  };
};

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

export type TransactionUpdateData = Partial<TransactionFormData>;

export type TransactionFilterParams = {
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};
