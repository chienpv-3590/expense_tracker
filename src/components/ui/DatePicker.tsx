import React from 'react';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function DatePicker({ label, error, className = '', ...props }: DatePickerProps) {
  const inputId = props.id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="date"
        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 ${
          error ? 'border-gray-700 ring-1 ring-gray-700' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-gray-700">{error}</p>}
    </div>
  );
}
