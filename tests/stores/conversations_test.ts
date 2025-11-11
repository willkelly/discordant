/**
 * Conversations Store Tests
 */

import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { get } from 'svelte/store';
import {
  conversations,
  messages,
  activeConversationId,
  activeConversation,
  activeMessages,
} from '../../src/stores/conversations.ts';
import type { Conversation, ChatMessage } from '../../src/types/chat.ts';

Deno.test('conversations store - activeConversation returns null when no active ID', () => {
  activeConversationId.set(null);
  const current = get(activeConversation);
  assertEquals(current, null);
});

Deno.test('conversations store - activeConversation returns conversation when ID is set', () => {
  const testConv: Conversation = {
    id: 'test-conv',
    type: 'direct' as any,
    participants: [],
    title: 'Test Conversation',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(),
    lastActivityAt: new Date(),
    typingUsers: new Map(),
  };

  conversations.set(new Map([['test-conv', testConv]]));
  activeConversationId.set('test-conv');

  const current = get(activeConversation);
  assertEquals(current?.id, 'test-conv');
  assertEquals(current?.title, 'Test Conversation');
});

Deno.test('conversations store - activeMessages returns empty array when no active ID', () => {
  activeConversationId.set(null);
  const current = get(activeMessages);
  assertEquals(current, []);
});

Deno.test('conversations store - activeMessages returns messages for active conversation', () => {
  const testMessage: ChatMessage = {
    id: 'msg-1',
    conversationId: 'test-conv',
    from: {
      full: 'user@example.com',
      bare: 'user@example.com',
      domain: 'example.com',
      local: 'user',
    },
    to: {
      full: 'other@example.com',
      bare: 'other@example.com',
      domain: 'example.com',
      local: 'other',
    },
    direction: 'incoming' as any,
    contentType: 'text' as any,
    body: 'Test message',
    attachments: [],
    status: 'delivered' as any,
    timestamp: new Date(),
    isRead: false,
    reactions: [],
    isSystem: false,
  };

  messages.set(new Map([['test-conv', [testMessage]]]));
  activeConversationId.set('test-conv');

  const current = get(activeMessages);
  assertEquals(current.length, 1);
  assertEquals(current[0].body, 'Test message');
});

Deno.test('conversations store - sortedConversations sorts by pinned and lastActivity', () => {
  const conv1: Conversation = {
    id: 'conv-1',
    type: 'direct' as any,
    participants: [],
    title: 'Conversation 1',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-01-01'),
    lastActivityAt: new Date('2024-01-01'),
    typingUsers: new Map(),
  };

  const conv2: Conversation = {
    id: 'conv-2',
    type: 'direct' as any,
    participants: [],
    title: 'Conversation 2',
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-01-02'),
    lastActivityAt: new Date('2024-01-02'),
    typingUsers: new Map(),
  };

  const conv3: Conversation = {
    id: 'conv-3',
    type: 'direct' as any,
    participants: [],
    title: 'Conversation 3',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-01-03'),
    lastActivityAt: new Date('2024-01-03'),
    typingUsers: new Map(),
  };

  conversations.set(new Map([
    ['conv-1', conv1],
    ['conv-2', conv2],
    ['conv-3', conv3],
  ]));

  const sorted = get(
    (await import('../../src/stores/conversations.ts')).sortedConversations
  );

  // Pinned should be first
  assertEquals(sorted[0].id, 'conv-2');

  // Then sorted by last activity (most recent first)
  assertEquals(sorted[1].id, 'conv-3');
  assertEquals(sorted[2].id, 'conv-1');
});
