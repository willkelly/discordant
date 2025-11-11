<script lang="ts">
  /**
   * Conversation List Component
   *
   * Displays list of conversations in the sidebar.
   */

  import { sortedConversations, activeConversationId } from '@stores/conversations';
  import Avatar from '../shared/Avatar.svelte';
  import type { Conversation } from '@types/chat';

  function selectConversation(conversation: Conversation) {
    activeConversationId.set(conversation.id);
  }

  function formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString();
  }

  function getLastMessagePreview(conversation: Conversation): string {
    if (conversation.draft) return `Draft: ${conversation.draft}`;
    if (!conversation.lastMessage) return 'No messages yet';

    const { lastMessage } = conversation;
    if (lastMessage.contentType === 'image') return '📷 Image';
    if (lastMessage.contentType === 'file') return '📎 File';
    if (lastMessage.contentType === 'audio') return '🎵 Audio';
    if (lastMessage.contentType === 'video') return '🎥 Video';

    return lastMessage.body || '';
  }
</script>

<div class="conversation-list">
  <div class="list-header">
    <h2 class="header-title">Messages</h2>
  </div>

  <div class="conversations">
    {#each $sortedConversations as conversation (conversation.id)}
      <button
        class="conversation-item"
        class:active={$activeConversationId === conversation.id}
        class:unread={conversation.unreadCount > 0}
        on:click={() => selectConversation(conversation)}
      >
        <Avatar
          src={conversation.avatarUrl}
          alt={conversation.title}
          initials={conversation.title.substring(0, 2)}
          size="md"
        />

        <div class="conversation-content">
          <div class="conversation-header">
            <span class="conversation-title">{conversation.title}</span>
            {#if conversation.lastMessage}
              <span class="conversation-time">
                {formatTime(conversation.lastActivityAt)}
              </span>
            {/if}
          </div>

          <div class="conversation-preview">
            <span class="preview-text line-clamp-2">
              {getLastMessagePreview(conversation)}
            </span>
            {#if conversation.unreadCount > 0}
              <span class="unread-badge">{conversation.unreadCount}</span>
            {/if}
          </div>
        </div>

        {#if conversation.isPinned}
          <div class="pin-indicator">📌</div>
        {/if}
      </button>
    {/each}

    {#if $sortedConversations.length === 0}
      <div class="empty-state">
        <p>No conversations yet</p>
        <p class="empty-subtitle">Start a new conversation to get started</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .conversation-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--color-bg-secondary);
  }

  .list-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-primary);
  }

  .header-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
  }

  .conversations {
    flex: 1;
    overflow-y: auto;
  }

  .conversation-item {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    width: 100%;
    padding: var(--spacing-md);
    background: none;
    border: none;
    border-bottom: 1px solid var(--color-border-secondary);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    text-align: left;
    position: relative;
  }

  .conversation-item:hover {
    background-color: var(--color-bg-tertiary);
  }

  .conversation-item.active {
    background-color: var(--color-bg-elevated);
    border-left: 3px solid var(--color-primary);
  }

  .conversation-item.unread {
    background-color: var(--color-bg-elevated);
  }

  .conversation-content {
    flex: 1;
    min-width: 0;
  }

  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
  }

  .conversation-title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .conversation-time {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    flex-shrink: 0;
  }

  .conversation-preview {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .preview-text {
    flex: 1;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: var(--line-height-normal);
  }

  .conversation-item.unread .preview-text {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  .unread-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 var(--spacing-xs);
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-full);
  }

  .pin-indicator {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-3xl) var(--spacing-lg);
    text-align: center;
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
