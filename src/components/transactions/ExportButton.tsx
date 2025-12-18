'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/Loading';

interface ExportButtonProps {
  filters?: Record<string, string>;
  className?: string;
}

export default function ExportButton({ filters = {}, className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);

      // Build query params from filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      // Fetch CSV file
      const response = await fetch(`/api/transactions/export?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export transactions');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'transactions.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('✅ Xuất CSV thành công!');
    } catch (err) {
      console.error('Export error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to export';
      toast.error(`❌ ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
      >
        {isExporting ? (
          <>
            <LoadingSpinner size="sm" />
            Đang xuất...
          </>
        ) : (
          <>
            <span>📥</span>
            Xuất CSV
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
