<script lang="ts">
  /**
   * Message Input Component
   *
   * Input area for composing and sending messages.
   */

  import { createEventDispatcher } from 'svelte';
  import Button from '../shared/Button.svelte';

  const dispatch = createEventDispatcher();

  export let disabled = false;

  let message = '';
  let fileInput: HTMLInputElement;

  function handleSubmit() {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;

    dispatch('send', { text: trimmed });
    message = '';
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleFileSelect() {
    fileInput?.click();
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      dispatch('upload', { files: Array.from(files) });
      target.value = '';
    }
  }
</script>

<div class="message-input-container">
  <input
    type="file"
    bind:this={fileInput}
    on:change={handleFileChange}
    multiple
    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
    style="display: none;"
  />

  <div class="input-actions">
    <button
      class="action-button"
      type="button"
      on:click={handleFileSelect}
      disabled={disabled}
      title="Attach file"
    >
      📎
    </button>
  </div>

  <textarea
    class="message-input"
    placeholder="Type a message..."
    bind:value={message}
    on:keydown={handleKeyDown}
    {disabled}
    rows="1"
  />

  <div class="send-button-container">
    <Button
      variant="primary"
      size="sm"
      on:click={handleSubmit}
      disabled={disabled || !message.trim()}
    >
      Send
    </Button>
  </div>
</div>

<style>
  .message-input-container {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    background-color: var(--color-bg-elevated);
    border-top: 1px solid var(--color-border-primary);
  }

  .input-actions {
    display: flex;
    gap: var(--spacing-xs);
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    font-size: var(--font-size-lg);
  }

  .action-button:hover:not(:disabled) {
    background-color: var(--color-bg-secondary);
  }

  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .message-input {
    flex: 1;
    min-height: 2.5rem;
    max-height: 120px;
    padding: var(--spacing-sm) var(--spacing-md);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    color: var(--color-text-primary);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    resize: none;
    outline: none;
    transition: border-color var(--transition-fast);
  }

  .message-input::placeholder {
    color: var(--color-text-tertiary);
  }

  .message-input:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px rgba(149, 106, 40, 0.1);
  }

  .message-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .send-button-container {
    display: flex;
    align-items: flex-end;
  }
</style>
