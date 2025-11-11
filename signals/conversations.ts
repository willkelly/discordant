/**
 * Conversations Signals
 *
 * Manages chat conversations and messages using Preact Signals.
 */

import { computed, signal } from '@preact/signals';
import type { ChatMessage, Conversation } from '../src/types/chat.ts';

export const conversations = signal<Map<string, Conversation>>(new Map());
export const messages = signal<Map<string, ChatMessage[]>>(new Map());
export const activeConversationId = signal<string | null>(null);

export const activeConversation = computed(() => {
  const id = activeConversationId.value;
  if (!id) return null;
  return conversations.value.get(id) || null;
});

export const activeMessages = computed(() => {
  const id = activeConversationId.value;
  if (!id) return [];
  return messages.value.get(id) || [];
});

export const sortedConversations = computed(() => {
  return Array.from(conversations.value.values())
    .sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then by last activity
      return b.lastActivityAt.getTime() - a.lastActivityAt.getTime();
    })
    .filter((c) => !c.isArchived);
});

export const unreadCount = computed(() => {
  let total = 0;
  conversations.value.forEach((conv) => {
    total += conv.unreadCount;
  });
  return total;
});
