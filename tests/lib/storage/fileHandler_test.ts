/**
 * File Handler Tests
 */

import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { fileHandler } from '../../../src/lib/storage/fileHandler.ts';

Deno.test('fileHandler - isImage returns true for image files', () => {
  const imageFile = new File([''], 'test.png', { type: 'image/png' });
  assertEquals(fileHandler.isImage(imageFile), true);
});

Deno.test('fileHandler - isImage returns false for non-image files', () => {
  const textFile = new File([''], 'test.txt', { type: 'text/plain' });
  assertEquals(fileHandler.isImage(textFile), false);
});

Deno.test('fileHandler - formatFileSize formats bytes correctly', () => {
  assertEquals(fileHandler.formatFileSize(0), '0 Bytes');
  assertEquals(fileHandler.formatFileSize(1024), '1 KB');
  assertEquals(fileHandler.formatFileSize(1024 * 1024), '1 MB');
  assertEquals(fileHandler.formatFileSize(1536), '1.5 KB');
});

Deno.test('fileHandler - formatFileSize handles large files', () => {
  const result = fileHandler.formatFileSize(1024 * 1024 * 1024);
  assert(result.includes('GB'));
});
