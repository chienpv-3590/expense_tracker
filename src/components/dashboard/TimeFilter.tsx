'use client';

import { Granularity, formatDateRange } from '@/lib/date-utils';

interface TimeFilterProps {
  startDate: Date;
  endDate: Date;
  granularity: Granularity;
  onPrevious: () => void;
  onNext: () => void;
  onGranularityChange: (granularity: Granularity) => void;
}

export default function TimeFilter({
  startDate,
  endDate,
  granularity,
  onPrevious,
  onNext,
  onGranularityChange,
}: TimeFilterProps) {
  const isToday = granularity === 'day' && startDate.toDateString() === new Date().toDateString();
  const isFuture = startDate > new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Granularity Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => onGranularityChange('day')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              granularity === 'day'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ngày
          </button>
          <button
            onClick={() => onGranularityChange('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              granularity === 'week'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tuần
          </button>
          <button
            onClick={() => onGranularityChange('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              granularity === 'month'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tháng
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPrevious}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Kỳ trước"
          >
            <span className="text-xl">←</span>
          </button>

          <div className="min-w-[200px] text-center">
            <p className="text-lg font-semibold text-gray-900">
              {formatDateRange(startDate, endDate, granularity)}
            </p>
          </div>

          <button
            onClick={onNext}
            disabled={isFuture}
            className={`p-2 rounded-lg transition-colors ${
              isFuture
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="Kỳ sau"
          >
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Today Button (only show if not today) */}
        {!isToday && (
          <button
            onClick={() => {
              onGranularityChange('day');
              // The parent component will handle resetting to today
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Hôm nay
          </button>
        )}
      </div>
    </div>
  );
}
