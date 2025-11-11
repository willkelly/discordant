/**
 * Login E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login form on initial load', async ({ page }) => {
    await page.goto('/');

    // Check for login form elements
    await expect(page.locator('h1')).toContainText('Discordant');
    await expect(page.locator('text=Server URL')).toBeVisible();
    await expect(page.locator('text=JID (Jabber ID)')).toBeVisible();
    await expect(page.locator('text=Password')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Connect' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/');

    // Click connect without filling fields
    await page.click('button:has-text("Connect")');

    // Should show validation errors
    await expect(page.locator('text=Server URL')).toBeVisible();
  });

  test('should validate JID format', async ({ page }) => {
    await page.goto('/');

    // Fill in invalid JID
    await page.fill('input[type="url"]', 'wss://example.com:5280/ws');
    await page.fill('input[type="text"]', 'invalidjid');
    await page.fill('input[type="password"]', 'password123');

    await page.click('button:has-text("Connect")');

    // Should show JID validation error
    await expect(page.locator('text=valid JID')).toBeVisible();
  });

  test('should have proper input labels and placeholders', async ({ page }) => {
    await page.goto('/');

    const serverInput = page.locator('input[type="url"]');
    await expect(serverInput).toHaveAttribute('placeholder', 'wss://example.com:5280/ws');

    const jidInput = page.locator('input[type="text"]');
    await expect(jidInput).toHaveAttribute('placeholder', 'user@example.com');

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Your password');
  });

  test('should show app subtitle', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Modern XMPP Chat Client')).toBeVisible();
  });
});
