import { Transaction, Category } from '@prisma/client';

/**
 * Transaction with populated category relationship
 * Used for CSV export to include category name
 */
interface TransactionWithCategory extends Transaction {
  category: Category;
}

/**
 * CSV row structure with Vietnamese headers
 * Maps to: Date, Type, Category, Amount, Description
 */
export interface CSVRow {
  Ngày: string;
  Loại: string;
  'Danh mục': string;
  'Số tiền (₫)': string;
  'Mô tả': string;
}

/**
 * Format date to Vietnamese format: DD/MM/YYYY
 * 
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "18/12/2025")
 * @example
 * formatDate(new Date('2025-12-18')) // "18/12/2025"
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format amount to Vietnamese currency format with thousand separators
 * 
 * @param amount - Numeric amount to format
 * @returns Formatted string (e.g., "1.000.000" for 1 million)
 * @example
 * formatAmount(1234567) // "1.234.567"
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/**
 * Escape CSV field value to handle special characters
 * Follows RFC 4180 standard for CSV formatting
 * - Wraps fields with commas, quotes, or newlines in double quotes
 * - Escapes internal quotes by doubling them
 * 
 * @param value - Field value to escape
 * @returns Escaped CSV field
 * @example
 * escapeCSVField('Hello, World') // '"Hello, World"'
 * escapeCSVField('Say "Hi"') // '"Say ""Hi"""'
 */
export function escapeCSVField(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Convert transactions to CSV format with UTF-8 BOM for Excel compatibility
 * Includes Vietnamese headers: Ngày, Loại, Danh mục, Số tiền (₫), Mô tả
 * 
 * @param transactions - Array of transactions with category data
 * @returns CSV string with BOM, ready for download
 * @example
 * const csv = generateCSV(transactions);
 * const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
 */
export function generateCSV(transactions: TransactionWithCategory[]): string {
  // UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';

  // CSV Header
  const headers = ['Ngày', 'Loại', 'Danh mục', 'Số tiền (₫)', 'Mô tả'];
  const headerLine = headers.map((h) => escapeCSVField(h)).join(',');

  // CSV Rows
  const rows = transactions.map((transaction) => {
    const row: string[] = [
      formatDate(transaction.date),
      transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
      transaction.category.name,
      formatAmount(Number(transaction.amount)),
      transaction.description || '',
    ];

    return row.map((field) => escapeCSVField(field)).join(',');
  });

  // Combine header and rows
  const csvContent = [headerLine, ...rows].join('\n');

  return BOM + csvContent;
}

/**
 * Generate filename for CSV export
 */
export function generateCSVFilename(prefix: string = 'transactions'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${prefix}_${year}-${month}-${day}_${hours}${minutes}.csv`;
}

/**
 * Create a Blob from CSV content
 */
export function createCSVBlob(csvContent: string): Blob {
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}
