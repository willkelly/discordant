/**
 * Conversations Store
 *
 * Manages chat conversations and messages.
 */

import { derived, writable } from 'svelte/store';
import type { ChatMessage, Conversation } from '../types/chat.ts';

export const conversations = writable<Map<string, Conversation>>(new Map());
export const messages = writable<Map<string, ChatMessage[]>>(new Map());
export const activeConversationId = writable<string | null>(null);

export const activeConversation = derived(
  [conversations, activeConversationId],
  ([$conversations, $activeId]) => {
    if (!$activeId) return null;
    return $conversations.get($activeId) || null;
  },
);

export const activeMessages = derived(
  [messages, activeConversationId],
  ([$messages, $activeId]) => {
    if (!$activeId) return [];
    return $messages.get($activeId) || [];
  },
);

export const sortedConversations = derived(conversations, ($conversations) => {
  return Array.from($conversations.values())
    .sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then by last activity
      return b.lastActivityAt.getTime() - a.lastActivityAt.getTime();
    })
    .filter((c) => !c.isArchived);
});

export const unreadCount = derived(conversations, ($conversations) => {
  let total = 0;
  $conversations.forEach((conv) => {
    total += conv.unreadCount;
  });
  return total;
});
