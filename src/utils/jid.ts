/**
 * JID Utilities
 *
 * Helper functions for working with Jabber IDs.
 */

import type { JID } from '@types/xmpp';

/**
 * Parse a JID string into components
 */
export function parseJID(jidString: string): JID {
  const parts = jidString.split('/');
  const bareJid = parts[0];
  const resource = parts[1];

  const atIndex = bareJid.indexOf('@');
  const local = atIndex !== -1 ? bareJid.substring(0, atIndex) : undefined;
  const domain = atIndex !== -1 ? bareJid.substring(atIndex + 1) : bareJid;

  return {
    full: jidString,
    bare: bareJid,
    local,
    domain,
    resource,
  };
}

/**
 * Get bare JID (without resource)
 */
export function getBareJID(jidString: string): string {
  return jidString.split('/')[0];
}

/**
 * Get resource from JID
 */
export function getResource(jidString: string): string | undefined {
  const parts = jidString.split('/');
  return parts[1];
}

/**
 * Compare two JIDs for equality
 */
export function jidsEqual(jid1: string, jid2: string, compareResource = false): boolean {
  if (compareResource) {
    return jid1 === jid2;
  }
  return getBareJID(jid1) === getBareJID(jid2);
}
