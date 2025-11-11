/**
 * UI Signals
 *
 * Manages UI state (modals, notifications, theme, etc.) using Preact Signals.
 */

import { signal } from '@preact/signals';
import type { Modal, Notification, Toast } from '../src/types/ui.ts';
import { defaultTheme } from '../src/styles/theme.ts';

export type AppViewType =
  | 'login'
  | 'conversations'
  | 'chat'
  | 'contacts'
  | 'settings'
  | 'profile'
  | 'call';

export const currentView = signal<AppViewType>('login');
export const isSidebarOpen = signal<boolean>(true);
export const theme = signal(defaultTheme);
export const modals = signal<Modal[]>([]);
export const notifications = signal<Notification[]>([]);
export const toasts = signal<Toast[]>([]);

export function showToast(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration = 3000,
) {
  const toast: Toast = {
    id: crypto.randomUUID(),
    message,
    type,
    duration,
    isVisible: true,
  };

  toasts.value = [...toasts.value, toast];

  setTimeout(() => {
    toasts.value = toasts.value.filter((item) => item.id !== toast.id);
  }, duration);
}

export function openModal(type: string, title: string, data?: unknown) {
  const modal: Modal = {
    id: crypto.randomUUID(),
    type: type as any,
    title,
    data,
    isOpen: true,
  };

  modals.value = [...modals.value, modal];
  return modal.id;
}

export function closeModal(id: string) {
  modals.value = modals.value.filter((modal) => modal.id !== id);
}
