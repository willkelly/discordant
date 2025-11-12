/**
 * App Island
 *
 * Main application island that handles login/chat view switching
 * based on connection state.
 */

import { isConnected } from '@signals/connection.ts';
import { showToast } from '@signals/ui.ts';
import LoginIsland from './LoginIsland.tsx';
import ConversationListIsland from './ConversationListIsland.tsx';
import ChatViewIsland from './ChatViewIsland.tsx';
import type { ConnectionConfig } from '../src/types/xmpp.ts';

// Import XMPP client
import { xmppClient } from '@lib/xmpp/client.ts';

export default function AppIsland() {
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
      <div class='app'>
        <LoginIsland onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div class='app'>
      <div class='app-layout'>
        <aside class='sidebar'>
          <ConversationListIsland />
        </aside>

        <div class='main-content'>
          <ChatViewIsland
            onSendMessage={handleSendMessage}
            onUploadFiles={handleUploadFiles}
            onStartCall={handleStartCall}
          />
        </div>
      </div>
    </div>
  );
}
