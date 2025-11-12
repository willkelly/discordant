#!/usr/bin/env -S deno run -A --watch=static/,routes/,islands/,signals/

import { App, staticFiles } from 'fresh';
import { renderToString } from 'npm:preact-render-to-string@^6.6.3';
import { ComponentChildren, h } from 'preact';

// Import layouts and routes
import AppLayout from './routes/_app.tsx';
import Home from './routes/index.tsx';

const app = new App()
  .use(staticFiles())
  .get('/', (ctx) => {
    const html = renderToString(h(AppLayout, { Component: Home }));
    return new Response(
      `<!DOCTYPE html>${html}`,
      {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      },
    );
  });

await app.listen();
