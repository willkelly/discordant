/**
 * Evaluate Debug - Use JavaScript evaluation only
 */

import { test } from '@playwright/test';

test('debug using only JavaScript evaluation', async ({ page }) => {
  console.log('🚀 Starting test...');

  // Capture page crash
  page.on('crash', () => {
    console.log('💥 PAGE CRASHED!');
  });

  // Capture console
  page.on('console', (msg) => {
    console.log(`[${msg.type()}]`, msg.text());
  });

  // Capture errors
  page.on('pageerror', (error) => {
    console.log('❌ Error:', error.message);
  });

  console.log('📡 Navigating...');
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  console.log('✅ Navigation complete');

  // Wait a bit for app to initialize
  await page.waitForTimeout(500);

  // Try to evaluate JavaScript to see DOM state
  console.log('🔍 Attempting JavaScript evaluation...');
  try {
    const info = await page.evaluate(() => {
      return {
        hasApp: !!document.getElementById('app'),
        bodyHTML: document.body.innerHTML.substring(0, 500),
        scriptCount: document.scripts.length,
        errorCount: (window as any).__errors?.length || 0,
      };
    });
    console.log('📊 Page Info:', JSON.stringify(info, null, 2));
  } catch (e: any) {
    console.log('❌ Evaluation failed:', e.message);
  }

  console.log('✅ Test completed');
});
