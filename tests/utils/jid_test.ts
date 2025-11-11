/**
 * JID Utilities Tests
 */

import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { getBareJID, getResource, jidsEqual, parseJID } from '../../src/utils/jid.ts';

Deno.test('parseJID - parses full JID correctly', () => {
  const jid = parseJID('user@example.com/resource');

  assertEquals(jid.full, 'user@example.com/resource');
  assertEquals(jid.bare, 'user@example.com');
  assertEquals(jid.local, 'user');
  assertEquals(jid.domain, 'example.com');
  assertEquals(jid.resource, 'resource');
});

Deno.test('parseJID - parses bare JID correctly', () => {
  const jid = parseJID('user@example.com');

  assertEquals(jid.full, 'user@example.com');
  assertEquals(jid.bare, 'user@example.com');
  assertEquals(jid.local, 'user');
  assertEquals(jid.domain, 'example.com');
  assertEquals(jid.resource, undefined);
});

Deno.test('parseJID - parses domain-only JID correctly', () => {
  const jid = parseJID('example.com');

  assertEquals(jid.full, 'example.com');
  assertEquals(jid.bare, 'example.com');
  assertEquals(jid.local, undefined);
  assertEquals(jid.domain, 'example.com');
  assertEquals(jid.resource, undefined);
});

Deno.test('getBareJID - returns bare JID from full JID', () => {
  const bareJid = getBareJID('user@example.com/resource');
  assertEquals(bareJid, 'user@example.com');
});

Deno.test('getBareJID - returns same value for bare JID', () => {
  const bareJid = getBareJID('user@example.com');
  assertEquals(bareJid, 'user@example.com');
});

Deno.test('getResource - returns resource from full JID', () => {
  const resource = getResource('user@example.com/mobile');
  assertEquals(resource, 'mobile');
});

Deno.test('getResource - returns undefined for bare JID', () => {
  const resource = getResource('user@example.com');
  assertEquals(resource, undefined);
});

Deno.test('jidsEqual - compares bare JIDs correctly', () => {
  assertEquals(jidsEqual('user@example.com/resource1', 'user@example.com/resource2'), true);
  assertEquals(jidsEqual('user@example.com', 'user@example.com/resource'), true);
  assertEquals(jidsEqual('user1@example.com', 'user2@example.com'), false);
});

Deno.test('jidsEqual - compares full JIDs when compareResource is true', () => {
  assertEquals(
    jidsEqual('user@example.com/resource1', 'user@example.com/resource1', true),
    true,
  );
  assertEquals(
    jidsEqual('user@example.com/resource1', 'user@example.com/resource2', true),
    false,
  );
});
