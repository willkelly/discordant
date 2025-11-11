<script lang="ts">
  /**
   * Login Form Component
   *
   * Handles user authentication.
   */

  import { createEventDispatcher } from 'svelte';
  import Button from '../shared/Button.svelte';
  import Input from '../shared/Input.svelte';
  import { connectionState } from '@stores/connection';
  import { showToast } from '@stores/ui';

  const dispatch = createEventDispatcher();

  let serverUrl = 'wss://';
  let jid = '';
  let password = '';
  let isLoading = false;
  let errors = {
    serverUrl: '',
    jid: '',
    password: '',
  };

  function validateForm() {
    errors = {
      serverUrl: '',
      jid: '',
      password: '',
    };

    let isValid = true;

    if (!serverUrl || !serverUrl.startsWith('wss://')) {
      errors.serverUrl = 'Please enter a valid WebSocket URL (wss://)';
      isValid = false;
    }

    if (!jid || !jid.includes('@')) {
      errors.jid = 'Please enter a valid JID (user@domain)';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    isLoading = true;

    try {
      dispatch('login', {
        serviceUrl: serverUrl,
        jid,
        password,
      });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to connect',
        'error'
      );
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <div class="logo-section">
      <h1 class="app-title">Discordant</h1>
      <p class="app-subtitle">Modern XMPP Chat Client</p>
    </div>

    <form class="login-form" on:submit|preventDefault={handleSubmit}>
      <Input
        label="Server URL"
        type="url"
        placeholder="wss://example.com:5280/ws"
        bind:value={serverUrl}
        error={errors.serverUrl}
        disabled={isLoading}
        required
        fullWidth
      />

      <Input
        label="JID (Jabber ID)"
        type="text"
        placeholder="user@example.com"
        bind:value={jid}
        error={errors.jid}
        disabled={isLoading}
        required
        fullWidth
      />

      <Input
        label="Password"
        type="password"
        placeholder="Your password"
        bind:value={password}
        error={errors.password}
        disabled={isLoading}
        required
        fullWidth
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? 'Connecting...' : 'Connect'}
      </Button>
    </form>

    <div class="footer">
      <p class="footer-text">
        A vibecoded XMPP chat client with audio/video support
      </p>
    </div>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: var(--spacing-lg);
    background: linear-gradient(
      135deg,
      var(--color-bg-primary) 0%,
      var(--color-bg-secondary) 100%
    );
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    padding: var(--spacing-2xl);
    background-color: var(--color-bg-elevated);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
  }

  .logo-section {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }

  .app-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
  }

  .app-subtitle {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin-bottom: 0;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .footer {
    margin-top: var(--spacing-xl);
    text-align: center;
  }

  .footer-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
    margin-bottom: 0;
  }
</style>
