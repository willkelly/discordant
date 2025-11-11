/**
 * File Handler Service
 *
 * Handles file uploads, downloads, and image processing.
 */

import type { FileUpload, ImageProcessingOptions, ProcessedImage } from '../../types/storage.ts';

class FileHandler {
  /**
   * Process an image file
   */
  processImage(
    file: File,
    options: ImageProcessingOptions = {},
  ): Promise<ProcessedImage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const img = new Image();
          img.src = e.target?.result as string;

          await new Promise((imgResolve) => {
            img.onload = imgResolve;
          });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate dimensions
          let width = img.width;
          let height = img.height;

          if (options.maxWidth && width > options.maxWidth) {
            height = (height * options.maxWidth) / width;
            width = options.maxWidth;
          }

          if (options.maxHeight && height > options.maxHeight) {
            width = (width * options.maxHeight) / height;
            height = options.maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              const url = URL.createObjectURL(blob);

              const result: ProcessedImage = {
                original: file,
                processed: blob,
                url,
                dimensions: { width, height },
              };

              // Generate thumbnail if requested
              if (options.generateThumbnail) {
                this.generateThumbnail(img, options.thumbnailSize || 200).then(
                  (thumbnail) => {
                    result.thumbnail = thumbnail.blob;
                    result.thumbnailUrl = thumbnail.url;
                    resolve(result);
                  },
                );
              } else {
                resolve(result);
              }
            },
            options.format || 'image/jpeg',
            options.quality || 0.9,
          );
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate thumbnail
   */
  private generateThumbnail(
    img: HTMLImageElement,
    maxSize: number,
  ): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate thumbnail dimensions
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw thumbnail
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create thumbnail blob'));
            return;
          }

          resolve({
            blob,
            url: URL.createObjectURL(blob),
          });
        },
        'image/jpeg',
        0.7,
      );
    });
  }

  /**
   * Upload file (placeholder - needs server implementation)
   */
  uploadFile(file: File): Promise<FileUpload> {
    // This would normally upload to a server
    // For now, just create a local URL
    const url = URL.createObjectURL(file);

    const upload: FileUpload = {
      id: crypto.randomUUID(),
      file,
      status: 'completed',
      progress: 100,
      startTime: new Date(),
      completionTime: new Date(),
      url,
    };

    return Promise.resolve(upload);
  }

  /**
   * Check if file is an image
   */
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export const fileHandler = new FileHandler();
