<script lang="ts">
  /**
   * Chat View Component
   *
   * Main chat interface showing messages and input.
   */

  import { activeConversation } from '@stores/conversations';
  import MessageList from './MessageList.svelte';
  import MessageInput from './MessageInput.svelte';
  import Avatar from '../shared/Avatar.svelte';
  import Button from '../shared/Button.svelte';

  export let onSendMessage: (text: string) => void;
  export let onUploadFiles: (files: File[]) => void;
  export let onStartCall: (type: 'audio' | 'video') => void;

  function handleSend(event: CustomEvent<{ text: string }>) {
    onSendMessage(event.detail.text);
  }

  function handleUpload(event: CustomEvent<{ files: File[] }>) {
    onUploadFiles(event.detail.files);
  }
</script>

{#if $activeConversation}
  <div class="chat-view">
    <div class="chat-header">
      <div class="header-info">
        <Avatar
          src={$activeConversation.avatarUrl}
          alt={$activeConversation.title}
          initials={$activeConversation.title.substring(0, 2)}
          size="md"
        />
        <div class="header-text">
          <h3 class="conversation-title">{$activeConversation.title}</h3>
          <p class="conversation-status">
            {#if $activeConversation.type === 'group'}
              {$activeConversation.participants.length} members
            {:else}
              Online
            {/if}
          </p>
        </div>
      </div>

      <div class="header-actions">
        <Button
          variant="ghost"
          size="sm"
          on:click={() => onStartCall('audio')}
          title="Voice call"
        >
          📞
        </Button>
        <Button
          variant="ghost"
          size="sm"
          on:click={() => onStartCall('video')}
          title="Video call"
        >
          📹
        </Button>
      </div>
    </div>

    <MessageList />

    <MessageInput
      on:send={handleSend}
      on:upload={handleUpload}
    />
  </div>
{:else}
  <div class="empty-chat">
    <div class="empty-content">
      <h2>Welcome to Discordant</h2>
      <p>Select a conversation to start chatting</p>
    </div>
  </div>
{/if}

<style>
  .chat-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--color-bg-primary);
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    background-color: var(--color-bg-elevated);
    border-bottom: 1px solid var(--color-border-primary);
    box-shadow: var(--shadow-sm);
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .header-text {
    display: flex;
    flex-direction: column;
  }

  .conversation-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
  }

  .conversation-status {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .empty-chat {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: var(--color-bg-primary);
  }

  .empty-content {
    text-align: center;
    max-width: 400px;
    padding: var(--spacing-2xl);
  }

  .empty-content h2 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  .empty-content p {
    color: var(--color-text-secondary);
    margin-bottom: 0;
  }
</style>
