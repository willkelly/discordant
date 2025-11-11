/**
 * Login Island
 *
 * Handles user authentication with XMPP server.
 */

import { useSignal } from '@preact/signals';
import Button from '../components/Button.tsx';
import Input from '../components/Input.tsx';
import { showToast } from '@signals/ui.ts';
import type { ConnectionConfig } from '../src/types/xmpp.ts';

interface LoginIslandProps {
  onLogin: (config: ConnectionConfig) => void;
}

export default function LoginIsland({ onLogin }: LoginIslandProps) {
  const serverUrl = useSignal('wss://');
  const jid = useSignal('');
  const password = useSignal('');
  const isLoading = useSignal(false);
  const errors = useSignal({
    serverUrl: '',
    jid: '',
    password: '',
  });

  function validateForm(): boolean {
    const newErrors = {
      serverUrl: '',
      jid: '',
      password: '',
    };

    let isValid = true;

    if (!serverUrl.value || !serverUrl.value.startsWith('wss://')) {
      newErrors.serverUrl = 'Please enter a valid WebSocket URL (wss://)';
      isValid = false;
    }

    if (!jid.value || !jid.value.includes('@')) {
      newErrors.jid = 'Please enter a valid JID (user@domain)';
      isValid = false;
    }

    if (!password.value) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    errors.value = newErrors;
    return isValid;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (!validateForm()) return;

    isLoading.value = true;

    try {
      onLogin({
        serviceUrl: serverUrl.value,
        jid: jid.value,
        password: password.value,
      });
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to connect',
        'error',
      );
    } finally {
      isLoading.value = false;
    }
  }

  return (
    <div class='login-container'>
      <div class='login-card'>
        <div class='logo-section'>
          <h1 class='app-title'>Discordant</h1>
          <p class='app-subtitle'>Modern XMPP Chat Client</p>
        </div>

        <form class='login-form' onSubmit={handleSubmit}>
          <Input
            label='Server URL'
            type='url'
            placeholder='wss://example.com:5280/ws'
            value={serverUrl.value}
            onInput={(e) => serverUrl.value = e.currentTarget.value}
            error={errors.value.serverUrl}
            disabled={isLoading.value}
            required
            fullWidth
          />

          <Input
            label='JID (Jabber ID)'
            type='text'
            placeholder='user@example.com'
            value={jid.value}
            onInput={(e) => jid.value = e.currentTarget.value}
            error={errors.value.jid}
            disabled={isLoading.value}
            required
            fullWidth
          />

          <Input
            label='Password'
            type='password'
            placeholder='Your password'
            value={password.value}
            onInput={(e) => password.value = e.currentTarget.value}
            error={errors.value.password}
            disabled={isLoading.value}
            required
            fullWidth
          />

          <Button
            type='submit'
            variant='primary'
            size='lg'
            disabled={isLoading.value}
            fullWidth
          >
            {isLoading.value ? 'Connecting...' : 'Connect'}
          </Button>
        </form>

        <div class='footer'>
          <p class='footer-text'>
            A vibecoded XMPP chat client with audio/video support
          </p>
        </div>
      </div>
    </div>
  );
}
