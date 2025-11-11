<script lang="ts">
  import LoginForm from './components/auth/LoginForm.svelte';
  import Toast from './components/shared/Toast.svelte';
  import { isConnected } from './stores/connection';
  import type { ConnectionConfig } from './types/xmpp';

  async function handleLogin(event: CustomEvent<ConnectionConfig>) {
    console.log('Login called', event.detail);
  }
</script>

<main class="app">
  {#if !$isConnected}
    <LoginForm on:login={handleLogin} />
  {:else}
    <p>Connected!</p>
  {/if}

  <Toast />
</main>

<style>
  .app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>
