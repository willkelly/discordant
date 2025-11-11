/**
 * Media and Streaming Type Definitions
 *
 * Types for audio/video streaming, calls, and media handling.
 */

import type { JID } from './xmpp';

/**
 * Media Type
 */
export enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

/**
 * Call Type
 */
export enum CallType {
  /** Audio only call */
  AUDIO = 'audio',
  /** Video call */
  VIDEO = 'video',
}

/**
 * Call State
 */
export enum CallState {
  /** Call is being initiated */
  INITIATING = 'initiating',
  /** Ringing on remote end */
  RINGING = 'ringing',
  /** Call is connecting */
  CONNECTING = 'connecting',
  /** Call is active */
  ACTIVE = 'active',
  /** Call is on hold */
  HOLD = 'hold',
  /** Call is ending */
  ENDING = 'ending',
  /** Call has ended */
  ENDED = 'ended',
  /** Call failed */
  FAILED = 'failed',
}

/**
 * Call Direction
 */
export enum CallDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

/**
 * Call
 * Represents an audio/video call session
 */
export interface Call {
  /** Unique call ID */
  id: string;
  /** Call type (audio/video) */
  type: CallType;
  /** Call direction */
  direction: CallDirection;
  /** Call state */
  state: CallState;
  /** Initiator JID */
  initiator: JID;
  /** Recipient JID */
  recipient: JID;
  /** Call start time */
  startTime?: Date;
  /** Call end time */
  endTime?: Date;
  /** Call duration in seconds */
  duration?: number;
  /** Local media stream */
  localStream?: MediaStream;
  /** Remote media stream */
  remoteStream?: MediaStream;
  /** WebRTC peer connection */
  peerConnection?: RTCPeerConnection;
  /** Whether local audio is muted */
  isAudioMuted: boolean;
  /** Whether local video is disabled */
  isVideoDisabled: boolean;
  /** Whether remote audio is muted */
  isRemoteAudioMuted: boolean;
  /** Whether remote video is disabled */
  isRemoteVideoDisabled: boolean;
  /** Call quality metrics */
  quality?: CallQuality;
}

/**
 * Call Quality Metrics
 */
export interface CallQuality {
  /** Audio quality (0-5) */
  audioQuality: number;
  /** Video quality (0-5) */
  videoQuality: number;
  /** Network latency in ms */
  latency: number;
  /** Packet loss percentage */
  packetLoss: number;
  /** Jitter in ms */
  jitter: number;
  /** Bitrate in kbps */
  bitrate: number;
}

/**
 * Media Device
 * Represents an audio/video input device
 */
export interface MediaDevice {
  /** Device ID */
  id: string;
  /** Device label/name */
  label: string;
  /** Device type */
  kind: MediaDeviceKind;
  /** Whether this is the default device */
  isDefault: boolean;
}

/**
 * Media Device Kind
 */
export type MediaDeviceKind = 'audioinput' | 'audiooutput' | 'videoinput';

/**
 * Media Settings
 * User's media preferences and settings
 */
export interface MediaSettings {
  /** Selected audio input device */
  audioInputDevice?: string;
  /** Selected audio output device */
  audioOutputDevice?: string;
  /** Selected video input device */
  videoInputDevice?: string;
  /** Audio input volume (0-100) */
  audioInputVolume: number;
  /** Audio output volume (0-100) */
  audioOutputVolume: number;
  /** Video resolution preference */
  videoResolution: VideoResolution;
  /** Video frame rate preference */
  videoFrameRate: number;
  /** Enable echo cancellation */
  echoCancellation: boolean;
  /** Enable noise suppression */
  noiseSuppression: boolean;
  /** Enable auto gain control */
  autoGainControl: boolean;
}

/**
 * Video Resolution
 */
export enum VideoResolution {
  LOW = '320x240',
  MEDIUM = '640x480',
  HD = '1280x720',
  FULL_HD = '1920x1080',
}

/**
 * Screen Share
 * Represents a screen sharing session
 */
export interface ScreenShare {
  /** Screen share ID */
  id: string;
  /** Associated call ID */
  callId: string;
  /** Screen share stream */
  stream: MediaStream;
  /** Who is sharing (local or remote) */
  source: 'local' | 'remote';
  /** Screen share start time */
  startTime: Date;
  /** Whether screen share is active */
  isActive: boolean;
}

/**
 * Media Stream Track State
 */
export interface MediaTrackState {
  /** Track ID */
  id: string;
  /** Track kind (audio/video) */
  kind: 'audio' | 'video';
  /** Track label */
  label: string;
  /** Whether track is enabled */
  enabled: boolean;
  /** Whether track is muted */
  muted: boolean;
  /** Track settings */
  settings: MediaTrackSettings;
}

/**
 * Call Event
 * Events that occur during a call
 */
export interface CallEvent {
  /** Event ID */
  id: string;
  /** Call ID */
  callId: string;
  /** Event type */
  type: CallEventType;
  /** Event timestamp */
  timestamp: Date;
  /** Event data */
  data?: unknown;
}

/**
 * Call Event Types
 */
export enum CallEventType {
  CALL_INITIATED = 'call_initiated',
  CALL_RINGING = 'call_ringing',
  CALL_ANSWERED = 'call_answered',
  CALL_ENDED = 'call_ended',
  CALL_MISSED = 'call_missed',
  CALL_REJECTED = 'call_rejected',
  AUDIO_MUTED = 'audio_muted',
  AUDIO_UNMUTED = 'audio_unmuted',
  VIDEO_ENABLED = 'video_enabled',
  VIDEO_DISABLED = 'video_disabled',
  SCREEN_SHARE_STARTED = 'screen_share_started',
  SCREEN_SHARE_STOPPED = 'screen_share_stopped',
  REMOTE_AUDIO_MUTED = 'remote_audio_muted',
  REMOTE_AUDIO_UNMUTED = 'remote_audio_unmuted',
  REMOTE_VIDEO_ENABLED = 'remote_video_enabled',
  REMOTE_VIDEO_DISABLED = 'remote_video_disabled',
  CONNECTION_QUALITY_CHANGED = 'connection_quality_changed',
  ERROR = 'error',
}

/**
 * Call History Entry
 */
export interface CallHistoryEntry {
  /** Entry ID */
  id: string;
  /** Call type */
  type: CallType;
  /** Call direction */
  direction: CallDirection;
  /** Other participant JID */
  participant: JID;
  /** Call start time */
  startTime: Date;
  /** Call duration in seconds */
  duration: number;
  /** Whether call was missed */
  isMissed: boolean;
  /** Whether call was answered */
  wasAnswered: boolean;
}
