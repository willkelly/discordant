/**
 * XMPP Connection Store
 *
 * Manages the XMPP connection state and configuration.
 */

import { writable, derived } from 'svelte/store';
import type { ConnectionConfig } from '../types/xmpp';

export type ConnectionStateType = 'disconnected' | 'connecting' | 'connected' | 'authenticating' | 'authenticated' | 'disconnecting' | 'error';

export const connectionState = writable<ConnectionStateType>('disconnected');
export const connectionConfig = writable<ConnectionConfig | null>(null);
export const connectionError = writable<string | null>(null);

export const isConnected = derived(
  connectionState,
  ($state) => $state === 'connected' || $state === 'authenticated'
);

export const isConnecting = derived(
  connectionState,
  ($state) => $state === 'connecting' || $state === 'authenticating'
);
