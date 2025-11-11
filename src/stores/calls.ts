/**
 * Calls Store
 *
 * Manages audio/video calls.
 */

import { derived, writable } from 'svelte/store';
import type { Call, MediaSettings } from '../types/media.ts';

export const activeCalls = writable<Map<string, Call>>(new Map());
export const mediaSettings = writable<MediaSettings>({
  audioInputVolume: 100,
  audioOutputVolume: 100,
  videoResolution: '1280x720',
  videoFrameRate: 30,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
});

export const currentCall = derived(activeCalls, ($calls) => {
  if ($calls.size === 0) return null;
  return Array.from($calls.values())[0];
});

export const isInCall = derived(currentCall, ($call) => {
  return $call !== null && $call.state !== 'ended' && $call.state !== 'failed';
});
