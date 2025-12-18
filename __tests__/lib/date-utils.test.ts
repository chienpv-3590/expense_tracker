import {
  getDateRange,
  getPreviousPeriod,
  getNextPeriod,
  formatDateRange,
  getWeekNumber,
} from '@/lib/date-utils';

describe('date-utils', () => {
  describe('getDateRange', () => {
    it('should get day range', () => {
      const date = new Date('2024-01-15T12:00:00');
      const range = getDateRange(date, 'day');
      
      expect(range.startDate.toDateString()).toBe(new Date('2024-01-15T00:00:00').toDateString());
      expect(range.endDate.toDateString()).toBe(new Date('2024-01-15T23:59:59').toDateString());
    });

    it('should get week range (Monday to Sunday)', () => {
      const date = new Date('2024-01-15'); // Monday
      const range = getDateRange(date, 'week');
      
      // Week should start on Monday and end on Sunday
      expect(range.startDate.getDay()).toBe(1); // Monday
      expect(range.endDate.getDay()).toBe(0); // Sunday
    });

    it('should get month range', () => {
      const date = new Date('2024-01-15');
      const range = getDateRange(date, 'month');
      
      expect(range.startDate.getDate()).toBe(1);
      expect(range.endDate.getDate()).toBe(31); // January has 31 days
      expect(range.endDate.getMonth()).toBe(0); // Still January
    });

    it('should handle February in leap year', () => {
      const date = new Date('2024-02-15');
      const range = getDateRange(date, 'month');
      
      expect(range.endDate.getDate()).toBe(29); // 2024 is leap year
    });

    it('should handle February in non-leap year', () => {
      const date = new Date('2023-02-15');
      const range = getDateRange(date, 'month');
      
      expect(range.endDate.getDate()).toBe(28);
    });
  });

  describe('getPreviousPeriod', () => {
    it('should get previous day', () => {
      const date = new Date('2024-01-15');
      const prev = getPreviousPeriod(date, 'day');
      
      expect(prev.toDateString()).toBe(new Date('2024-01-14').toDateString());
    });

    it('should get previous week', () => {
      const date = new Date('2024-01-15');
      const prev = getPreviousPeriod(date, 'week');
      
      // Should be 7 days earlier
      const expected = new Date('2024-01-08');
      expect(prev.toDateString()).toBe(expected.toDateString());
    });

    it('should get previous month', () => {
      const date = new Date('2024-01-15');
      const prev = getPreviousPeriod(date, 'month');
      
      expect(prev.getMonth()).toBe(11); // December
      expect(prev.getFullYear()).toBe(2023);
    });

    it('should handle year boundary for month', () => {
      const date = new Date('2024-01-31');
      const prev = getPreviousPeriod(date, 'month');
      
      expect(prev.getMonth()).toBe(11); // December
      expect(prev.getFullYear()).toBe(2023);
    });
  });

  describe('getNextPeriod', () => {
    it('should get next day', () => {
      const date = new Date('2024-01-15');
      const next = getNextPeriod(date, 'day');
      
      expect(next.toDateString()).toBe(new Date('2024-01-16').toDateString());
    });

    it('should get next week', () => {
      const date = new Date('2024-01-15');
      const next = getNextPeriod(date, 'week');
      
      const expected = new Date('2024-01-22');
      expect(next.toDateString()).toBe(expected.toDateString());
    });

    it('should get next month', () => {
      const date = new Date('2024-01-15');
      const next = getNextPeriod(date, 'month');
      
      expect(next.getMonth()).toBe(1); // February
      expect(next.getFullYear()).toBe(2024);
    });

    it('should handle year boundary for month', () => {
      const date = new Date('2024-12-15');
      const next = getNextPeriod(date, 'month');
      
      expect(next.getMonth()).toBe(0); // January
      expect(next.getFullYear()).toBe(2025);
    });
  });

  describe('getWeekNumber', () => {
    it('should return correct week number', () => {
      const date = new Date('2024-01-15');
      const weekNum = getWeekNumber(date);
      
      expect(weekNum).toBeGreaterThan(0);
      expect(weekNum).toBeLessThanOrEqual(53);
    });

    it('should handle year start', () => {
      const date = new Date('2024-01-01');
      const weekNum = getWeekNumber(date);
      
      expect(weekNum).toBeGreaterThan(0);
    });

    it('should handle year end', () => {
      const date = new Date('2024-12-31');
      const weekNum = getWeekNumber(date);
      
      expect(weekNum).toBeGreaterThan(0);
    });
  });

  describe('formatDateRange', () => {
    it('should format date range in Vietnamese', () => {
      const start = new Date('2024-01-15');
      const end = new Date('2024-01-21');
      const formatted = formatDateRange(start, end, 'week');
      
      expect(formatted).toContain('Tuần');
    });

    it('should format day range', () => {
      const start = new Date('2024-01-15');
      const end = new Date('2024-01-15');
      const formatted = formatDateRange(start, end, 'day');
      
      expect(formatted).toContain('15');
      expect(formatted).toContain('Tháng 1');
    });

    it('should format month range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const formatted = formatDateRange(start, end, 'month');
      
      expect(formatted).toContain('Tháng 1');
      expect(formatted).toContain('2024');
    });
  });
});
