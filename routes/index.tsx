/**
 * Main Route
 *
 * Root route for Discordant app - handles login and chat views.
 */

import { isConnected } from '@signals/connection.ts';
import { showToast } from '@signals/ui.ts';
import LoginIsland from '../islands/LoginIsland.tsx';
import ConversationListIsland from '../islands/ConversationListIsland.tsx';
import ChatViewIsland from '../islands/ChatViewIsland.tsx';
import type { ConnectionConfig } from '@types/xmpp.ts';

// Import XMPP client (will be initialized here)
import { xmppClient } from '@lib/xmpp/client.ts';

export default function Home() {
  const connected = isConnected.value;

  async function handleLogin(config: ConnectionConfig) {
    try {
      await xmppClient.connect(config);
      showToast('Connected successfully!', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Connection failed',
        'error',
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

  if (!connected) {
    return (
      <main class='app'>
        <LoginIsland onLogin={handleLogin} />
      </main>
    );
  }

  return (
    <main class='app'>
      <div class='app-layout'>
        <aside class='sidebar'>
          <ConversationListIsland />
        </aside>

        <main class='main-content'>
          <ChatViewIsland
            onSendMessage={handleSendMessage}
            onUploadFiles={handleUploadFiles}
            onStartCall={handleStartCall}
          />
        </main>
      </div>
    </main>
  );
}
