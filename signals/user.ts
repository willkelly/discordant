/**
 * User Signals
 *
 * Manages current user account information using Preact Signals.
 */

import { signal } from '@preact/signals';
import type { UserAccount } from '../src/types/user.ts';

export const currentUser = signal<UserAccount | null>(null);
export const userPresence = signal<string>('available');
export const userStatus = signal<string>('');
