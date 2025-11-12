#!/usr/bin/env -S deno run -A --watch=static/,routes/,islands/,signals/

import { App } from 'fresh';
import { dirname, fromFileUrl } from '@std/path';

const app = new App({
  root: dirname(fromFileUrl(import.meta.url)),
});

await app.listen();
