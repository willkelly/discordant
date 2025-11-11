/**
 * User and Contact Type Definitions
 *
 * Types for user accounts, contacts, rosters, and presence information.
 */

import type { JID, PresenceShow } from './xmpp.ts';

/**
 * User Account
 * Represents the current logged-in user
 */
export interface UserAccount {
  /** User's JID */
  jid: JID;
  /** Display name */
  displayName: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** User status message */
  statusMessage?: string;
  /** Current presence state */
  presence: PresenceShow;
  /** Account creation date */
  createdAt?: Date;
  /** Last login */
  lastLogin?: Date;
}

/**
 * Contact Subscription State
 * Tracks the subscription relationship between users
 */
export enum SubscriptionState {
  /** No subscription */
  NONE = 'none',
  /** User receives contact's presence */
  TO = 'to',
  /** Contact receives user's presence */
  FROM = 'from',
  /** Mutual subscription */
  BOTH = 'both',
}

/**
 * Contact
 * Represents a contact in the user's roster
 */
export interface Contact {
  /** Contact's JID */
  jid: JID;
  /** Display name (roster name or JID) */
  displayName: string;
  /** Contact's avatar URL */
  avatarUrl?: string;
  /** Subscription state */
  subscription: SubscriptionState;
  /** Roster groups this contact belongs to */
  groups: string[];
  /** Current presence information */
  presence?: ContactPresence;
  /** Last seen timestamp */
  lastSeen?: Date;
  /** Whether this contact is blocked */
  isBlocked: boolean;
}

/**
 * Contact Presence Information
 * Detailed presence state for a contact
 */
export interface ContactPresence {
  /** Availability state */
  show: PresenceShow;
  /** Status message */
  status?: string;
  /** Priority value */
  priority: number;
  /** Available resources (devices) */
  resources: ContactResource[];
  /** Last updated timestamp */
  updatedAt: Date;
}

/**
 * Contact Resource
 * Represents a specific device/connection for a contact
 */
export interface ContactResource {
  /** Resource name */
  name: string;
  /** Full JID including resource */
  fullJid: string;
  /** Resource availability */
  show: PresenceShow;
  /** Resource status */
  status?: string;
  /** Resource priority */
  priority: number;
  /** Client capabilities */
  capabilities?: ClientCapabilities;
}

/**
 * Client Capabilities
 * Features and capabilities advertised by a client
 */
export interface ClientCapabilities {
  /** Client name */
  clientName?: string;
  /** Client version */
  clientVersion?: string;
  /** Supported features */
  features: string[];
  /** Supports audio calls */
  supportsAudio: boolean;
  /** Supports video calls */
  supportsVideo: boolean;
  /** Supports file transfer */
  supportsFileTransfer: boolean;
}

/**
 * Roster
 * The user's contact list
 */
export interface Roster {
  /** Map of JID to Contact */
  contacts: Map<string, Contact>;
  /** Roster groups */
  groups: Set<string>;
  /** Last updated timestamp */
  lastUpdated: Date;
  /** Roster version (for roster versioning) */
  version?: string;
}

/**
 * Subscription Request
 * Incoming or outgoing subscription request
 */
export interface SubscriptionRequest {
  /** Request ID */
  id: string;
  /** Contact's JID */
  jid: JID;
  /** Contact's display name */
  displayName?: string;
  /** Request message */
  message?: string;
  /** Request direction */
  direction: 'incoming' | 'outgoing';
  /** Request timestamp */
  timestamp: Date;
  /** Request status */
  status: 'pending' | 'accepted' | 'rejected';
}
