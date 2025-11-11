import { defineConfig } from 'fresh';

export default defineConfig({
  // No Vite - pure Deno/Fresh
  build: {
    target: ['chrome99', 'firefox99', 'safari15'],
  },
});
