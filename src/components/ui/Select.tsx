import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, className = '', ...props }: SelectProps) {
  const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 ${
          error ? 'border-gray-700 ring-1 ring-gray-700' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={props.value !== ''} className="text-gray-500">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-gray-700">{error}</p>
      )}
    </div>
  );
}
