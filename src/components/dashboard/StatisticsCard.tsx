import React from 'react';
import { formatCurrency } from '@/lib/formatters';

interface StatisticsCardProps {
  title: string;
  amount: number;
  icon?: string;
  variant?: 'default' | 'income' | 'expense';
}

export function StatisticsCard({ 
  title, 
  amount, 
  icon, 
  variant = 'default' 
}: StatisticsCardProps) {
  const isIncome = variant === 'income';
  const isExpense = variant === 'expense';
  
  return (
    <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold ${
            isIncome ? 'text-gray-900' : 
            isExpense ? 'text-gray-700' : 
            'text-black'
          }`}>
            {formatCurrency(Math.abs(amount))}
          </p>
          {variant !== 'default' && (
            <p className="mt-1 text-xs text-gray-500">
              {isIncome ? '↑ Thu nhập' : '↓ Chi tiêu'}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-3xl text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
