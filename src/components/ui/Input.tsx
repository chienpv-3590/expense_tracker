import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 ${
          error ? 'border-gray-700 ring-1 ring-gray-700' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-gray-700">{error}</p>
      )}
    </div>
  );
}
