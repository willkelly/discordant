/**
 * XMPP Connection Store
 *
 * Manages the XMPP connection state and configuration.
 */

import { writable, derived } from 'svelte/store';
import type { ConnectionState, ConnectionConfig } from '@types/xmpp';

export const connectionState = writable<ConnectionState>('disconnected' as ConnectionState);
export const connectionConfig = writable<ConnectionConfig | null>(null);
export const connectionError = writable<string | null>(null);

export const isConnected = derived(
  connectionState,
  ($state) => $state === ('connected' as ConnectionState) || $state === ('authenticated' as ConnectionState)
);

export const isConnecting = derived(
  connectionState,
  ($state) => $state === ('connecting' as ConnectionState) || $state === ('authenticating' as ConnectionState)
);
