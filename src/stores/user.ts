/**
 * User Store
 *
 * Manages current user account information.
 */

import { writable } from 'svelte/store';
import type { UserAccount } from '../types/user';

export const currentUser = writable<UserAccount | null>(null);
export const userPresence = writable<string>('available');
export const userStatus = writable<string>('');
