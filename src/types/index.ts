/**
 * Central Type Exports
 *
 * Re-exports all type definitions for convenient importing throughout the application.
 * This promotes DRY principles by providing a single source of truth for types.
 */

// XMPP Types
export type {
  JID,
  ConnectionConfig,
  Stanza,
  MessageStanza,
  PresenceStanza,
  IQStanza,
  XMPPError,
  FileAttachment,
} from './xmpp.ts';

export {
  ConnectionState,
  MessageType,
  ChatState,
  PresenceType,
  PresenceShow,
  IQType,
} from './xmpp.ts';

// User Types
export type {
  UserAccount,
  Contact,
  ContactPresence,
  ContactResource,
  ClientCapabilities,
  Roster,
  SubscriptionRequest,
} from './user.ts';

export { SubscriptionState } from './user.ts';

// Chat Types
export type {
  ChatMessage,
  MessageReaction,
  Conversation,
  GroupChat,
  GroupChatMember,
  GroupChatConfig,
  TypingIndicator,
  MessageSearchResult,
} from './chat.ts';

export {
  MessageDirection,
  MessageStatus,
  MessageContentType,
  ConversationType,
  GroupChatRole,
  GroupChatAffiliation,
} from './chat.ts';

// Media Types
export type {
  Call,
  CallQuality,
  MediaDevice,
  MediaSettings,
  ScreenShare,
  MediaTrackState,
  CallEvent,
  CallHistoryEntry,
} from './media.ts';

export {
  MediaType,
  CallType,
  CallState,
  CallDirection,
  VideoResolution,
  CallEventType,
} from './media.ts';

// Storage Types
export type {
  FileUpload,
  FileDownload,
  StorageQuota,
  CachedFile,
  ImageProcessingOptions,
  ProcessedImage,
} from './storage.ts';

export { FileUploadStatus, FileDownloadStatus } from './storage.ts';

// UI Types
export type {
  AppState,
  Theme,
  ColorScheme,
  Typography,
  SpacingScale,
  BorderRadius,
  Shadows,
  Notification,
  NotificationAction,
  Modal,
  ContextMenu,
  ContextMenuItem,
  Toast,
} from './ui.ts';

export { AppView, NotificationType, ModalType } from './ui.ts';
