<script lang="ts">
  /**
   * Main App Component
   *
   * Root component that manages app state and routing.
   */

  import { onMount } from 'svelte';
  import LoginForm from './components/auth/LoginForm.svelte';
  import ConversationList from './components/chat/ConversationList.svelte';
  import ChatView from './components/chat/ChatView.svelte';
  import Toast from './components/shared/Toast.svelte';
  import { currentView } from '@stores/ui';
  import { isConnected } from '@stores/connection';
  import { xmppClient } from './lib/xmpp/client';
  import { showToast } from '@stores/ui';
  import type { ConnectionConfig } from '@types/xmpp';

  let isInitialized = false;

  onMount(() => {
    isInitialized = true;
  });

  async function handleLogin(event: CustomEvent<ConnectionConfig>) {
    try {
      await xmppClient.connect(event.detail);
      currentView.set('conversations' as any);
      showToast('Connected successfully!', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Connection failed',
        'error'
      );
    }
  }

  function handleSendMessage(text: string) {
    xmppClient.sendMessage(text);
  }

  function handleUploadFiles(files: File[]) {
    console.log('Upload files:', files);
    showToast('File upload coming soon!', 'info');
  }

  function handleStartCall(type: 'audio' | 'video') {
    console.log('Start call:', type);
    showToast(`${type} calls coming soon!`, 'info');
  }
</script>

<main class="app">
  {#if !$isConnected}
    <LoginForm on:login={handleLogin} />
  {:else}
    <div class="app-layout">
      <aside class="sidebar">
        <ConversationList />
      </aside>

      <main class="main-content">
        <ChatView
          onSendMessage={handleSendMessage}
          onUploadFiles={handleUploadFiles}
          onStartCall={handleStartCall}
        />
      </main>
    </div>
  {/if}

  <Toast />
</main>

<style>
  .app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .app-layout {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 320px;
    flex-shrink: 0;
    border-right: 1px solid var(--color-border-primary);
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background-color: var(--color-bg-elevated);
      z-index: 100;
    }
  }
</style>
