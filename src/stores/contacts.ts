/**
 * Contacts Store
 *
 * Manages the user's contact roster.
 */

import { writable, derived } from 'svelte/store';
import type { Contact, SubscriptionRequest } from '../types/user';

export const contacts = writable<Map<string, Contact>>(new Map());
export const subscriptionRequests = writable<SubscriptionRequest[]>([]);

export const onlineContacts = derived(contacts, ($contacts) => {
  const online: Contact[] = [];
  $contacts.forEach((contact) => {
    if (contact.presence?.show === 'chat' || contact.presence?.show === 'away') {
      online.push(contact);
    }
  });
  return online;
});

export const sortedContacts = derived(contacts, ($contacts) => {
  return Array.from($contacts.values()).sort((a, b) => {
    // Online contacts first
    const aOnline = a.presence?.show === 'chat' || a.presence?.show === 'away';
    const bOnline = b.presence?.show === 'chat' || b.presence?.show === 'away';

    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    // Then alphabetically
    return a.displayName.localeCompare(b.displayName);
  });
});
