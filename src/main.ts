/**
 * Main Entry Point
 *
 * Initializes the Svelte app.
 */

import App from './App.svelte';
import './styles/global.css';

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
