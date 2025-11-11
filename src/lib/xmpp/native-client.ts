/**
 * Native XMPP Client using WebSocket
 *
 * Pure Deno/Web Standards implementation - no external XMPP libraries needed.
 */

import { $iq, $msg, $pres, getBareJid, getDomain, getLocal, parseXML } from './xml.ts';
import { SASLAuth } from './sasl.ts';
import { connectionConfig, connectionState } from '../../stores/connection.ts';
import { currentUser } from '../../stores/user.ts';
import { activeConversationId, conversations, messages } from '../../stores/conversations.ts';
import { showToast } from '../../stores/ui.ts';
import type { ConnectionConfig } from '../../types/xmpp.ts';
import type { ChatMessage, Conversation } from '../../types/chat.ts';

type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'authenticating'
  | 'authenticated'
  | 'disconnecting'
  | 'error';

export class NativeXMPPClient {
  private ws: WebSocket | null = null;
  private jid: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private streamId: string | null = null;
  private handlers: Map<string, ((elem: Element) => boolean)[]> = new Map();

  /**
   * Connect to XMPP server via WebSocket
   */
  connect(config: ConnectionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        connectionConfig.set(config);
        connectionState.set('connecting');

        // Extract domain from JID
        const domain = getDomain(config.jid);

        // Construct WebSocket URL (standard XMPP WebSocket endpoint)
        let wsUrl = config.serviceUrl;
        if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
          // Assume HTTPS and construct WebSocket URL
          const isSecure = !wsUrl.startsWith('http://');
          const protocol = isSecure ? 'wss://' : 'ws://';
          const host = wsUrl.replace(/^https?:\/\//, '');
          wsUrl = `${protocol}${host}/xmpp-websocket`;
        }

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.sendStreamHeader(domain);
        };

        this.ws.onmessage = (event) => {
          const data = event.data;
          if (typeof data === 'string') {
            this.handleStanza(data, config, resolve, reject);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          connectionState.set('error');
          reject(new Error('WebSocket connection error'));
        };

        this.ws.onclose = () => {
          this.onDisconnected();
        };
      } catch (error) {
        connectionState.set('error');
        reject(error);
      }
    });
  }

  /**
   * Send XMPP stream header
   */
  private sendStreamHeader(domain: string): void {
    const header = `<?xml version='1.0'?>` +
      `<stream:stream to='${domain}' xmlns='jabber:client' ` +
      `xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>`;
    this.send(header);
  }

  /**
   * Handle incoming stanzas
   */
  private handleStanza(
    data: string,
    config: ConnectionConfig,
    resolve: () => void,
    reject: (error: Error) => void,
  ): void {
    try {
      // Handle stream start
      if (data.includes('<stream:stream')) {
        const streamMatch = data.match(/id=['"]([^'"]+)['"]/);
        if (streamMatch) {
          this.streamId = streamMatch[1];
        }
        // Wait for stream features
        return;
      }

      // Wrap partial XML in a root element for parsing
      const wrappedData = `<root>${data}</root>`;
      const doc = parseXML(wrappedData);
      const root = doc.documentElement;

      // Handle stream features
      const features = root.querySelector('stream\\:features, features');
      if (features) {
        this.handleStreamFeatures(features, config, resolve, reject);
        return;
      }

      // Handle SASL success
      const success = root.querySelector('success');
      if (success) {
        connectionState.set('authenticated');
        // Restart stream after auth
        this.sendStreamHeader(getDomain(config.jid));
        return;
      }

      // Handle SASL failure
      const failure = root.querySelector('failure');
      if (failure) {
        connectionState.set('error');
        reject(new Error('Authentication failed'));
        return;
      }

      // Handle IQ (used for bind and session)
      const iq = root.querySelector('iq');
      if (iq) {
        this.handleIQ(iq, config, resolve);
        return;
      }

      // Handle regular stanzas after authenticated
      const message = root.querySelector('message');
      if (message) {
        this.processHandlers('message', message);
        return;
      }

      const presence = root.querySelector('presence');
      if (presence) {
        this.processHandlers('presence', presence);
        return;
      }
    } catch (error) {
      console.error('Error handling stanza:', error, data);
    }
  }

  /**
   * Handle stream features
   */
  private handleStreamFeatures(
    features: Element,
    config: ConnectionConfig,
    resolve: () => void,
    reject: (error: Error) => void,
  ): void {
    // Check for SASL mechanisms
    const mechanisms = features.querySelector('mechanisms');
    if (mechanisms && !this.jid) {
      // Authenticate
      connectionState.set('authenticating');
      const plain = Array.from(mechanisms.querySelectorAll('mechanism'))
        .find((m) => m.textContent === 'PLAIN');

      if (plain) {
        const username = getLocal(config.jid) || config.jid;
        const sasl = new SASLAuth(username, config.password, 'PLAIN');
        const authString = sasl.getInitialResponse();

        const auth =
          `<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>${authString}</auth>`;
        this.send(auth);
      } else {
        reject(new Error('No supported SASL mechanisms'));
      }
      return;
    }

    // After auth, check for bind
    const bind = features.querySelector('bind');
    if (bind && !this.jid) {
      // Bind resource
      const resource = config.resource || `deno-${crypto.randomUUID().slice(0, 8)}`;
      const bindIQ = $iq({ type: 'set', id: 'bind_1' })
        .c('bind', { xmlns: 'urn:ietf:params:xml:ns:xmpp-bind' })
        .c('resource').t(resource);

      this.send(bindIQ.toString());
      return;
    }

    // After bind, check for session (older servers)
    const session = features.querySelector('session');
    if (session && this.jid) {
      const sessionIQ = $iq({ type: 'set', id: 'session_1' })
        .c('session', { xmlns: 'urn:ietf:params:xml:ns:xmpp-session' });

      this.send(sessionIQ.toString());
      return;
    }

    // If we have a JID and no more setup needed, we're connected
    if (this.jid) {
      connectionState.set('connected');
      this.onConnected();
      resolve();
    }
  }

  /**
   * Handle IQ stanzas
   */
  private handleIQ(
    iq: Element,
    _config: ConnectionConfig,
    resolve: () => void,
  ): void {
    const id = iq.getAttribute('id');
    const type = iq.getAttribute('type');

    if (id === 'bind_1' && type === 'result') {
      // Extract bound JID
      const jidElem = iq.querySelector('jid');
      if (jidElem?.textContent) {
        this.jid = jidElem.textContent;

        // Set current user
        currentUser.set({
          jid: {
            full: this.jid,
            bare: getBareJid(this.jid),
            domain: getDomain(this.jid),
            local: getLocal(this.jid),
          },
          displayName: getLocal(this.jid) || this.jid,
          presence: 'chat',
        });

        // Check if we need session establishment
        // Modern servers don't require this, so we might be done
        connectionState.set('connected');
        this.onConnected();
        resolve();
      }
    }

    if (id === 'session_1' && type === 'result') {
      // Session established
      connectionState.set('connected');
      this.onConnected();
      resolve();
    }

    // Process other IQ handlers
    this.processHandlers('iq', iq);
  }

  /**
   * Called when successfully connected
   */
  private onConnected(): void {
    // Send initial presence
    const pres = $pres();
    this.send(pres.toString());

    // Set up default message handler
    this.addHandler(
      (stanza) => this.onMessage(stanza),
      'message',
      'chat',
    );

    // Set up default presence handler
    this.addHandler(
      (stanza) => this.onPresence(stanza),
      'presence',
    );

    this.reconnectAttempts = 0;
  }

  /**
   * Called when disconnected
   */
  private onDisconnected(): void {
    connectionState.set('disconnected');

    const config = new Promise<ConnectionConfig | null>((resolve) => {
      const unsubscribe = connectionConfig.subscribe((c) => {
        unsubscribe();
        resolve(c);
      });
    });

    config.then((c) => {
      if (c?.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        showToast(
          `Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
          'info',
        );

        setTimeout(() => {
          if (c) {
            this.connect(c);
          }
        }, c.reconnectInterval || 5000);
      }
    });
  }

  /**
   * Add stanza handler
   */
  addHandler(
    handler: (elem: Element) => boolean,
    name?: string,
    type?: string,
  ): void {
    const key = `${name || 'any'}:${type || 'any'}`;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
    this.handlers.get(key)!.push(handler);
  }

  /**
   * Process handlers for a stanza
   */
  private processHandlers(name: string, elem: Element): void {
    const type = elem.getAttribute('type') || 'any';
    const keys = [
      `${name}:${type}`,
      `${name}:any`,
      `any:${type}`,
      'any:any',
    ];

    for (const key of keys) {
      const handlers = this.handlers.get(key);
      if (handlers) {
        for (const handler of handlers) {
          try {
            const shouldContinue = handler(elem);
            if (!shouldContinue) break;
          } catch (error) {
            console.error('Handler error:', error);
          }
        }
      }
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

    const bareJid = getBareJid(from);
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
              domain: getDomain(from),
              local: getLocal(from),
            },
          ],
          title: getLocal(from) || bareJid,
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
        domain: getDomain(from),
        local: getLocal(from),
      },
      to: {
        full: this.jid || '',
        bare: getBareJid(this.jid || ''),
        domain: getDomain(this.jid || ''),
        local: getLocal(this.jid || ''),
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
    if (!this.ws || !to) {
      // Get active conversation
      const promise = new Promise<string | null>((resolve) => {
        const unsubscribe = activeConversationId.subscribe((id) => {
          unsubscribe();
          resolve(id);
        });
      });

      promise.then((activeId) => {
        if (!activeId) {
          showToast('No active conversation', 'error');
          return;
        }
        this.doSendMessage(text, activeId);
      });
      return;
    }

    this.doSendMessage(text, to);
  }

  /**
   * Actually send the message
   */
  private doSendMessage(text: string, to: string): void {
    const msg = $msg({
      to,
      type: 'chat',
    }).c('body').t(text);

    this.send(msg.toString());

    // Add to local message store
    const chatMessage: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: to,
      from: {
        full: this.jid || '',
        bare: getBareJid(this.jid || ''),
        domain: getDomain(this.jid || ''),
        local: getLocal(this.jid || ''),
      },
      to: {
        full: to,
        bare: getBareJid(to),
        domain: getDomain(to),
        local: getLocal(to),
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
      const convMessages = msgs.get(to) || [];
      convMessages.push(chatMessage);
      msgs.set(to, convMessages);
      return msgs;
    });

    // Update conversation
    conversations.update((convs) => {
      const conv = convs.get(to);
      if (conv) {
        conv.lastMessage = chatMessage;
        conv.lastActivityAt = new Date();
        convs.set(to, conv);
      }
      return convs;
    });
  }

  /**
   * Send presence update
   */
  sendPresence(show: string, status?: string): void {
    if (!this.ws) return;

    const pres = $pres();
    if (show !== 'chat') {
      pres.c('show').t(show);
    }
    if (status) {
      pres.c('status').t(status);
    }

    this.send(pres.toString());
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.ws) {
      // Send closing stream tag
      this.send('</stream:stream>');
      this.ws.close();
      this.ws = null;
      this.jid = null;
      this.streamId = null;
    }
  }

  /**
   * Send raw XML
   */
  private send(data: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }
}

// Export singleton instance
export const xmppClient = new NativeXMPPClient();
