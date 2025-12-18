import {
  formatCurrency,
  formatDate,
} from '@/lib/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency in Vietnamese locale', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('1.000.000');
      expect(formatted).toContain('₫');
    });

    it('should handle negative amounts', () => {
      const formatted = formatCurrency(-100000);
      expect(formatted).toContain('-');
      expect(formatted).toContain('100.000');
    });

    it('should handle decimal amounts', () => {
      const formatted = formatCurrency(1234.56);
      expect(formatted).toContain('1.235');
    });

    it('should handle large amounts', () => {
      const formatted = formatCurrency(1000000000);
      expect(formatted).toContain('1.000.000.000');
    });
  });

  describe('formatDate', () => {
    it('should format date in DD/MM/YYYY format', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should handle single digit days and months', () => {
      const date = new Date('2024-03-05');
      expect(formatDate(date)).toBe('05/03/2024');
    });

    it('should accept Date objects', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should accept ISO strings', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
    });
  });


});
