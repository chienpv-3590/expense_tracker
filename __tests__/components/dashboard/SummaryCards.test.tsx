import { render, screen } from '@testing-library/react';
import SummaryCards from '@/components/dashboard/SummaryCards';

describe('SummaryCards', () => {
  it('should render all four cards', () => {
    render(
      <SummaryCards
        totalIncome={1000000}
        totalExpenses={500000}
        netBalance={500000}
        transactionCount={10}
      />
    );

    expect(screen.getByText('Tổng thu nhập')).toBeInTheDocument();
    expect(screen.getByText('Tổng chi tiêu')).toBeInTheDocument();
    expect(screen.getByText('Số dư')).toBeInTheDocument();
    expect(screen.getByText('Số giao dịch')).toBeInTheDocument();
  });

  it('should format currency correctly', () => {
    const { container } = render(
      <SummaryCards
        totalIncome={1234567}
        totalExpenses={987654}
        netBalance={246913}
        transactionCount={25}
      />
    );

    expect(container.textContent).toContain('1.234.567');
    expect(container.textContent).toContain('987.654');
    expect(container.textContent).toContain('246.913');
  });

  it('should display transaction count', () => {
    render(
      <SummaryCards
        totalIncome={0}
        totalExpenses={0}
        netBalance={0}
        transactionCount={42}
      />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const { container } = render(
      <SummaryCards
        totalIncome={0}
        totalExpenses={0}
        netBalance={0}
        transactionCount={0}
      />
    );

    expect(container.textContent).toContain('0');
  });

  it('should handle negative balance', () => {
    const { container } = render(
      <SummaryCards
        totalIncome={500000}
        totalExpenses={1000000}
        netBalance={-500000}
        transactionCount={15}
      />
    );

    expect(container.textContent).toContain('-500.000');
  });

  it('should display income with green styling', () => {
    const { container } = render(
      <SummaryCards
        totalIncome={1000000}
        totalExpenses={0}
        netBalance={0}
        transactionCount={0}
      />
    );

    const incomeCard = container.querySelector('.text-green-600');
    expect(incomeCard).toBeInTheDocument();
  });

  it('should display expenses with red styling', () => {
    const { container } = render(
      <SummaryCards
        totalIncome={0}
        totalExpenses={500000}
        netBalance={0}
        transactionCount={0}
      />
    );

    const expenseCard = container.querySelector('.text-red-600');
    expect(expenseCard).toBeInTheDocument();
  });

  it('should render with emojis', () => {
    render(
      <SummaryCards
        totalIncome={1000000}
        totalExpenses={500000}
        netBalance={500000}
        transactionCount={10}
      />
    );

    expect(screen.getByText(/💰/)).toBeInTheDocument();
    expect(screen.getByText(/💸/)).toBeInTheDocument();
    expect(screen.getByText(/💼/)).toBeInTheDocument();
    expect(screen.getByText(/📊/)).toBeInTheDocument();
  });
});
