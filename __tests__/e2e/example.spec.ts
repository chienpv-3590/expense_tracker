import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Verify the page title
  await expect(page).toHaveTitle(/Expense Tracker/);
  
  // Verify main heading is visible
  await expect(page.getByRole('heading', { name: /Expense Tracker/i })).toBeVisible();
});
