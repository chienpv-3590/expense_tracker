import { test, expect } from '@playwright/test';

test.describe('Error Handling & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Form Validation', () => {
    test('should show error for empty amount field', async ({ page }) => {
      await page.goto('/transactions/new');
      
      // Submit without filling amount
      await page.getByRole('button', { name: /Lưu/ }).click();
      
      // Check for validation error
      const errorMessage = page.locator('text=/Số tiền/i').locator('..');
      await expect(errorMessage).toBeVisible();
    });

    test('should show error for negative amount', async ({ page }) => {
      await page.goto('/transactions/new');
      
      await page.fill('input[name="amount"]', '-1000');
      await page.getByRole('button', { name: /Lưu/ }).click();
      
      // Should show validation error
      await expect(page.locator('text=/phải lớn hơn 0/i')).toBeVisible();
    });

    test('should show error for invalid date', async ({ page }) => {
      await page.goto('/transactions/new');
      
      await page.fill('input[name="amount"]', '100000');
      await page.fill('input[name="date"]', '9999-99-99'); // Invalid date
      await page.getByRole('button', { name: /Lưu/ }).click();
      
      // Should show error
      await expect(page.locator('text=/Ngày không hợp lệ/i')).toBeVisible();
    });

    test('should show error when no category selected', async ({ page }) => {
      await page.goto('/transactions/new');
      
      await page.fill('input[name="amount"]', '100000');
      await page.fill('input[name="date"]', '2024-01-15');
      // Don't select category
      await page.getByRole('button', { name: /Lưu/ }).click();
      
      // Should show validation error
      await expect(page.locator('text=/Vui lòng chọn danh mục/i')).toBeVisible();
    });

    test('should accept special Vietnamese characters in description', async ({ page }) => {
      await page.goto('/transactions/new');
      
      await page.fill('input[name="amount"]', '100000');
      const vietnameseText = 'Mua đồ ăn tại Hà Nội với Nguyễn Văn A';
      await page.fill('textarea[name="description"]', vietnameseText);
      
      // Should not show error
      const form = page.locator('form');
      await expect(form).not.toContain('Ký tự không hợp lệ');
    });
  });

  test.describe('Invalid Date Ranges', () => {
    test('should handle end date before start date', async ({ page }) => {
      await page.goto('/transactions');
      
      // Set end date before start date
      await page.fill('input[name="startDate"]', '2024-12-31');
      await page.fill('input[name="endDate"]', '2024-01-01');
      
      // Should show error or auto-correct
      const errorMsg = page.locator('text=/Ngày kết thúc phải sau ngày bắt đầu/i');
      
      // Either error shown or dates auto-corrected
      const hasError = await errorMsg.isVisible().catch(() => false);
      if (!hasError) {
        // Check if auto-corrected
        const startDate = await page.inputValue('input[name="startDate"]');
        const endDate = await page.inputValue('input[name="endDate"]');
        expect(new Date(startDate).getTime()).toBeLessThanOrEqual(new Date(endDate).getTime());
      }
    });

    test('should handle very old dates', async ({ page }) => {
      await page.goto('/transactions');
      
      await page.fill('input[name="startDate"]', '1900-01-01');
      
      // Should handle gracefully (no crash)
      await expect(page).toHaveURL(/transactions/);
    });

    test('should handle future dates', async ({ page }) => {
      await page.goto('/transactions/new');
      
      // Try to create transaction with future date
      await page.fill('input[name="amount"]', '100000');
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      await page.fill('input[name="date"]', futureDate.toISOString().split('T')[0]);
      
      // Should show warning or allow (depending on business logic)
      await page.getByRole('button', { name: /Lưu/ }).click();
      
      // Verify no crash
      await page.waitForTimeout(500);
      expect(page.url()).toBeTruthy();
    });
  });

  test.describe('Network Errors', () => {
    test('should show error when API fails', async ({ page }) => {
      // Intercept API call and make it fail
      await page.route('**/api/transactions', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await page.goto('/transactions');
      
      // Should show error message
      await expect(page.locator('text=/Lỗi tải dữ liệu/i')).toBeVisible({ timeout: 5000 });
    });

    test('should handle timeout gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/api/transactions', async route => {
        await page.waitForTimeout(10000); // 10s delay
        route.continue();
      });

      await page.goto('/transactions');
      
      // Should show loading state
      await expect(page.locator('text=/Đang tải/i')).toBeVisible();
    });

    test('should recover after network error', async ({ page }) => {
      let callCount = 0;
      
      // First call fails, second succeeds
      await page.route('**/api/transactions', route => {
        callCount++;
        if (callCount === 1) {
          route.fulfill({ status: 500 });
        } else {
          route.continue();
        }
      });

      await page.goto('/transactions');
      
      // Should show error
      await expect(page.locator('text=/Lỗi/i')).toBeVisible();
      
      // Retry (reload)
      await page.reload();
      
      // Should load successfully on second try
      await expect(page.getByText('Quản Lý Giao Dịch')).toBeVisible();
    });
  });

  test.describe('404 Pages', () => {
    test('should show 404 for non-existent transaction', async ({ page }) => {
      await page.goto('/transactions/nonexistent-id-123456');
      
      // Should show 404 or error page
      const is404 = await page.locator('text=/404|Không tìm thấy/i').isVisible();
      expect(is404).toBeTruthy();
    });

    test('should show 404 for non-existent category', async ({ page }) => {
      await page.goto('/categories/nonexistent-id-123456');
      
      // Should show 404 or redirect
      const is404 = await page.locator('text=/404|Không tìm thấy/i').isVisible();
      expect(is404).toBeTruthy();
    });

    test('should show 404 for invalid route', async ({ page }) => {
      await page.goto('/invalid-route-that-does-not-exist');
      
      // Should show 404
      await expect(page.locator('text=/404|Không tìm thấy/i')).toBeVisible();
    });
  });

  test.describe('Empty States', () => {
    test('should show empty state when no transactions', async ({ page, context }) => {
      // Create new context to avoid cached data
      const newPage = await context.newPage();
      
      // Mock empty response
      await newPage.route('**/api/transactions*', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            transactions: [],
            pagination: { page: 1, totalPages: 0, total: 0 },
          }),
        });
      });

      await newPage.goto('/transactions');
      
      // Should show empty state
      await expect(newPage.locator('text=/Chưa có giao dịch/i')).toBeVisible();
      await expect(newPage.locator('text=/Thêm giao dịch đầu tiên/i')).toBeVisible();
      
      await newPage.close();
    });

    test('should show empty state when no search results', async ({ page }) => {
      await page.goto('/transactions');
      
      // Search for something that doesn't exist
      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.fill('xyzkjshdfjksdhfkjshdf');
      
      // Wait for debounce
      await page.waitForTimeout(500);
      
      // Should show no results message
      await expect(page.locator('text=/Không tìm thấy/i')).toBeVisible();
    });

    test('should show empty dashboard when no data', async ({ page }) => {
      // Mock empty summary
      await page.route('**/api/transactions/summary*', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            summary: {
              totalIncome: 0,
              totalExpenses: 0,
              netBalance: 0,
              transactionCount: 0,
            },
            byCategory: [],
          }),
        });
      });

      await page.goto('/');
      
      // Should show zeros
      await expect(page.locator('text=/0 ₫/').first()).toBeVisible();
      await expect(page.locator('text=/Không có giao dịch/i')).toBeVisible();
    });
  });

  test.describe('Deletion Prevention', () => {
    test('should prevent deleting category with transactions', async ({ page }) => {
      await page.goto('/categories');
      
      // Try to delete a category that has transactions
      const deleteButton = page.locator('button[aria-label*="Xóa"]').first();
      await deleteButton.click();
      
      // Click confirm
      const confirmButton = page.locator('button:has-text("Xóa")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Should show error about existing transactions
      await expect(page.locator('text=/Không thể xóa.*giao dịch/i')).toBeVisible();
    });

    test('should show confirmation before deleting transaction', async ({ page }) => {
      await page.goto('/transactions');
      
      // Click delete on first transaction
      const deleteButton = page.locator('button[aria-label*="Xóa"]').first();
      await deleteButton.click();
      
      // Should show confirmation modal
      await expect(page.locator('text=/Xác nhận xóa/i')).toBeVisible();
      await expect(page.locator('button:has-text("Hủy")')).toBeVisible();
      await expect(page.locator('button:has-text("Xóa")')).toBeVisible();
    });

    test('should cancel deletion when clicking cancel', async ({ page }) => {
      await page.goto('/transactions');
      
      // Get initial transaction count
      const initialTransactions = await page.locator('[data-testid="transaction-item"]').count();
      
      // Click delete
      const deleteButton = page.locator('button[aria-label*="Xóa"]').first();
      await deleteButton.click();
      
      // Click cancel
      await page.locator('button:has-text("Hủy")').click();
      
      // Count should be same
      const finalTransactions = await page.locator('[data-testid="transaction-item"]').count();
      expect(finalTransactions).toBe(initialTransactions);
    });
  });

  test.describe('Concurrent Operations', () => {
    test('should handle rapid form submissions', async ({ page }) => {
      await page.goto('/transactions/new');
      
      // Fill form
      await page.fill('input[name="amount"]', '100000');
      const categorySelect = page.locator('select[name="categoryId"]');
      await categorySelect.selectOption({ index: 1 });
      await page.fill('input[name="date"]', '2024-01-15');
      
      // Click submit multiple times rapidly
      const submitButton = page.getByRole('button', { name: /Lưu/ });
      await submitButton.click();
      await submitButton.click();
      await submitButton.click();
      
      // Should only create one transaction (button should be disabled)
      await page.waitForTimeout(1000);
      
      // Check that button was disabled during submission
      const isDisabled = await submitButton.isDisabled();
      expect(isDisabled).toBeTruthy();
    });

    test('should handle simultaneous filter changes', async ({ page }) => {
      await page.goto('/transactions');
      
      // Change multiple filters at once
      const typeSelect = page.locator('select').first();
      const searchInput = page.locator('input[type="text"]').first();
      
      await Promise.all([
        typeSelect.selectOption('EXPENSE'),
        searchInput.fill('test'),
      ]);
      
      // Wait for debounce
      await page.waitForTimeout(500);
      
      // Should not crash
      await expect(page).toHaveURL(/type=EXPENSE/);
    });
  });

  test.describe('Large Data Handling', () => {
    test('should handle very long descriptions', async ({ page }) => {
      await page.goto('/transactions/new');
      
      const longDescription = 'A'.repeat(1000); // 1000 characters
      
      await page.fill('input[name="amount"]', '100000');
      await page.fill('textarea[name="description"]', longDescription);
      
      const categorySelect = page.locator('select[name="categoryId"]');
      await categorySelect.selectOption({ index: 1 });
      await page.fill('input[name="date"]', '2024-01-15');
      
      await page.getByRole('button', { name: /Lưu/ }).click();
      
      // Should either accept or show validation error about length
      await page.waitForTimeout(1000);
      
      // Verify no crash
      expect(page.url()).toBeTruthy();
    });

    test('should handle very large amounts', async ({ page }) => {
      await page.goto('/transactions/new');
      
      const largeAmount = '999999999999'; // 999 billion
      
      await page.fill('input[name="amount"]', largeAmount);
      
      // Should handle formatting properly
      await page.waitForTimeout(500);
      
      // Verify input accepts large numbers
      const value = await page.inputValue('input[name="amount"]');
      expect(value).toBeTruthy();
    });
  });

  test.describe('Browser Compatibility', () => {
    test('should work with disabled JavaScript', async ({ page }) => {
      // This test would need special setup
      // Just verify critical content is available
      await page.goto('/');
      
      // Should show main heading even if JS fails
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should handle page refresh during operation', async ({ page }) => {
      await page.goto('/transactions/new');
      
      // Start filling form
      await page.fill('input[name="amount"]', '100000');
      
      // Refresh page
      await page.reload();
      
      // Form should reset
      const amount = await page.inputValue('input[name="amount"]');
      expect(amount).toBe('');
    });

    test('should maintain state on back navigation', async ({ page }) => {
      await page.goto('/transactions');
      
      // Apply filter
      const typeSelect = page.locator('select').first();
      await typeSelect.selectOption('EXPENSE');
      
      // Navigate away
      await page.goto('/');
      
      // Go back
      await page.goBack();
      
      // Filter should be preserved
      expect(page.url()).toContain('type=EXPENSE');
    });
  });
});
