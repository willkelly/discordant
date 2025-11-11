<script lang="ts">
  /**
   * Message List Component
   *
   * Displays messages in a conversation.
   */

  import { onMount, afterUpdate } from 'svelte';
  import { activeMessages } from '@stores/conversations';
  import { currentUser } from '@stores/user';
  import Avatar from '../shared/Avatar.svelte';
  import type { ChatMessage } from '@types/chat';

  let messagesContainer: HTMLDivElement;
  let shouldAutoScroll = true;

  function isOwnMessage(message: ChatMessage): boolean {
    return message.from.bare === $currentUser?.jid.bare;
  }

  function formatMessageTime(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function handleScroll() {
    if (!messagesContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    shouldAutoScroll = isAtBottom;
  }

  function scrollToBottom() {
    if (messagesContainer && shouldAutoScroll) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  afterUpdate(() => {
    scrollToBottom();
  });

  onMount(() => {
    scrollToBottom();
  });
</script>

<div class="message-list" bind:this={messagesContainer} on:scroll={handleScroll}>
  {#if $activeMessages.length === 0}
    <div class="empty-state">
      <p>No messages yet</p>
      <p class="empty-subtitle">Send a message to start the conversation</p>
    </div>
  {:else}
    <div class="messages">
      {#each $activeMessages as message (message.id)}
        <div
          class="message-wrapper"
          class:own={isOwnMessage(message)}
          class:system={message.isSystem}
        >
          {#if !isOwnMessage(message) && !message.isSystem}
            <Avatar
              src={undefined}
              alt={message.from.bare}
              initials={message.from.local?.substring(0, 2) || 'U'}
              size="sm"
            />
          {/if}

          <div class="message-bubble">
            {#if !isOwnMessage(message) && !message.isSystem}
              <div class="message-sender">{message.from.bare}</div>
            {/if}

            {#if message.contentType === 'text' || message.contentType === 'system'}
              <div class="message-body">{message.body}</div>
            {:else if message.contentType === 'image'}
              <div class="message-image">
                {#each message.attachments as attachment}
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    loading="lazy"
                  />
                {/each}
                {#if message.body}
                  <div class="message-body">{message.body}</div>
                {/if}
              </div>
            {:else if message.contentType === 'file'}
              <div class="message-file">
                {#each message.attachments as attachment}
                  <a
                    href={attachment.url}
                    download={attachment.name}
                    class="file-link"
                  >
                    📎 {attachment.name}
                    <span class="file-size">
                      ({Math.round(attachment.size / 1024)}KB)
                    </span>
                  </a>
                {/each}
                {#if message.body}
                  <div class="message-body">{message.body}</div>
                {/if}
              </div>
            {/if}

            <div class="message-meta">
              <span class="message-time">{formatMessageTime(message.timestamp)}</span>
              {#if isOwnMessage(message)}
                <span class="message-status">
                  {#if message.status === 'sending'}
                    ⏳
                  {:else if message.status === 'sent'}
                    ✓
                  {:else if message.status === 'delivered'}
                    ✓✓
                  {:else if message.status === 'read'}
                    <span class="read-receipt">✓✓</span>
                  {:else if message.status === 'failed'}
                    ❌
                  {/if}
                </span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .message-wrapper {
    display: flex;
    gap: var(--spacing-sm);
    align-items: flex-end;
  }

  .message-wrapper.own {
    flex-direction: row-reverse;
  }

  .message-wrapper.system {
    justify-content: center;
  }

  .message-bubble {
    max-width: 70%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .message-wrapper.own .message-bubble {
    align-items: flex-end;
  }

  .message-wrapper.system .message-bubble {
    max-width: 100%;
    align-items: center;
  }

  .message-sender {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  .message-body {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-elevated);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: var(--color-text-primary);
    word-wrap: break-word;
    white-space: pre-wrap;
    box-shadow: var(--shadow-sm);
  }

  .message-wrapper.own .message-body {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  .message-wrapper.system .message-body {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    text-align: center;
  }

  .message-image {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .message-image img {
    max-width: 400px;
    max-height: 300px;
    border-radius: var(--radius-md);
    object-fit: cover;
    box-shadow: var(--shadow-md);
  }

  .message-file {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .file-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-elevated);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-primary);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .file-link:hover {
    background-color: var(--color-bg-secondary);
    border-color: var(--color-primary);
  }

  .file-size {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    margin-left: auto;
  }

  .message-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    padding: 0 var(--spacing-sm);
  }

  .message-wrapper.own .message-meta {
    flex-direction: row-reverse;
  }

  .read-receipt {
    color: var(--color-status-info);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    padding: var(--spacing-3xl);
  }

  .empty-state p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  .empty-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
  }
</style>
