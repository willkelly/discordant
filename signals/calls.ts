/**
 * Calls Signals
 *
 * Manages audio/video calls using Preact Signals.
 */

import { computed, signal } from '@preact/signals';
import type { Call, MediaSettings } from '../src/types/media.ts';

export const activeCalls = signal<Map<string, Call>>(new Map());
export const mediaSettings = signal<MediaSettings>({
  audioInputVolume: 100,
  audioOutputVolume: 100,
  videoResolution: '1280x720',
  videoFrameRate: 30,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
});

export const currentCall = computed(() => {
  if (activeCalls.value.size === 0) return null;
  return Array.from(activeCalls.value.values())[0];
});

export const isInCall = computed(() => {
  const call = currentCall.value;
  return call !== null && call.state !== 'ended' && call.state !== 'failed';
});
