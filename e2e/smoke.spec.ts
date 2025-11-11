/**
 * Smoke Test
 *
 * Basic test to verify the app loads without crashing.
 */

import { expect, test } from '@playwright/test';

test('app should load without crashing', async ({ page }) => {
  // Navigate and wait for app to load
  await page.goto('/');

  // Wait for page to be ready
  await page.waitForLoadState('networkidle');

  // Check that the app div exists
  const app = await page.locator('#app');
  await expect(app).toBeVisible();

  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-screenshot.png' });

  // Log any console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
    }
  });

  page.on('pageerror', (error) => {
    console.log('Page error:', error);
  });

  // Check that something rendered
  const body = await page.textContent('body');
  console.log('Page body length:', body?.length);
});
