/**
 * Contacts Signals
 *
 * Manages the user's contact roster using Preact Signals.
 */

import { computed, signal } from '@preact/signals';
import type { Contact, SubscriptionRequest } from '../src/types/user.ts';

export const contacts = signal<Map<string, Contact>>(new Map());
export const subscriptionRequests = signal<SubscriptionRequest[]>([]);

export const onlineContacts = computed(() => {
  const online: Contact[] = [];
  contacts.value.forEach((contact) => {
    if (contact.presence?.show === 'chat' || contact.presence?.show === 'away') {
      online.push(contact);
    }
  });
  return online;
});

export const sortedContacts = computed(() => {
  return Array.from(contacts.value.values()).sort((a, b) => {
    // Online contacts first
    const aOnline = a.presence?.show === 'chat' || a.presence?.show === 'away';
    const bOnline = b.presence?.show === 'chat' || b.presence?.show === 'away';

    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    // Then alphabetically
    return a.displayName.localeCompare(b.displayName);
  });
});
