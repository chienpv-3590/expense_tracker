import { render, screen } from '@testing-library/react'

// Sample test utility functions
export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui)
}

// Mock data generators
export const mockCategory = (overrides = {}) => ({
  id: '1',
  name: 'Food',
  type: 'EXPENSE' as const,
  createdAt: new Date(),
  ...overrides,
})

export const mockTransaction = (overrides = {}) => ({
  id: '1',
  amount: 100000,
  type: 'EXPENSE' as const,
  categoryId: '1',
  date: new Date(),
  description: 'Test transaction',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})
