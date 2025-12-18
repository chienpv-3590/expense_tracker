'use client';

import { useState, useEffect, useMemo } from 'react';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TimeFilter from '@/components/dashboard/TimeFilter';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import { SummaryCardsSkeleton, CategoryBreakdownSkeleton } from '@/components/ui/Loading';
import { Granularity, getDateRange, getPreviousPeriod, getNextPeriod } from '@/lib/date-utils';

interface SummaryData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    transactionCount: number;
  };
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    type: 'income' | 'expense';
    amount: number;
    count: number;
    percentage: number;
  }>;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export default function HomePage() {
  const [granularity, setGranularity] = useState<Granularity>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize dateRange để tránh tính toán lại mỗi render
  const dateRange = useMemo(() => {
    return getDateRange(currentDate, granularity);
  }, [currentDate.getTime(), granularity]);

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate.getTime(), dateRange.endDate.getTime()]);

  async function fetchSummary() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });

      const response = await fetch(`/api/transactions/summary?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch summary data');
      }

      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  }

  const handlePrevious = () => {
    setCurrentDate(getPreviousPeriod(currentDate, granularity));
  };

  const handleNext = () => {
    setCurrentDate(getNextPeriod(currentDate, granularity));
  };

  const handleGranularityChange = (newGranularity: Granularity) => {
    setGranularity(newGranularity);
    // Reset to today when changing granularity to day
    if (newGranularity === 'day') {
      setCurrentDate(new Date());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Filter */}
        <TimeFilter
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          granularity={granularity}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onGranularityChange={handleGranularityChange}
        />

        {/* Loading State */}
        {loading && (
          <>
            <SummaryCardsSkeleton />
            <CategoryBreakdownSkeleton />
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && summaryData && (
          <>
            {/* Summary Cards */}
            <SummaryCards
              totalIncome={summaryData.summary.totalIncome}
              totalExpenses={summaryData.summary.totalExpenses}
              netBalance={summaryData.summary.netBalance}
              transactionCount={summaryData.summary.transactionCount}
            />

            {/* Category Breakdown */}
            <CategoryBreakdown
              categories={summaryData.byCategory}
              totalIncome={summaryData.summary.totalIncome}
              totalExpenses={summaryData.summary.totalExpenses}
            />
          </>
        )}
      </main>
    </div>
  );
}
