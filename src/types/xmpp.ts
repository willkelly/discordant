/**
 * XMPP Protocol Type Definitions
 *
 * Comprehensive type definitions for XMPP stanzas, connections, and protocol elements.
 * Based on RFC 6120, RFC 6121, and related XEPs.
 */

/**
 * JID (Jabber ID) represents a unique identifier in XMPP
 * Format: [localpart]@domainpart[/resourcepart]
 */
export interface JID {
  /** Local part (username) */
  local?: string;
  /** Domain part (server) */
  domain: string;
  /** Resource part (specific connection/device) */
  resource?: string;
  /** Full JID as string */
  full: string;
  /** Bare JID (without resource) */
  bare: string;
}

/**
 * XMPP Connection States
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  AUTHENTICATING = 'authenticating',
  AUTHENTICATED = 'authenticated',
  DISCONNECTING = 'disconnecting',
  ERROR = 'error',
}

/**
 * XMPP Connection Configuration
 */
export interface ConnectionConfig {
  /** XMPP server URL (e.g., wss://example.com:5280/ws) */
  serviceUrl: string;
  /** User JID */
  jid: string;
  /** Authentication password */
  password: string;
  /** Resource identifier (optional) */
  resource?: string;
  /** Connection timeout in milliseconds */
  timeout?: number;
  /** Enable automatic reconnection */
  autoReconnect?: boolean;
  /** Reconnection interval in milliseconds */
  reconnectInterval?: number;
}

/**
 * Base XMPP Stanza
 * All XMPP stanzas inherit from this
 */
export interface Stanza {
  /** Stanza type */
  type?: string;
  /** Stanza ID */
  id?: string;
  /** Sender JID */
  from?: string;
  /** Recipient JID */
  to?: string;
  /** XML representation */
  xml?: Element;
}

/**
 * XMPP Message Stanza Types
 */
export enum MessageType {
  CHAT = 'chat',
  GROUPCHAT = 'groupchat',
  HEADLINE = 'headline',
  NORMAL = 'normal',
  ERROR = 'error',
}

/**
 * XMPP Message Stanza
 */
export interface MessageStanza extends Stanza {
  type: MessageType;
  /** Message body text */
  body?: string;
  /** Message subject */
  subject?: string;
  /** Message thread ID for conversation tracking */
  thread?: string;
  /** Timestamp */
  timestamp?: Date;
  /** Chat state (composing, paused, etc.) */
  chatState?: ChatState;
  /** File attachments */
  attachments?: FileAttachment[];
}

/**
 * Chat State Notifications (XEP-0085)
 */
export enum ChatState {
  ACTIVE = 'active',
  COMPOSING = 'composing',
  PAUSED = 'paused',
  INACTIVE = 'inactive',
  GONE = 'gone',
}

/**
 * XMPP Presence Stanza Types
 */
export enum PresenceType {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  SUBSCRIBE = 'subscribe',
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBE = 'unsubscribe',
  UNSUBSCRIBED = 'unsubscribed',
  PROBE = 'probe',
  ERROR = 'error',
}

/**
 * Presence Show States
 */
export enum PresenceShow {
  CHAT = 'chat',
  AWAY = 'away',
  XA = 'xa', // Extended Away
  DND = 'dnd', // Do Not Disturb
}

/**
 * XMPP Presence Stanza
 */
export interface PresenceStanza extends Stanza {
  type?: PresenceType;
  /** Presence availability (chat, away, xa, dnd) */
  show?: PresenceShow;
  /** Status message */
  status?: string;
  /** Priority (-128 to 127) */
  priority?: number;
}

/**
 * XMPP IQ (Info/Query) Stanza Types
 */
export enum IQType {
  GET = 'get',
  SET = 'set',
  RESULT = 'result',
  ERROR = 'error',
}

/**
 * XMPP IQ Stanza
 */
export interface IQStanza extends Stanza {
  type: IQType;
  /** Query element */
  query?: unknown;
}

/**
 * XMPP Error
 */
export interface XMPPError {
  /** Error type (auth, cancel, continue, modify, wait) */
  type: string;
  /** Error condition */
  condition: string;
  /** Human-readable error text */
  text?: string;
  /** Application-specific error */
  applicationError?: unknown;
}

/**
 * File Attachment (for file sharing)
 */
export interface FileAttachment {
  /** Unique identifier */
  id: string;
  /** File name */
  name: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Download URL */
  url?: string;
  /** Upload progress (0-100) */
  uploadProgress?: number;
  /** Thumbnail URL for images */
  thumbnailUrl?: string;
}
