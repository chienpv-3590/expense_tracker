import { Transaction, Category } from '@prisma/client';

interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface CSVRow {
  'Ngày': string;
  'Loại': string;
  'Danh mục': string;
  'Số tiền (₫)': string;
  'Mô tả': string;
}

/**
 * Format date to Vietnamese format: DD/MM/YYYY
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format amount to Vietnamese currency format
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/**
 * Escape CSV field value (handle commas, quotes, newlines)
 * Following RFC 4180 standard
 */
export function escapeCSVField(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Convert transactions to CSV format with UTF-8 BOM
 */
export function generateCSV(transactions: TransactionWithCategory[]): string {
  // UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  
  // CSV Header
  const headers = ['Ngày', 'Loại', 'Danh mục', 'Số tiền (₫)', 'Mô tả'];
  const headerLine = headers.map(h => escapeCSVField(h)).join(',');
  
  // CSV Rows
  const rows = transactions.map(transaction => {
    const row: string[] = [
      formatDate(transaction.date),
      transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
      transaction.category.name,
      formatAmount(Number(transaction.amount)),
      transaction.description || '',
    ];
    
    return row.map(field => escapeCSVField(field)).join(',');
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
