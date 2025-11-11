/**
 * XMPP Connection Signals
 *
 * Manages the XMPP connection state and configuration using Preact Signals.
 */

import { computed, signal } from '@preact/signals';
import type { ConnectionConfig } from '../src/types/xmpp.ts';

export type ConnectionStateType =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'authenticating'
  | 'authenticated'
  | 'disconnecting'
  | 'error';

export const connectionState = signal<ConnectionStateType>('disconnected');
export const connectionConfig = signal<ConnectionConfig | null>(null);
export const connectionError = signal<string | null>(null);

export const isConnected = computed(() => {
  const state = connectionState.value;
  return state === 'connected' || state === 'authenticated';
});

export const isConnecting = computed(() => {
  const state = connectionState.value;
  return state === 'connecting' || state === 'authenticating';
});
