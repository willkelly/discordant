/**
 * Central Type Exports
 *
 * Re-exports all type definitions for convenient importing throughout the application.
 * This promotes DRY principles by providing a single source of truth for types.
 */

// XMPP Types
export type {
  ConnectionConfig,
  FileAttachment,
  IQStanza,
  JID,
  MessageStanza,
  PresenceStanza,
  Stanza,
  XMPPError,
} from './xmpp.ts';

export {
  ChatState,
  ConnectionState,
  IQType,
  MessageType,
  PresenceShow,
  PresenceType,
} from './xmpp.ts';

// User Types
export type {
  ClientCapabilities,
  Contact,
  ContactPresence,
  ContactResource,
  Roster,
  SubscriptionRequest,
  UserAccount,
} from './user.ts';

export { SubscriptionState } from './user.ts';

// Chat Types
export type {
  ChatMessage,
  Conversation,
  GroupChat,
  GroupChatConfig,
  GroupChatMember,
  MessageReaction,
  MessageSearchResult,
  TypingIndicator,
} from './chat.ts';

export type {
  ConversationType,
  GroupChatAffiliation,
  GroupChatRole,
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from './chat.ts';

// Media Types
export type {
  Call,
  CallEvent,
  CallHistoryEntry,
  CallQuality,
  MediaDevice,
  MediaSettings,
  MediaTrackState,
  ScreenShare,
} from './media.ts';

export {
  CallDirection,
  CallEventType,
  CallState,
  CallType,
  MediaType,
  VideoResolution,
} from './media.ts';

// Storage Types
export type {
  CachedFile,
  FileDownload,
  FileUpload,
  ImageProcessingOptions,
  ProcessedImage,
  StorageQuota,
} from './storage.ts';

export type { FileDownloadStatus, FileUploadStatus } from './storage.ts';

// UI Types
export type {
  AppState,
  BorderRadius,
  ColorScheme,
  ContextMenu,
  ContextMenuItem,
  Modal,
  Notification,
  NotificationAction,
  Shadows,
  SpacingScale,
  Theme,
  Toast,
  Typography,
} from './ui.ts';

export { AppView, ModalType, NotificationType } from './ui.ts';
