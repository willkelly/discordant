/**
 * UI Component E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('UI Components', () => {
  test('should apply earth tone theme colors', async ({ page }) => {
    await page.goto('/');

    // Check that primary color is applied
    const title = page.locator('h1.app-title');
    await expect(title).toBeVisible();

    // Verify the page has the correct background
    const backgroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Background should not be pure white
    expect(backgroundColor).not.toBe('rgb(255, 255, 255)');
  });

  test('should have accessible focus states', async ({ page }) => {
    await page.goto('/');

    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that focused element has visible outline
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const outline = await focusedElement.evaluate((el) => {
      return window.getComputedStyle(el).outline;
    });

    // Should have some outline (not "none")
    expect(outline).not.toBe('none');
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Login form should still be visible and usable
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Connect")')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have proper typography hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1 = page.locator('h1');
    const subtitle = page.locator('.app-subtitle');

    // H1 should be larger than subtitle
    const h1Size = await h1.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    const subtitleSize = await subtitle.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    expect(h1Size).toBeGreaterThan(subtitleSize);
  });
});
