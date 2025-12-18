import { render, screen } from '@testing-library/react';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';

describe('CategoryBreakdown', () => {
  const mockCategories = [
    {
      categoryId: '1',
      categoryName: 'Food',
      type: 'expense' as const,
      amount: 500000,
      count: 10,
      percentage: 50,
    },
    {
      categoryId: '2',
      categoryName: 'Transport',
      type: 'expense' as const,
      amount: 300000,
      count: 5,
      percentage: 30,
    },
    {
      categoryId: '3',
      categoryName: 'Salary',
      type: 'income' as const,
      amount: 2000000,
      count: 1,
      percentage: 100,
    },
  ];

  it('should render component title', () => {
    render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    expect(screen.getByText('📊 Phân Tích Theo Danh Mục')).toBeInTheDocument();
  });

  it('should render income and expense sections', () => {
    render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    expect(screen.getByText('💰 Thu Nhập')).toBeInTheDocument();
    expect(screen.getByText('💸 Chi Tiêu')).toBeInTheDocument();
  });

  it('should display category names', () => {
    render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('should display category amounts in Vietnamese currency', () => {
    render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    expect(screen.getByText('500.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('300.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('2.000.000 ₫')).toBeInTheDocument();
  });

  it('should display percentages', () => {
    render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should display transaction counts', () => {
    render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    expect(screen.getByText(/10 giao dịch/)).toBeInTheDocument();
    expect(screen.getByText(/5 giao dịch/)).toBeInTheDocument();
    expect(screen.getByText(/1 giao dịch/)).toBeInTheDocument();
  });

  it('should render progress bars', () => {
    const { container } = render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    const progressBars = container.querySelectorAll('.bg-gray-200');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('should display empty state when no categories', () => {
    render(
      <CategoryBreakdown
        categories={[]}
        totalIncome={0}
        totalExpenses={0}
      />
    );

    expect(screen.getByText(/Không có giao dịch/)).toBeInTheDocument();
  });

  it('should display empty income section when no income', () => {
    const expenseOnly = mockCategories.filter(cat => cat.type === 'expense');
    
    render(
      <CategoryBreakdown
        categories={expenseOnly}
        totalIncome={0}
        totalExpenses={800000}
      />
    );

    const incomeSection = screen.getByText('💰 Thu Nhập').parentElement?.parentElement;
    expect(incomeSection).toBeInTheDocument();
  });

  it('should display empty expense section when no expenses', () => {
    const incomeOnly = mockCategories.filter(cat => cat.type === 'income');
    
    render(
      <CategoryBreakdown
        categories={incomeOnly}
        totalIncome={2000000}
        totalExpenses={0}
      />
    );

    const expenseSection = screen.getByText('💸 Chi Tiêu').parentElement?.parentElement;
    expect(expenseSection).toBeInTheDocument();
  });

  it('should sort categories by amount in descending order', () => {
    const unsortedCategories = [
      {
        categoryId: '1',
        categoryName: 'Small',
        type: 'expense' as const,
        amount: 100000,
        count: 1,
        percentage: 20,
      },
      {
        categoryId: '2',
        categoryName: 'Large',
        type: 'expense' as const,
        amount: 400000,
        count: 4,
        percentage: 80,
      },
    ];

    const { container } = render(
      <CategoryBreakdown
        categories={unsortedCategories}
        totalIncome={0}
        totalExpenses={500000}
      />
    );

    const categoryNames = Array.from(
      container.querySelectorAll('.font-medium')
    ).map(el => el.textContent);

    const largeIndex = categoryNames.indexOf('Large');
    const smallIndex = categoryNames.indexOf('Small');
    
    // Large amount should come before small amount
    expect(largeIndex).toBeLessThan(smallIndex);
  });

  it('should have responsive grid layout', () => {
    const { container } = render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    // Check for responsive grid classes
    const gridElements = container.querySelectorAll('.grid');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('should display total amounts in section headers', () => {
    render(
      <CategoryBreakdown
        categories={mockCategories}
        totalIncome={2000000}
        totalExpenses={800000}
      />
    );

    expect(screen.getByText(/2.000.000 ₫/)).toBeInTheDocument();
    expect(screen.getByText(/800.000 ₫/)).toBeInTheDocument();
  });
});
