/**
 * Chat View Island
 *
 * Main chat interface container with messages and input.
 */

import { activeConversation } from '@signals/conversations.ts';
import MessageListIsland from './MessageListIsland.tsx';
import MessageInputIsland from './MessageInputIsland.tsx';

interface ChatViewIslandProps {
  onSendMessage: (text: string) => void;
  onUploadFiles: (files: File[]) => void;
  onStartCall: (type: 'audio' | 'video') => void;
}

export default function ChatViewIsland({
  onSendMessage,
  onUploadFiles,
  onStartCall,
}: ChatViewIslandProps) {
  const conversation = activeConversation.value;

  if (!conversation) {
    return (
      <div class='chat-view'>
        <div class='empty-conversation'>
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div class='chat-view'>
      <div class='chat-header'>
        <div class='chat-info'>
          <h2 class='chat-title'>{conversation.title}</h2>
          {conversation.subtitle && (
            <p class='chat-subtitle'>{conversation.subtitle}</p>
          )}
        </div>

        <div class='chat-actions'>
          <button
            class='action-button'
            onClick={() => onStartCall('audio')}
            title='Audio call'
            aria-label='Start audio call'
          >
            📞
          </button>
          <button
            class='action-button'
            onClick={() => onStartCall('video')}
            title='Video call'
            aria-label='Start video call'
          >
            📹
          </button>
        </div>
      </div>

      <MessageListIsland />

      <MessageInputIsland
        onSendMessage={onSendMessage}
        onUploadFiles={onUploadFiles}
      />
    </div>
  );
}
