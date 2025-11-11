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
} from './xmpp';

export {
  ConnectionState,
  MessageType,
  ChatState,
  PresenceType,
  PresenceShow,
  IQType,
} from './xmpp';

// User Types
export type {
  UserAccount,
  Contact,
  ContactPresence,
  ContactResource,
  ClientCapabilities,
  Roster,
  SubscriptionRequest,
} from './user';

export { SubscriptionState } from './user';

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
} from './chat';

export {
  MessageDirection,
  MessageStatus,
  MessageContentType,
  ConversationType,
  GroupChatRole,
  GroupChatAffiliation,
} from './chat';

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
} from './media';

export {
  MediaType,
  CallType,
  CallState,
  CallDirection,
  VideoResolution,
  CallEventType,
} from './media';

// Storage Types
export type {
  FileUpload,
  FileDownload,
  StorageQuota,
  CachedFile,
  ImageProcessingOptions,
  ProcessedImage,
} from './storage';

export { FileUploadStatus, FileDownloadStatus } from './storage';

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
} from './ui';

export { AppView, NotificationType, ModalType } from './ui';
