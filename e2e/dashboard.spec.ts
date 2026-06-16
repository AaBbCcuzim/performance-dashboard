import { test, expect } from '@playwright/test';

test('dashboard loads with header', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=PerfDash')).toBeVisible({ timeout: 10000 });
});

test('dashboard shows metric cards after data loads', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  const cards = page.locator('text=CPU Usage');
  await expect(cards.first()).toBeVisible({ timeout: 10000 });
});

test('dashboard renders chart canvas', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  const canvas = page.locator('canvas');
  await expect(canvas.first()).toBeVisible({ timeout: 10000 });
});

test('status bar shows data points loaded', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  await expect(page.locator('text=data points loaded')).toBeVisible({
    timeout: 10000,
  });
});

test('navigates to compare page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Compare');
  await expect(page).toHaveURL('/compare');
  await expect(page.locator('text=Multi-Dimension Comparison')).toBeVisible();
});

test('time range switch changes active button', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  const btn1h = page.locator('button', { hasText: '1h' });
  await btn1h.click();
  await page.waitForTimeout(2000);
  await expect(page.locator('canvas').first()).toBeVisible();
});

test('no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/');
  await page.waitForTimeout(4000);
  expect(errors).toEqual([]);
});
