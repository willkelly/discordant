/**
 * Message List Island
 *
 * Displays messages in a conversation with auto-scroll.
 */

import { useEffect, useRef } from 'preact/hooks';
import { activeMessages } from '@signals/conversations.ts';
import { currentUser } from '@signals/user.ts';
import Avatar from '../components/Avatar.tsx';
import type { ChatMessage } from '@types/chat.ts';

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageListIsland() {
  const messages = activeMessages.value;
  const user = currentUser.value;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function isOwnMessage(message: ChatMessage): boolean {
    return message.from.bare === user?.jid.bare;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div class='message-list'>
        <div class='empty-state'>
          <p>No messages yet</p>
          <p class='empty-subtitle'>Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div class='message-list'>
      <div class='messages'>
        {messages.map((message) => {
          const isOwn = isOwnMessage(message);
          const messageClasses = [
            'message',
            isOwn ? 'message-own' : 'message-other',
          ].filter(Boolean).join(' ');

          return (
            <div key={message.id} class={messageClasses}>
              {!isOwn && (
                <Avatar
                  src={message.from.avatarUrl}
                  alt={message.from.displayName}
                  initials={message.from.displayName?.substring(0, 2) || '?'}
                  size='sm'
                />
              )}

              <div class='message-content'>
                {!isOwn && (
                  <span class='message-sender'>{message.from.displayName || message.from.bare}</span>
                )}
                <div class='message-bubble'>
                  <p class='message-body'>{message.body}</p>
                  <span class='message-time'>{formatMessageTime(message.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
