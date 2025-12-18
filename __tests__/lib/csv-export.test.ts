import { generateCSV, formatDate, formatAmount, escapeCSVField } from '@/lib/csv-export';

describe('csv-export', () => {
  describe('escapeCSVField', () => {
    it('should wrap fields with commas in quotes', () => {
      expect(escapeCSVField('Hello, World')).toBe('"Hello, World"');
    });

    it('should wrap fields with quotes in quotes and double internal quotes', () => {
      expect(escapeCSVField('Say "Hello"')).toBe('"Say ""Hello"""');
    });

    it('should wrap fields with newlines in quotes', () => {
      expect(escapeCSVField('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
    });

    it('should not wrap simple fields', () => {
      expect(escapeCSVField('Simple')).toBe('Simple');
    });

    it('should handle empty strings', () => {
      expect(escapeCSVField('')).toBe('');
    });

    it('should handle fields with multiple special characters', () => {
      expect(escapeCSVField('Say "Hello, World"\nNew line')).toBe('"Say ""Hello, World""\nNew line"');
    });
  });

  describe('formatDate', () => {
    it('should format date as DD/MM/YYYY', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should pad single digits', () => {
      const date = new Date('2024-03-05');
      expect(formatDate(date)).toBe('05/03/2024');
    });
  });

  describe('formatAmount', () => {
    it('should format amount with thousand separators', () => {
      expect(formatAmount(1000000)).toBe('1.000.000');
    });

    it('should handle zero', () => {
      expect(formatAmount(0)).toBe('0');
    });

    it('should handle negative amounts', () => {
      expect(formatAmount(-500000)).toBe('-500.000');
    });

    it('should handle decimals', () => {
      // Should round to nearest integer
      expect(formatAmount(1234.56)).toContain('1.235');
    });
  });

  describe('generateCSV', () => {
    const mockTransactions = [
      {
        id: '1',
        date: new Date('2024-01-15'),
        amount: 100000,
        type: 'EXPENSE' as const,
        description: 'Grocery shopping',
        category: {
          id: 'cat1',
          name: 'Food',
          type: 'EXPENSE' as const,
          createdAt: new Date(),
        },
        categoryId: 'cat1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        date: new Date('2024-01-16'),
        amount: 50000,
        type: 'EXPENSE' as const,
        description: 'Coffee, lunch',
        category: {
          id: 'cat1',
          name: 'Food',
          type: 'EXPENSE' as const,
          createdAt: new Date(),
        },
        categoryId: 'cat1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should include UTF-8 BOM', () => {
      const csv = generateCSV(mockTransactions);
      expect(csv.charCodeAt(0)).toBe(0xFEFF);
    });

    it('should include headers in Vietnamese', () => {
      const csv = generateCSV(mockTransactions);
      expect(csv).toContain('Ngày');
      expect(csv).toContain('Số tiền');
      expect(csv).toContain('Loại');
      expect(csv).toContain('Danh mục');
      expect(csv).toContain('Mô tả');
    });

    it('should include all transaction data', () => {
      const csv = generateCSV(mockTransactions);
      expect(csv).toContain('15/01/2024');
      expect(csv).toContain('100.000');
      expect(csv).toContain('Food');
      expect(csv).toContain('Grocery shopping');
    });

    it('should escape fields with commas', () => {
      const csv = generateCSV(mockTransactions);
      // "Coffee, lunch" should be wrapped in quotes
      expect(csv).toContain('"Coffee, lunch"');
    });

    it('should translate transaction types to Vietnamese', () => {
      const csv = generateCSV(mockTransactions);
      expect(csv).toContain('Chi tiêu');
    });

    it('should handle empty transaction list', () => {
      const csv = generateCSV([]);
      expect(csv).toContain('Ngày');
      expect(csv.split('\n').length).toBe(2); // Header + empty line
    });

    it('should handle income transactions', () => {
      const incomeTransactions = [
        {
          id: '3',
          date: new Date('2024-01-20'),
          amount: 5000000,
          type: 'INCOME' as const,
          description: 'Salary',
          category: {
            id: 'cat2',
            name: 'Salary',
            type: 'INCOME' as const,
            createdAt: new Date(),
          },
          categoryId: 'cat2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const csv = generateCSV(incomeTransactions);
      expect(csv).toContain('Thu nhập');
      expect(csv).toContain('5.000.000');
    });

    it('should handle transactions with special characters in description', () => {
      const specialTransactions = [
        {
          id: '4',
          date: new Date('2024-01-21'),
          amount: 200000,
          type: 'EXPENSE' as const,
          description: 'Mua đồ "đặc biệt"',
          category: {
            id: 'cat3',
            name: 'Shopping',
            type: 'EXPENSE' as const,
            createdAt: new Date(),
          },
          categoryId: 'cat3',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const csv = generateCSV(specialTransactions);
      // Should escape quotes properly
      expect(csv).toContain('""đặc biệt""');
    });

    it('should handle null descriptions', () => {
      const transactionsWithNull = [
        {
          id: '5',
          date: new Date('2024-01-22'),
          amount: 150000,
          type: 'EXPENSE' as const,
          description: null,
          category: {
            id: 'cat1',
            name: 'Food',
            type: 'EXPENSE' as const,
            createdAt: new Date(),
          },
          categoryId: 'cat1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const csv = generateCSV(transactionsWithNull as any);
      expect(csv).toContain('150.000');
      // Should not crash and handle null gracefully
      expect(csv.split('\n').length).toBeGreaterThan(1);
    });
  });
});
