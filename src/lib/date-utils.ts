export type Granularity = 'day' | 'week' | 'month';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  granularity: Granularity;
}

/**
 * Get the start of the week (Monday)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the week (Sunday)
 */
export function getEndOfWeek(date: Date): Date {
  const d = getStartOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get the start of the month
 */
export function getStartOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the month
 */
export function getEndOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get the start of the day
 */
export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the day
 */
export function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get date range based on granularity
 */
export function getDateRange(
  date: Date,
  granularity: Granularity
): DateRange {
  switch (granularity) {
    case 'day':
      return {
        startDate: getStartOfDay(date),
        endDate: getEndOfDay(date),
        granularity: 'day',
      };
    case 'week':
      return {
        startDate: getStartOfWeek(date),
        endDate: getEndOfWeek(date),
        granularity: 'week',
      };
    case 'month':
      return {
        startDate: getStartOfMonth(date),
        endDate: getEndOfMonth(date),
        granularity: 'month',
      };
  }
}

/**
 * Navigate to previous period
 */
export function getPreviousPeriod(
  date: Date,
  granularity: Granularity
): Date {
  const d = new Date(date);
  switch (granularity) {
    case 'day':
      d.setDate(d.getDate() - 1);
      break;
    case 'week':
      d.setDate(d.getDate() - 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() - 1);
      break;
  }
  return d;
}

/**
 * Navigate to next period
 */
export function getNextPeriod(date: Date, granularity: Granularity): Date {
  const d = new Date(date);
  switch (granularity) {
    case 'day':
      d.setDate(d.getDate() + 1);
      break;
    case 'week':
      d.setDate(d.getDate() + 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d;
}

/**
 * Format date range for display
 */
export function formatDateRange(
  startDate: Date,
  endDate: Date,
  granularity: Granularity
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  switch (granularity) {
    case 'day':
      return startDate.toLocaleDateString('vi-VN', options);
    case 'week': {
      const weekNum = getWeekNumber(startDate);
      return `Tuần ${weekNum}, ${startDate.getFullYear()}`;
    }
    case 'month':
      return startDate.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
      });
  }
}

/**
 * Get week number in year
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo;
}

/**
 * Format date to ISO string for API
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
