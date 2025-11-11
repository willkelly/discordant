#!/usr/bin/env -S deno run -A --watch=static/,routes/,islands/,signals/

import { App } from 'fresh';

const app = new App();

await app.listen();
