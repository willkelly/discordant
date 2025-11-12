#!/usr/bin/env -S deno run -A --watch=static/,routes/,islands/,signals/

/**
 * Development Server Entry Point
 *
 * Starts the Fresh server with manual routing
 * Note: Fresh 2.0's .fsRoutes() requires Vite integration which currently
 * has compatibility issues. Using manual route registration as a workaround.
 */

import { App, staticFiles } from 'fresh';
import { renderToString } from 'npm:preact-render-to-string@^6.6.3';
import { h } from 'preact';

// Import layouts and routes
import AppLayout from './routes/_app.tsx';
import HomePage from './routes/index.tsx';

const app = new App();

// Add static file serving
app.use(staticFiles());

// Manually register routes
// Root route
app.get('/', (_ctx) => {
  // @ts-ignore - Simplified SSR rendering without full PageProps
  const html = renderToString(h(AppLayout, {
    Component: HomePage,
  }));

  return new Response(
    `<!DOCTYPE html>${html}`,
    {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    },
  );
});

await app.listen();
