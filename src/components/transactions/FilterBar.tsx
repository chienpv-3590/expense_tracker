'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterBarProps {
  categories: Array<{ id: string; name: string; type: string }>;
  onFilterChange?: () => void;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function FilterBar({ categories, onFilterChange }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [minAmount, setMinAmount] = useState(searchParams.get('minAmount') || '');
  const [maxAmount, setMaxAmount] = useState(searchParams.get('maxAmount') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [transactionType, setTransactionType] = useState(searchParams.get('type') || '');
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce search with 300ms delay
  const debouncedSearch = useDebounce(search, 300);

  // Check if any filters are active
  const hasActiveFilters =
    categoryId || startDate || endDate || minAmount || maxAmount || search || transactionType;

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (categoryId) params.set('categoryId', categoryId);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (minAmount) params.set('minAmount', minAmount);
    if (maxAmount) params.set('maxAmount', maxAmount);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (transactionType) params.set('type', transactionType);

    router.push(`?${params.toString()}`);

    if (onFilterChange) {
      onFilterChange();
    }
  }, [
    categoryId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    debouncedSearch,
    transactionType,
    router,
    onFilterChange,
  ]);

  // Auto-apply filters when debounced search changes
  useEffect(() => {
    if (search !== searchParams.get('search')) {
      applyFilters();
    }
  }, [debouncedSearch]);

  const clearFilters = () => {
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setSearch('');
    setTransactionType('');
    router.push(window.location.pathname);

    if (onFilterChange) {
      onFilterChange();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6">
      {/* Filter Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">🔍 Bộ lọc</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Đang lọc
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">{isExpanded ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* Filter Form - Always visible on desktop, toggleable on mobile */}
      <div className={`px-6 py-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Transaction Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại giao dịch</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="income">Thu nhập</option>
              <option value="expense">Chi tiêu</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm mô tả</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập từ khóa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Min Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền tối thiểu
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền tối đa</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Không giới hạn"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            ✓ Áp dụng bộ lọc
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {transactionType && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm">
                  <span>Loại: {transactionType === 'income' ? 'Thu nhập' : 'Chi tiêu'}</span>
                  <button
                    onClick={() => {
                      setTransactionType('');
                      setTimeout(applyFilters, 0);
                    }}
                    className="hover:text-blue-900"
                  >
                    ✕
                  </button>
                </div>
              )}

              {categoryId && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm">
                  <span>Danh mục: {categories.find((c) => c.id === categoryId)?.name}</span>
                  <button
                    onClick={() => {
                      setCategoryId('');
                      setTimeout(applyFilters, 0);
                    }}
                    className="hover:text-purple-900"
                  >
                    ✕
                  </button>
                </div>
              )}

              {search && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm">
                  <span>Tìm kiếm: &quot;{search}&quot;</span>
                  <button
                    onClick={() => {
                      setSearch('');
                      setTimeout(applyFilters, 0);
                    }}
                    className="hover:text-green-900"
                  >
                    ✕
                  </button>
                </div>
              )}

              {(startDate || endDate) && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  <span>
                    {startDate && endDate
                      ? `${startDate} → ${endDate}`
                      : startDate
                        ? `Từ ${startDate}`
                        : `Đến ${endDate}`}
                  </span>
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      setTimeout(applyFilters, 0);
                    }}
                    className="hover:text-yellow-900"
                  >
                    ✕
                  </button>
                </div>
              )}

              {(minAmount || maxAmount) && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-lg text-sm">
                  <span>
                    {minAmount && maxAmount
                      ? `${Number(minAmount).toLocaleString('vi-VN')}₫ - ${Number(maxAmount).toLocaleString('vi-VN')}₫`
                      : minAmount
                        ? `≥ ${Number(minAmount).toLocaleString('vi-VN')}₫`
                        : `≤ ${Number(maxAmount).toLocaleString('vi-VN')}₫`}
                  </span>
                  <button
                    onClick={() => {
                      setMinAmount('');
                      setMaxAmount('');
                      setTimeout(applyFilters, 0);
                    }}
                    className="hover:text-orange-900"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
