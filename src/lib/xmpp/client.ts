/**
 * XMPP Client Service
 *
 * Manages XMPP connection and messaging using Strophe.js.
 */

import { Strophe } from 'strophe.js';
import { connectionState, connectionConfig } from '../../stores/connection';
import { currentUser } from '../../stores/user';
import { conversations, messages, activeConversationId } from '../../stores/conversations';
import { showToast } from '../../stores/ui';
import type { ConnectionConfig, MessageStanza, PresenceStanza } from '../../types/xmpp';
import type { ChatMessage, Conversation } from '../../types/chat';

class XMPPClient {
  private connection: any | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to XMPP server
   */
  async connect(config: ConnectionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        connectionConfig.set(config);
        connectionState.set('connecting');

        this.connection = new Strophe.Connection(config.serviceUrl);

        // Set up connection status callback
        this.connection.connect(
          config.jid,
          config.password,
          (status: number) => this.onConnectionStatusChange(status, resolve, reject)
        );
      } catch (error) {
        connectionState.set('error');
        reject(error);
      }
    });
  }

  /**
   * Handle connection status changes
   */
  private onConnectionStatusChange(
    status: number,
    resolve: () => void,
    reject: (error: Error) => void
  ): void {
    const { Status } = Strophe;

    switch (status) {
      case Status.CONNECTING:
        connectionState.set('connecting');
        break;

      case Status.CONNECTED:
        connectionState.set('connected');
        this.onConnected();
        resolve();
        break;

      case Status.AUTHENTICATING:
        connectionState.set('authenticating');
        break;

      case Status.AUTHFAIL:
        connectionState.set('error');
        reject(new Error('Authentication failed'));
        break;

      case Status.CONNFAIL:
        connectionState.set('error');
        reject(new Error('Connection failed'));
        break;

      case Status.DISCONNECTED:
        connectionState.set('disconnected');
        this.onDisconnected();
        break;

      case Status.DISCONNECTING:
        connectionState.set('disconnecting');
        break;

      case Status.ERROR:
        connectionState.set('error');
        reject(new Error('Connection error'));
        break;
    }
  }

  /**
   * Called when successfully connected
   */
  private onConnected(): void {
    if (!this.connection) return;

    // Set up message handler
    this.connection.addHandler(
      (stanza) => this.onMessage(stanza),
      null,
      'message',
      'chat'
    );

    // Set up presence handler
    this.connection.addHandler(
      (stanza) => this.onPresence(stanza),
      null,
      'presence'
    );

    // Send initial presence
    const presence = Strophe.$pres();
    this.connection.send(presence);

    // Set current user
    const jid = this.connection.jid;
    if (jid) {
      currentUser.set({
        jid: {
          full: jid,
          bare: Strophe.getBareJidFromJid(jid),
          domain: Strophe.getDomainFromJid(jid),
          local: Strophe.getNodeFromJid(jid),
        },
        displayName: Strophe.getNodeFromJid(jid) || jid,
        presence: 'chat',
      });
    }

    this.reconnectAttempts = 0;
  }

  /**
   * Called when disconnected
   */
  private onDisconnected(): void {
    const config = connectionConfig.subscribe((c) => c)();

    if (config?.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      showToast(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`, 'info');

      setTimeout(() => {
        if (config) {
          this.connect(config);
        }
      }, config.reconnectInterval || 5000);
    }
  }

  /**
   * Handle incoming messages
   */
  private onMessage(stanza: Element): boolean {
    const from = stanza.getAttribute('from');
    const type = stanza.getAttribute('type');
    const body = stanza.querySelector('body')?.textContent;

    if (!from || !body || type !== 'chat') {
      return true;
    }

    const bareJid = Strophe.getBareJidFromJid(from);
    const conversationId = bareJid;

    // Get or create conversation
    conversations.update((convs) => {
      if (!convs.has(conversationId)) {
        const newConv: Conversation = {
          id: conversationId,
          type: 'direct',
          participants: [
            {
              full: from,
              bare: bareJid,
              domain: Strophe.getDomainFromJid(from),
              local: Strophe.getNodeFromJid(from),
            },
          ],
          title: Strophe.getNodeFromJid(from) || bareJid,
          unreadCount: 0,
          isPinned: false,
          isMuted: false,
          isArchived: false,
          createdAt: new Date(),
          lastActivityAt: new Date(),
          typingUsers: new Map(),
        };
        convs.set(conversationId, newConv);
      }
      return convs;
    });

    // Create message
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId,
      from: {
        full: from,
        bare: bareJid,
        domain: Strophe.getDomainFromJid(from),
        local: Strophe.getNodeFromJid(from),
      },
      to: {
        full: this.connection?.jid || '',
        bare: Strophe.getBareJidFromJid(this.connection?.jid || ''),
        domain: Strophe.getDomainFromJid(this.connection?.jid || ''),
        local: Strophe.getNodeFromJid(this.connection?.jid || ''),
      },
      direction: 'incoming',
      contentType: 'text',
      body,
      attachments: [],
      status: 'delivered',
      timestamp: new Date(),
      isRead: false,
      reactions: [],
      isSystem: false,
    };

    // Add message to store
    messages.update((msgs) => {
      const convMessages = msgs.get(conversationId) || [];
      convMessages.push(message);
      msgs.set(conversationId, convMessages);
      return msgs;
    });

    // Update conversation
    conversations.update((convs) => {
      const conv = convs.get(conversationId);
      if (conv) {
        conv.lastMessage = message;
        conv.lastActivityAt = new Date();
        conv.unreadCount++;
        convs.set(conversationId, conv);
      }
      return convs;
    });

    return true;
  }

  /**
   * Handle presence updates
   */
  private onPresence(stanza: Element): boolean {
    const from = stanza.getAttribute('from');
    const type = stanza.getAttribute('type');
    const show = stanza.querySelector('show')?.textContent || 'chat';

    console.log('Presence:', { from, type, show });

    // Handle presence updates here
    // Update contact presence in store

    return true;
  }

  /**
   * Send a chat message
   */
  sendMessage(text: string, to?: string): void {
    if (!this.connection || !to) {
      // Get active conversation
      const activeId = activeConversationId.subscribe((id) => id)();
      if (!activeId) {
        showToast('No active conversation', 'error');
        return;
      }
      to = activeId;
    }

    const message = Strophe.$msg({
      to,
      type: 'chat',
    }).c('body').t(text);

    this.connection.send(message);

    // Add to local message store
    const chatMessage: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: to,
      from: {
        full: this.connection.jid || '',
        bare: Strophe.getBareJidFromJid(this.connection.jid || ''),
        domain: Strophe.getDomainFromJid(this.connection.jid || ''),
        local: Strophe.getNodeFromJid(this.connection.jid || ''),
      },
      to: {
        full: to,
        bare: Strophe.getBareJidFromJid(to),
        domain: Strophe.getDomainFromJid(to),
        local: Strophe.getNodeFromJid(to),
      },
      direction: 'outgoing',
      contentType: 'text',
      body: text,
      attachments: [],
      status: 'sent',
      timestamp: new Date(),
      isRead: true,
      reactions: [],
      isSystem: false,
    };

    messages.update((msgs) => {
      const convMessages = msgs.get(to!) || [];
      convMessages.push(chatMessage);
      msgs.set(to!, convMessages);
      return msgs;
    });

    // Update conversation
    conversations.update((convs) => {
      const conv = convs.get(to!);
      if (conv) {
        conv.lastMessage = chatMessage;
        conv.lastActivityAt = new Date();
        convs.set(to!, conv);
      }
      return convs;
    });
  }

  /**
   * Disconnect from XMPP server
   */
  disconnect(): void {
    if (this.connection) {
      this.connection.disconnect();
      this.connection = null;
    }
  }

  /**
   * Send presence update
   */
  sendPresence(show: string, status?: string): void {
    if (!this.connection) return;

    const presence = Strophe.$pres();
    if (show !== 'chat') {
      presence.c('show').t(show);
    }
    if (status) {
      presence.c('status').t(status);
    }

    this.connection.send(presence);
  }
}

// Export singleton instance
export const xmppClient = new XMPPClient();
