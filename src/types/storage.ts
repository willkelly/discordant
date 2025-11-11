/**
 * Storage and File Handling Type Definitions
 *
 * Types for file uploads, downloads, and local storage.
 */

/**
 * File Upload Status
 */
export enum FileUploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * File Upload
 * Represents a file being uploaded
 */
export interface FileUpload {
  /** Unique upload ID */
  id: string;
  /** File object */
  file: File;
  /** Upload status */
  status: FileUploadStatus;
  /** Upload progress (0-100) */
  progress: number;
  /** Upload speed in bytes/second */
  speed?: number;
  /** Estimated time remaining in seconds */
  estimatedTimeRemaining?: number;
  /** Upload start time */
  startTime: Date;
  /** Upload completion time */
  completionTime?: Date;
  /** Resulting file URL after upload */
  url?: string;
  /** Thumbnail URL for images */
  thumbnailUrl?: string;
  /** Error message if upload failed */
  error?: string;
}

/**
 * File Download Status
 */
export enum FileDownloadStatus {
  PENDING = 'pending',
  DOWNLOADING = 'downloading',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * File Download
 * Represents a file being downloaded
 */
export interface FileDownload {
  /** Unique download ID */
  id: string;
  /** File name */
  fileName: string;
  /** File URL */
  url: string;
  /** Download status */
  status: FileDownloadStatus;
  /** Download progress (0-100) */
  progress: number;
  /** Downloaded blob */
  blob?: Blob;
  /** Download start time */
  startTime: Date;
  /** Download completion time */
  completionTime?: Date;
  /** Error message if download failed */
  error?: string;
}

/**
 * Storage Quota Information
 */
export interface StorageQuota {
  /** Total storage quota in bytes */
  total: number;
  /** Used storage in bytes */
  used: number;
  /** Available storage in bytes */
  available: number;
  /** Usage percentage (0-100) */
  usagePercentage: number;
}

/**
 * Cached File
 * Represents a file cached locally
 */
export interface CachedFile {
  /** File ID */
  id: string;
  /** File URL */
  url: string;
  /** File name */
  fileName: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Local blob URL */
  localUrl: string;
  /** Cache timestamp */
  cachedAt: Date;
  /** Last accessed timestamp */
  lastAccessedAt: Date;
  /** Access count */
  accessCount: number;
}

/**
 * Image Processing Options
 */
export interface ImageProcessingOptions {
  /** Maximum width */
  maxWidth?: number;
  /** Maximum height */
  maxHeight?: number;
  /** Output quality (0-1) */
  quality?: number;
  /** Output format */
  format?: 'jpeg' | 'png' | 'webp';
  /** Generate thumbnail */
  generateThumbnail?: boolean;
  /** Thumbnail max dimensions */
  thumbnailSize?: number;
}

/**
 * Processed Image Result
 */
export interface ProcessedImage {
  /** Original file */
  original: File;
  /** Processed image blob */
  processed: Blob;
  /** Processed image URL */
  url: string;
  /** Thumbnail blob */
  thumbnail?: Blob;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Image dimensions */
  dimensions: {
    width: number;
    height: number;
  };
}
