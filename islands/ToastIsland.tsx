/**
 * Toast Island
 *
 * Displays temporary notification messages from the toasts signal.
 */

import { toasts } from '@signals/ui.ts';

export default function ToastIsland() {
  const toastList = toasts.value;

  return (
    <div class='toast-container'>
      {toastList.map((toast) => (
        <div
          key={toast.id}
          class={`toast toast-${toast.type}`}
        >
          <span class='toast-message'>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
