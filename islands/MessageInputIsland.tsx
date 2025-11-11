/**
 * Message Input Island
 *
 * Input area for composing and sending messages.
 */

import { useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';
import Button from '../components/Button.tsx';

interface MessageInputIslandProps {
  onSendMessage: (text: string) => void;
  onUploadFiles: (files: File[]) => void;
  disabled?: boolean;
}

export default function MessageInputIsland({
  onSendMessage,
  onUploadFiles,
  disabled = false,
}: MessageInputIslandProps) {
  const message = useSignal('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const trimmed = message.value.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    message.value = '';
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleFileSelect() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      onUploadFiles(Array.from(files));
      target.value = '';
    }
  }

  return (
    <div class='message-input-container'>
      <input
        ref={fileInputRef}
        type='file'
        onChange={handleFileChange}
        multiple
        accept='image/*,video/*,audio/*,.pdf,.doc,.docx,.txt'
        style={{ display: 'none' }}
      />

      <div class='input-actions'>
        <button
          class='action-button'
          onClick={handleFileSelect}
          disabled={disabled}
          title='Attach file'
          aria-label='Attach file'
        >
          📎
        </button>
      </div>

      <textarea
        class='message-textarea'
        placeholder='Type a message...'
        value={message.value}
        onInput={(e) => message.value = e.currentTarget.value}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />

      <Button
        variant='primary'
        size='sm'
        onClick={handleSubmit}
        disabled={disabled || !message.value.trim()}
      >
        Send
      </Button>
    </div>
  );
}
