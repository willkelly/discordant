<script lang="ts">
  /**
   * Button Component
   *
   * Reusable button with variants and sizes.
   */

  export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let fullWidth = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
  class="btn btn-{variant} btn-{size}"
  class:full-width={fullWidth}
  {disabled}
  {type}
  on:click
>
  <slot />
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    font-family: var(--font-family);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: none;
    outline: none;
  }

  .btn:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Sizes */
  .btn-sm {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
    min-height: 2rem;
  }

  .btn-md {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-base);
    min-height: 2.5rem;
  }

  .btn-lg {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-lg);
    min-height: 3rem;
  }

  /* Variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  .btn-primary:active:not(:disabled) {
    background-color: var(--color-primary-active);
  }

  .btn-secondary {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-primary);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--color-bg-secondary);
    border-color: var(--color-secondary);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--color-text-primary);
  }

  .btn-ghost:hover:not(:disabled) {
    background-color: var(--color-bg-secondary);
  }

  .btn-danger {
    background-color: var(--color-status-error);
    color: var(--color-text-inverse);
  }

  .btn-danger:hover:not(:disabled) {
    opacity: 0.9;
  }

  .full-width {
    width: 100%;
  }
</style>
