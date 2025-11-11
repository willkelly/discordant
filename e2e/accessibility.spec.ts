/**
 * Accessibility E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check for proper labeling
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Should be able to tab through all interactive elements
    await page.keyboard.press('Tab');
    let activeElement = await page.evaluateHandle(() => document.activeElement?.tagName);
    expect(await activeElement.jsonValue()).toBe('INPUT');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should reach the button
    activeElement = await page.evaluateHandle(() => document.activeElement?.tagName);
    expect(await activeElement.jsonValue()).toBe('BUTTON');
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    // Check title contrast
    const title = page.locator('h1');
    const titleColor = await title.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Primary color should not be white (would fail contrast)
    expect(titleColor).not.toBe('rgb(255, 255, 255)');
  });

  test('should have valid HTML structure', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Should have lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');
  });

  test('should support reduced motion preference', async ({ page }) => {
    // Set prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Page should still load and function
    await expect(page.locator('h1')).toBeVisible();
  });
});
