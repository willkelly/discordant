/**
 * UI State and Component Type Definitions
 *
 * Types for application UI state, themes, and component props.
 */

import type { Conversation, ChatMessage } from './chat';
import type { Contact } from './user';
import type { Call } from './media';

/**
 * Application View/Route
 */
export enum AppView {
  LOGIN = 'login',
  CONVERSATIONS = 'conversations',
  CHAT = 'chat',
  CONTACTS = 'contacts',
  SETTINGS = 'settings',
  PROFILE = 'profile',
  CALL = 'call',
}

/**
 * Application State
 * Global application state
 */
export interface AppState {
  /** Current view */
  currentView: AppView;
  /** Whether app is initialized */
  isInitialized: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Active conversation ID */
  activeConversationId?: string;
  /** Active call ID */
  activeCallId?: string;
  /** Whether sidebar is open (mobile) */
  isSidebarOpen: boolean;
  /** Whether settings panel is open */
  isSettingsPanelOpen: boolean;
  /** Current theme */
  theme: Theme;
}

/**
 * Theme Configuration
 */
export interface Theme {
  /** Theme name */
  name: string;
  /** Color scheme */
  colors: ColorScheme;
  /** Typography settings */
  typography: Typography;
  /** Spacing scale */
  spacing: SpacingScale;
  /** Border radius values */
  borderRadius: BorderRadius;
  /** Shadow values */
  shadows: Shadows;
}

/**
 * Color Scheme
 */
export interface ColorScheme {
  /** Primary/accent color */
  primary: string;
  /** Primary color hover state */
  primaryHover: string;
  /** Primary color active state */
  primaryActive: string;
  /** Secondary color */
  secondary: string;
  /** Background colors */
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  /** Text colors */
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    link: string;
  };
  /** Border colors */
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  /** Status colors */
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  /** Presence colors */
  presence: {
    online: string;
    away: string;
    busy: string;
    offline: string;
  };
}

/**
 * Typography Settings
 */
export interface Typography {
  /** Font family for body text */
  fontFamily: string;
  /** Font family for headings */
  fontFamilyHeading: string;
  /** Font family for monospace */
  fontFamilyMono: string;
  /** Font sizes */
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  /** Font weights */
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  /** Line heights */
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Spacing Scale
 */
export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

/**
 * Border Radius Values
 */
export interface BorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Shadow Values
 */
export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Notification
 * In-app notification
 */
export interface Notification {
  /** Notification ID */
  id: string;
  /** Notification type */
  type: NotificationType;
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Notification icon */
  icon?: string;
  /** Notification action */
  action?: NotificationAction;
  /** Auto-dismiss timeout in ms */
  timeout?: number;
  /** Timestamp */
  timestamp: Date;
  /** Whether notification was read */
  isRead: boolean;
}

/**
 * Notification Type
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  MESSAGE = 'message',
  CALL = 'call',
}

/**
 * Notification Action
 */
export interface NotificationAction {
  /** Action label */
  label: string;
  /** Action handler */
  handler: () => void;
}

/**
 * Modal State
 */
export interface Modal {
  /** Modal ID */
  id: string;
  /** Modal type */
  type: ModalType;
  /** Modal title */
  title: string;
  /** Modal content/data */
  data?: unknown;
  /** Whether modal is open */
  isOpen: boolean;
}

/**
 * Modal Types
 */
export enum ModalType {
  CONFIRM = 'confirm',
  NEW_CONVERSATION = 'new_conversation',
  ADD_CONTACT = 'add_contact',
  EDIT_PROFILE = 'edit_profile',
  IMAGE_VIEWER = 'image_viewer',
  FILE_PREVIEW = 'file_preview',
  CALL_INCOMING = 'call_incoming',
  GROUP_SETTINGS = 'group_settings',
}

/**
 * Context Menu
 */
export interface ContextMenu {
  /** Menu ID */
  id: string;
  /** Menu items */
  items: ContextMenuItem[];
  /** Menu position */
  position: {
    x: number;
    y: number;
  };
  /** Whether menu is open */
  isOpen: boolean;
}

/**
 * Context Menu Item
 */
export interface ContextMenuItem {
  /** Item ID */
  id: string;
  /** Item label */
  label: string;
  /** Item icon */
  icon?: string;
  /** Item action */
  action: () => void;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Whether item is destructive */
  destructive?: boolean;
  /** Submenu items */
  submenu?: ContextMenuItem[];
}

/**
 * Toast Message
 */
export interface Toast {
  /** Toast ID */
  id: string;
  /** Toast message */
  message: string;
  /** Toast type */
  type: 'info' | 'success' | 'warning' | 'error';
  /** Toast duration in ms */
  duration: number;
  /** Whether toast is visible */
  isVisible: boolean;
}
