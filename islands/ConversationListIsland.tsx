/**
 * Conversation List Island
 *
 * Displays list of conversations in the sidebar.
 */

import { sortedConversations, activeConversationId } from '@signals/conversations.ts';
import Avatar from '../components/Avatar.tsx';
import type { Conversation } from '@types/chat.ts';

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString();
}

function getLastMessagePreview(conversation: Conversation): string {
  if (conversation.draft) return `Draft: ${conversation.draft}`;
  if (!conversation.lastMessage) return 'No messages yet';

  const { lastMessage } = conversation;
  if (lastMessage.contentType === 'image') return '📷 Image';
  if (lastMessage.contentType === 'file') return '📎 File';
  if (lastMessage.contentType === 'audio') return '🎵 Audio';
  if (lastMessage.contentType === 'video') return '🎥 Video';

  return lastMessage.body || '';
}

export default function ConversationListIsland() {
  const conversations = sortedConversations.value;
  const activeId = activeConversationId.value;

  function selectConversation(conversation: Conversation) {
    activeConversationId.value = conversation.id;
  }

  return (
    <div class='conversation-list'>
      <div class='list-header'>
        <h2 class='header-title'>Messages</h2>
      </div>

      <div class='conversations'>
        {conversations.map((conversation) => {
          const isActive = activeId === conversation.id;
          const hasUnread = conversation.unreadCount > 0;
          const itemClasses = [
            'conversation-item',
            isActive ? 'active' : '',
            hasUnread ? 'unread' : '',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={conversation.id}
              class={itemClasses}
              onClick={() => selectConversation(conversation)}
            >
              <Avatar
                src={conversation.avatarUrl}
                alt={conversation.title}
                initials={conversation.title.substring(0, 2)}
                size='md'
              />

              <div class='conversation-content'>
                <div class='conversation-header'>
                  <span class='conversation-title'>{conversation.title}</span>
                  {conversation.lastMessage && (
                    <span class='conversation-time'>
                      {formatTime(conversation.lastActivityAt)}
                    </span>
                  )}
                </div>

                <div class='conversation-preview'>
                  <span class='preview-text line-clamp-2'>
                    {getLastMessagePreview(conversation)}
                  </span>
                  {hasUnread && (
                    <span class='unread-badge'>{conversation.unreadCount}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
