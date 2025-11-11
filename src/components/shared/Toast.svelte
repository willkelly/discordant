<script lang="ts">
  /**
   * Toast Component
   *
   * Displays temporary notification messages.
   */

  import { toasts } from '@stores/ui';
  import { fly, fade } from 'svelte/transition';
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast toast-{toast.type}"
      transition:fly={{ y: -20, duration: 300 }}
    >
      <span class="toast-message">{toast.message}</span>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    z-index: var(--z-toast);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    pointer-events: none;
  }

  .toast {
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-bg-elevated);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    pointer-events: auto;
    min-width: 250px;
    max-width: 400px;
    border-left: 4px solid;
  }

  .toast-info {
    border-left-color: var(--color-status-info);
  }

  .toast-success {
    border-left-color: var(--color-status-success);
  }

  .toast-warning {
    border-left-color: var(--color-status-warning);
  }

  .toast-error {
    border-left-color: var(--color-status-error);
  }

  .toast-message {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    line-height: var(--line-height-normal);
  }
</style>
