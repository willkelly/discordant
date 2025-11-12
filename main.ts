#!/usr/bin/env -S deno run -A

/**
 * Production Server Entry Point
 *
 * Fresh 2.x simplified setup
 */

import { App, staticFiles } from 'fresh';
import { renderToString } from 'preact-render-to-string';
import { h } from 'preact';
import AppIsland from './islands/AppIsland.tsx';

const app = new App();

// Serve static files middleware
app.use(staticFiles());

// Manual static file routes for CSS and other static assets (workaround)
// Serve any file from /styles/ directory
app.get('/styles/*', async (req) => {
  const url = new URL(req.url);
  const filePath = `./static${url.pathname}`;

  try {
    const content = await Deno.readTextFile(filePath);
    const contentType = filePath.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/plain';
    return new Response(content, {
      headers: { 'content-type': contentType },
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
});

// Favicon handler (prevent browser errors)
app.get('/favicon.ico', () => new Response(null, { status: 204 }));

// Root route
app.get('/', (_req) => {
  const body = renderToString(
    h(
      'html',
      { lang: 'en' },
      h(
        'head',
        null,
        h('meta', { charSet: 'utf-8' }),
        h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
        h('meta', { name: 'description', content: 'Discordant - A modern XMPP chat client' }),
        h('title', null, 'Discordant'),
        h('link', { rel: 'stylesheet', href: '/styles/global.css' }),
      ),
      h('body', null, h(AppIsland, null)),
    ),
  );

  return new Response(`<!DOCTYPE html>${body}`, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
});

if (import.meta.main) {
  await app.listen();
}
