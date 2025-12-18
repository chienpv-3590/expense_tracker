import { test, expect } from '@playwright/test';

test.describe('Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard with summary cards', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.getByText('Quản Lý Chi Tiêu')).toBeVisible();
    
    // Check for summary cards
    await expect(page.getByText('Tổng thu nhập')).toBeVisible();
    await expect(page.getByText('Tổng chi tiêu')).toBeVisible();
    await expect(page.getByText('Số dư')).toBeVisible();
    await expect(page.getByText('Số giao dịch')).toBeVisible();
  });

  test('should navigate to transactions page', async ({ page }) => {
    await page.getByRole('link', { name: /Xem Tất Cả Giao Dịch/ }).click();
    
    await expect(page).toHaveURL('/transactions');
    await expect(page.getByText('Quản Lý Giao Dịch')).toBeVisible();
  });

  test('should create a new transaction', async ({ page }) => {
    // Navigate to create transaction page
    await page.goto('/transactions/new');
    
    // Fill in the form
    await page.fill('input[name="amount"]', '100000');
    await page.selectOption('select[name="type"]', 'EXPENSE');
    await page.fill('input[name="date"]', '2024-01-15');
    await page.fill('textarea[name="description"]', 'Test E2E transaction');
    
    // Select category (first option)
    const categorySelect = page.locator('select[name="categoryId"]');
    await categorySelect.selectOption({ index: 1 });
    
    // Submit form
    await page.getByRole('button', { name: /Lưu/ }).click();
    
    // Wait for redirect to transactions page
    await page.waitForURL('/transactions', { timeout: 5000 });
    
    // Verify transaction appears in list
    await expect(page.getByText('Test E2E transaction')).toBeVisible();
  });

  test('should filter transactions', async ({ page }) => {
    await page.goto('/transactions');
    
    // Wait for page to load
    await expect(page.getByText('Quản Lý Giao Dịch')).toBeVisible();
    
    // Open filter section
    const filterButton = page.getByRole('button', { name: /Lọc/ });
    if (await filterButton.isVisible()) {
      await filterButton.click();
    }
    
    // Select expense type filter
    const typeSelect = page.locator('select').first();
    await typeSelect.selectOption('EXPENSE');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Verify URL has filter parameter
    expect(page.url()).toContain('type=');
  });

  test('should search transactions', async ({ page }) => {
    await page.goto('/transactions');
    
    // Wait for page to load
    await expect(page.getByText('Quản Lý Giao Dịch')).toBeVisible();
    
    // Find search input
    const searchInput = page.locator('input[type="text"]').first();
    
    // Enter search term
    await searchInput.fill('test');
    
    // Wait for debounce and results
    await page.waitForTimeout(500);
    
    // Verify URL has search parameter
    expect(page.url()).toContain('search=');
  });

  test('should export transactions to CSV', async ({ page }) => {
    await page.goto('/transactions');
    
    // Wait for page to load
    await expect(page.getByText('Quản Lý Giao Dịch')).toBeVisible();
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.getByRole('button', { name: /Xuất CSV/ }).click();
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/transactions_.*\.csv/);
  });
});

test.describe('Dashboard Time Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch between time granularities', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.getByText('Quản Lý Chi Tiêu')).toBeVisible();
    
    // Click on "Tuần" (Week) button
    await page.getByRole('button', { name: 'Tuần' }).click();
    
    // Verify week display
    await expect(page.getByText(/Tuần/)).toBeVisible();
    
    // Click on "Tháng" (Month) button
    await page.getByRole('button', { name: 'Tháng' }).click();
    
    // Verify month display
    await expect(page.getByText(/tháng/)).toBeVisible();
  });

  test('should navigate to previous period', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.getByText('Quản Lý Chi Tiêu')).toBeVisible();
    
    // Get initial date display
    const dateText = await page.locator('p.text-lg.font-semibold').first().textContent();
    
    // Click previous button (←)
    await page.getByRole('button', { name: '←' }).click();
    
    // Wait for data to update
    await page.waitForTimeout(500);
    
    // Verify date has changed
    const newDateText = await page.locator('p.text-lg.font-semibold').first().textContent();
    expect(newDateText).not.toBe(dateText);
  });

  test('should export dashboard data', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.getByText('Quản Lý Chi Tiêu')).toBeVisible();
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button on dashboard
    const exportButton = page.getByRole('button', { name: /Xuất CSV/ });
    await exportButton.click();
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/transactions_.*\.csv/);
  });
});

test.describe('Categories Management', () => {
  test('should navigate to categories page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /Quản Lý Danh Mục/ }).click();
    
    await expect(page).toHaveURL('/categories');
    await expect(page.getByText('Quản Lý Danh Mục')).toBeVisible();
  });

  test('should display list of categories', async ({ page }) => {
    await page.goto('/categories');
    
    // Wait for page to load
    await expect(page.getByText('Quản Lý Danh Mục')).toBeVisible();
    
    // Verify at least one category is visible
    const categoryCards = page.locator('.bg-white.border');
    await expect(categoryCards.first()).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should display mobile layout on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Verify mobile layout elements
    await expect(page.getByText('Quản Lý Chi Tiêu')).toBeVisible();
    
    // Summary cards should stack vertically on mobile
    const summaryCards = page.locator('.grid > div');
    const firstCard = summaryCards.first();
    await expect(firstCard).toBeVisible();
  });

  test('should display desktop layout on large screens', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    
    // Verify desktop layout
    await expect(page.getByText('Quản Lý Chi Tiêu')).toBeVisible();
    
    // Summary cards should be in a row on desktop
    const summaryCards = page.locator('.grid > div');
    await expect(summaryCards.first()).toBeVisible();
  });
});

test.describe('Vietnamese Localization', () => {
  test('should display Vietnamese currency format', async ({ page }) => {
    await page.goto('/');
    
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check for Vietnamese currency symbol (₫)
    const pageContent = await page.content();
    expect(pageContent).toContain('₫');
  });

  test('should display dates in DD/MM/YYYY format', async ({ page }) => {
    await page.goto('/transactions');
    
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Check for date format pattern (e.g., 15/01/2024)
    const pageContent = await page.content();
    expect(pageContent).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
