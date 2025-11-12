#!/usr/bin/env -S deno run -A

/**
 * Production Server Entry Point
 *
 * Simple Fresh 2.x setup with manual routing
 */

import { App, page } from 'fresh';
import AppLayout from './routes/_app.tsx';
import HomePage from './routes/index.tsx';

// Fresh 2.x serves static files from ./static automatically
const app = new App();

// Register routes using the page() API
app.get('/', page(HomePage, { layout: AppLayout }));

// Listen
if (import.meta.main) {
  await app.listen();
}
