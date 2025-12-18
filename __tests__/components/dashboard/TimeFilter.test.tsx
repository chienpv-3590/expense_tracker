import { render, screen, fireEvent } from '@testing-library/react';
import TimeFilter from '@/components/dashboard/TimeFilter';

describe('TimeFilter', () => {
  const mockOnPrevious = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnGranularityChange = jest.fn();

  const defaultProps = {
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-15'),
    granularity: 'day' as const,
    onPrevious: mockOnPrevious,
    onNext: mockOnNext,
    onGranularityChange: mockOnGranularityChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all granularity buttons', () => {
    render(<TimeFilter {...defaultProps} />);

    expect(screen.getByText('Ngày')).toBeInTheDocument();
    expect(screen.getByText('Tuần')).toBeInTheDocument();
    expect(screen.getByText('Tháng')).toBeInTheDocument();
  });

  it('should highlight active granularity', () => {
    render(<TimeFilter {...defaultProps} granularity="week" />);

    const weekButton = screen.getByText('Tuần');
    expect(weekButton.className).toContain('bg-black');
  });

  it('should render previous and next buttons', () => {
    render(<TimeFilter {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const prevButton = buttons.find(btn => btn.textContent === '←');
    const nextButton = buttons.find(btn => btn.textContent === '→');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should call onPrevious when clicking previous button', () => {
    render(<TimeFilter {...defaultProps} />);

    const prevButton = screen.getAllByRole('button').find(btn => btn.textContent === '←');
    fireEvent.click(prevButton!);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when clicking next button', () => {
    render(<TimeFilter {...defaultProps} />);

    const nextButton = screen.getAllByRole('button').find(btn => btn.textContent === '→');
    fireEvent.click(nextButton!);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should call onGranularityChange when clicking granularity button', () => {
    render(<TimeFilter {...defaultProps} />);

    const weekButton = screen.getByText('Tuần');
    fireEvent.click(weekButton);

    expect(mockOnGranularityChange).toHaveBeenCalledWith('week');
  });

  it('should display date range', () => {
    render(<TimeFilter {...defaultProps} />);

    // Should display formatted date
    expect(screen.getByText(/15/)).toBeInTheDocument();
    expect(screen.getByText(/Tháng 1/)).toBeInTheDocument();
  });

  it('should render "Hôm nay" button', () => {
    render(<TimeFilter {...defaultProps} />);

    expect(screen.getByText('Hôm nay')).toBeInTheDocument();
  });

  it('should disable next button for future dates', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    render(
      <TimeFilter
        {...defaultProps}
        startDate={tomorrow}
        endDate={tomorrow}
      />
    );

    const nextButton = screen.getAllByRole('button').find(btn => btn.textContent === '→');
    expect(nextButton).toBeDisabled();
  });

  it('should not disable next button for past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    render(
      <TimeFilter
        {...defaultProps}
        startDate={yesterday}
        endDate={yesterday}
      />
    );

    const nextButton = screen.getAllByRole('button').find(btn => btn.textContent === '→');
    expect(nextButton).not.toBeDisabled();
  });

  it('should display week range correctly', () => {
    render(
      <TimeFilter
        {...defaultProps}
        startDate={new Date('2024-01-15')}
        endDate={new Date('2024-01-21')}
        granularity="week"
      />
    );

    expect(screen.getByText(/Tuần/)).toBeInTheDocument();
  });

  it('should display month range correctly', () => {
    render(
      <TimeFilter
        {...defaultProps}
        startDate={new Date('2024-01-01')}
        endDate={new Date('2024-01-31')}
        granularity="month"
      />
    );

    expect(screen.getByText(/Tháng 1/)).toBeInTheDocument();
  });

  it('should have responsive styling', () => {
    const { container } = render(<TimeFilter {...defaultProps} />);

    // Check for mobile-responsive classes
    const mobileElements = container.querySelectorAll('.flex-col, .sm\\:flex-row');
    expect(mobileElements.length).toBeGreaterThan(0);
  });
});
