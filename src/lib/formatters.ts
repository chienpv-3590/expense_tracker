/**
 * Format a number as Vietnamese currency (VND)
 * @param amount - The amount to format
 * @returns Formatted currency string like "1.000.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format a date for display in Vietnamese format
 * @param date - The date to format
 * @returns Formatted date string like "17/12/2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Format a date as ISO string for storage
 * @param date - The date to format
 * @returns ISO date string like "2025-12-17"
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Format a datetime for display in Vietnamese format
 * @param date - The datetime to format
 * @returns Formatted datetime string like "17/12/2025 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Parse a Vietnamese date string to Date object
 * @param dateStr - Date string in format "DD/MM/YYYY"
 * @returns Date object
 */
export function parseVietnameseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}
