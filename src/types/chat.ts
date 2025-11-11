/**
 * Chat and Conversation Type Definitions
 *
 * Types for messages, conversations, and chat-related functionality.
 */

import type { JID, ChatState, FileAttachment } from './xmpp';
import type { Contact } from './user';

/**
 * Message Direction
 */
export enum MessageDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

/**
 * Message Status
 */
export enum MessageStatus {
  /** Message is being sent */
  SENDING = 'sending',
  /** Message was sent */
  SENT = 'sent',
  /** Message was delivered to server */
  DELIVERED = 'delivered',
  /** Message was read by recipient */
  READ = 'read',
  /** Message failed to send */
  FAILED = 'failed',
}

/**
 * Message Content Type
 */
export enum MessageContentType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  LOCATION = 'location',
  SYSTEM = 'system',
}

/**
 * Chat Message
 * Represents a single message in a conversation
 */
export interface ChatMessage {
  /** Unique message ID */
  id: string;
  /** Conversation ID this message belongs to */
  conversationId: string;
  /** Sender JID */
  from: JID;
  /** Recipient JID */
  to: JID;
  /** Message direction relative to current user */
  direction: MessageDirection;
  /** Message content type */
  contentType: MessageContentType;
  /** Message text body */
  body?: string;
  /** File attachments */
  attachments: FileAttachment[];
  /** Message status */
  status: MessageStatus;
  /** Timestamp when message was created */
  timestamp: Date;
  /** Timestamp when message was edited (if applicable) */
  editedAt?: Date;
  /** Whether this message has been read */
  isRead: boolean;
  /** Message thread ID */
  threadId?: string;
  /** Reply to message ID */
  replyToId?: string;
  /** Reactions to this message */
  reactions: MessageReaction[];
  /** Whether this is a system message */
  isSystem: boolean;
}

/**
 * Message Reaction
 * Emoji reactions to messages
 */
export interface MessageReaction {
  /** Emoji character */
  emoji: string;
  /** User who reacted */
  userId: string;
  /** Reaction timestamp */
  timestamp: Date;
}

/**
 * Conversation Type
 */
export enum ConversationType {
  /** One-on-one chat */
  DIRECT = 'direct',
  /** Group chat / MUC */
  GROUP = 'group',
}

/**
 * Conversation
 * Represents a chat conversation
 */
export interface Conversation {
  /** Unique conversation ID */
  id: string;
  /** Conversation type */
  type: ConversationType;
  /** Conversation participants */
  participants: JID[];
  /** Conversation title (for groups) or contact name */
  title: string;
  /** Conversation avatar URL */
  avatarUrl?: string;
  /** Last message in conversation */
  lastMessage?: ChatMessage;
  /** Number of unread messages */
  unreadCount: number;
  /** Whether conversation is pinned */
  isPinned: boolean;
  /** Whether conversation is muted */
  isMuted: boolean;
  /** Whether conversation is archived */
  isArchived: boolean;
  /** Conversation creation timestamp */
  createdAt: Date;
  /** Last activity timestamp */
  lastActivityAt: Date;
  /** Draft message */
  draft?: string;
  /** Current typing users */
  typingUsers: Map<string, Date>;
}

/**
 * Group Chat / MUC specific information
 */
export interface GroupChat extends Conversation {
  type: ConversationType.GROUP;
  /** MUC room JID */
  roomJid: JID;
  /** User's nickname in the room */
  userNickname: string;
  /** Room subject/topic */
  subject?: string;
  /** Room description */
  description?: string;
  /** Whether room is password protected */
  isPasswordProtected: boolean;
  /** Room participants with roles */
  members: GroupChatMember[];
  /** Room configuration */
  config: GroupChatConfig;
}

/**
 * Group Chat Member
 */
export interface GroupChatMember {
  /** Member's real JID (if available) */
  jid?: JID;
  /** Member's room nickname */
  nickname: string;
  /** Member's role (moderator, participant, visitor) */
  role: GroupChatRole;
  /** Member's affiliation (owner, admin, member, none) */
  affiliation: GroupChatAffiliation;
  /** Member's avatar */
  avatarUrl?: string;
  /** Member's presence in room */
  presence: ChatState;
}

/**
 * Group Chat Role
 */
export enum GroupChatRole {
  MODERATOR = 'moderator',
  PARTICIPANT = 'participant',
  VISITOR = 'visitor',
  NONE = 'none',
}

/**
 * Group Chat Affiliation
 */
export enum GroupChatAffiliation {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  OUTCAST = 'outcast',
  NONE = 'none',
}

/**
 * Group Chat Configuration
 */
export interface GroupChatConfig {
  /** Maximum number of users */
  maxUsers?: number;
  /** Whether room is persistent */
  isPersistent: boolean;
  /** Whether room is public */
  isPublic: boolean;
  /** Whether room is members-only */
  isMembersOnly: boolean;
  /** Whether room is moderated */
  isModerated: boolean;
  /** Whether participants can invite others */
  allowInvites: boolean;
  /** Whether to log room messages */
  enableLogging: boolean;
}

/**
 * Typing Indicator
 * Represents a user typing in a conversation
 */
export interface TypingIndicator {
  /** Conversation ID */
  conversationId: string;
  /** User who is typing */
  userId: string;
  /** Chat state */
  state: ChatState;
  /** Timestamp when typing started */
  timestamp: Date;
}

/**
 * Message Search Result
 */
export interface MessageSearchResult {
  /** The message */
  message: ChatMessage;
  /** Conversation the message belongs to */
  conversation: Conversation;
  /** Search relevance score */
  score: number;
  /** Matched text snippets with highlights */
  highlights: string[];
}
