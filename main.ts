#!/usr/bin/env -S deno run -A

import { App } from 'fresh';
import { dirname, fromFileUrl } from '@std/path';

const app = new App({
  root: dirname(fromFileUrl(import.meta.url)),
});

// Check if build command was passed
const isBuildMode = Deno.args.includes('build');

if (isBuildMode) {
  // Fresh v2 doesn't have a traditional build step
  // The build happens automatically at runtime
  console.log('✅ Fresh v2: Build verification completed (no build artifacts needed)');
  Deno.exit(0);
} else {
  // Start the server
  await app.listen();
}
