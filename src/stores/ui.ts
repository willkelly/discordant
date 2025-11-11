/**
 * UI Store
 *
 * Manages UI state (modals, notifications, theme, etc.)
 */

import { writable } from 'svelte/store';
import type { AppView, Modal, Notification, Toast } from '@types/ui';
import { defaultTheme } from '../styles/theme';

export const currentView = writable<AppView>('login' as AppView);
export const isSidebarOpen = writable<boolean>(true);
export const theme = writable(defaultTheme);
export const modals = writable<Modal[]>([]);
export const notifications = writable<Notification[]>([]);
export const toasts = writable<Toast[]>([]);

export function showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration = 3000) {
  const toast: Toast = {
    id: crypto.randomUUID(),
    message,
    type,
    duration,
    isVisible: true,
  };

  toasts.update((t) => [...t, toast]);

  setTimeout(() => {
    toasts.update((t) => t.filter((item) => item.id !== toast.id));
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

  modals.update((m) => [...m, modal]);
  return modal.id;
}

export function closeModal(id: string) {
  modals.update((m) => m.filter((modal) => modal.id !== id));
}
