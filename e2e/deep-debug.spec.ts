/**
 * Deep Debug Test - Investigate Chromium Crash
 */

import { expect, test } from '@playwright/test';

test('investigate crash with detailed logging', async ({ page, context }) => {
  const errors: string[] = [];
  const logs: any[] = [];
  const requests: string[] = [];

  // Capture all console messages
  page.on('console', (msg) => {
    const logEntry = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    };
    logs.push(logEntry);
    console.log(`[Console ${msg.type()}]`, msg.text());
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    errors.push(error.toString());
    console.log('❌ Page Error:', error.message);
    console.log('Stack:', error.stack);
  });

  // Capture crashes
  page.on('crash', () => {
    console.log('💥 PAGE CRASHED!');
  });

  // Capture requests
  page.on('request', (request) => {
    requests.push(request.url());
  });

  // Capture response failures
  page.on('requestfailed', (request) => {
    console.log('❌ Request failed:', request.url(), request.failure()?.errorText);
  });

  // Navigate with extended timeout
  console.log('🚀 Navigating to page...');
  try {
    const response = await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    console.log('✅ Page loaded, status:', response?.status());

    // Wait for the app div
    console.log('🔍 Looking for #app div...');
    const appDiv = await page.locator('#app').count();
    console.log('Found #app divs:', appDiv);

    // Try to get any rendered content
    console.log('🔍 Checking for any text content...');
    await page.waitForTimeout(1000);

    const bodyText = await page.evaluate(() => document.body.innerText).catch((e) => {
      console.log('Failed to get body text:', e.message);
      return '';
    });
    console.log('Body text length:', bodyText.length);
    console.log('Body text preview:', bodyText.substring(0, 200));

    // Check if JavaScript is executing
    const jsWorking = await page.evaluate(() => {
      console.log('JavaScript is executing!');
      return true;
    }).catch((e) => {
      console.log('JavaScript evaluation failed:', e.message);
      return false;
    });
    console.log('JavaScript working:', jsWorking);

    // Try to detect what's in the DOM
    const domInfo = await page.evaluate(() => {
      return {
        title: document.title,
        scripts: document.scripts.length,
        stylesheets: document.styleSheets.length,
        bodyChildren: document.body.children.length,
        appDiv: !!document.getElementById('app'),
        appChildren: document.getElementById('app')?.children.length || 0,
      };
    }).catch((e) => {
      console.log('Failed to get DOM info:', e.message);
      return null;
    });
    console.log('📊 DOM Info:', domInfo);
  } catch (error: any) {
    console.log('❌ Navigation error:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('Total console logs:', logs.length);
  console.log('Total errors:', errors.length);
  console.log('Total requests:', requests.length);

  if (errors.length > 0) {
    console.log('\n⚠️ Errors found:');
    errors.forEach((err) => console.log('  -', err));
  }

  if (logs.length > 0) {
    console.log('\n📝 Console logs:');
    logs.forEach((log) => console.log(`  [${log.type}]`, log.text));
  }
});
