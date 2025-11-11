/**
 * Debug Test - Capture Runtime Errors
 */

import { test } from '@playwright/test';

test('capture runtime errors', async ({ page }) => {
  const errors: string[] = [];
  const logs: string[] = [];

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
    console.log(`Console ${msg.type()}:`, text);
  });

  // Capture page errors
  page.on('pageerror', error => {
    const errorMsg = error.toString();
    errors.push(errorMsg);
    console.log('Page Error:', errorMsg);
    console.log('Stack:', error.stack);
  });

  // Navigate to the page
  console.log('Navigating to page...');
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    console.log('Page loaded');

    // Wait a bit for any async errors
    await page.waitForTimeout(2000);

    // Try to get page content
    const html = await page.content();
    console.log('HTML length:', html.length);
    console.log('First 500 chars:', html.substring(0, 500));

  } catch (error) {
    console.log('Navigation error:', error);
  }

  console.log('\n=== Summary ===');
  console.log('Total errors:', errors.length);
  console.log('Total logs:', logs.length);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(err => console.log('  -', err));
  }
});
