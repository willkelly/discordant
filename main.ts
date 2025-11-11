#!/usr/bin/env -S deno run -A

import { App } from 'fresh';

const app = new App();

// Start the server
await app.listen();
