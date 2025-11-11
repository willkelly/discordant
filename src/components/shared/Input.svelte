<script lang="ts">
  /**
   * Input Component
   *
   * Reusable text input with label and error states.
   */

  import { onMount } from 'svelte';

  export let type: 'text' | 'password' | 'email' | 'url' = 'text';
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let fullWidth = false;
  export let id = '';

  onMount(() => {
    if (!id) {
      id = `input-${Math.random().toString(36).substring(2, 11)}`;
    }
  });
</script>

<div class="input-wrapper" class:full-width={fullWidth}>
  {#if label}
    <label for={id} class="label">
      {label}
      {#if required}
        <span class="required">*</span>
      {/if}
    </label>
  {/if}

  {#if type === 'text'}
    <input
      {id}
      type="text"
      {placeholder}
      {disabled}
      {required}
      class="input"
      class:error={!!error}
      bind:value
      on:input
      on:change
      on:focus
      on:blur
    />
  {:else if type === 'password'}
    <input
      {id}
      type="password"
      {placeholder}
      {disabled}
      {required}
      class="input"
      class:error={!!error}
      bind:value
      on:input
      on:change
      on:focus
      on:blur
    />
  {:else if type === 'email'}
    <input
      {id}
      type="email"
      {placeholder}
      {disabled}
      {required}
      class="input"
      class:error={!!error}
      bind:value
      on:input
      on:change
      on:focus
      on:blur
    />
  {:else if type === 'url'}
    <input
      {id}
      type="url"
      {placeholder}
      {disabled}
      {required}
      class="input"
      class:error={!!error}
      bind:value
      on:input
      on:change
      on:focus
      on:blur
    />
  {/if}

  {#if error}
    <span class="error-message">{error}</span>
  {/if}
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .full-width {
    width: 100%;
  }

  .label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
  }

  .required {
    color: var(--color-status-error);
  }

  .input {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
    font-family: var(--font-family);
    color: var(--color-text-primary);
    background-color: var(--color-bg-elevated);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    outline: none;
    min-height: 2.5rem;
  }

  .input::placeholder {
    color: var(--color-text-tertiary);
  }

  .input:hover:not(:disabled) {
    border-color: var(--color-secondary);
  }

  .input:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px rgba(149, 106, 40, 0.1);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input.error {
    border-color: var(--color-status-error);
  }

  .input.error:focus {
    box-shadow: 0 0 0 3px rgba(184, 92, 80, 0.1);
  }

  .error-message {
    font-size: var(--font-size-sm);
    color: var(--color-status-error);
  }
</style>
