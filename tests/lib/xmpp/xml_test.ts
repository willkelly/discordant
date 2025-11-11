/**
 * Tests for XML utilities
 */

import {
  assert,
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { parseXML } from '../../../src/lib/xmpp/xml.ts';

Deno.test('parseXML - parses valid XMPP message stanza', () => {
  const xml = '<message from="user@example.com" to="friend@example.com"><body>Hello!</body></message>';
  const doc = parseXML(xml);
  const root = doc.documentElement;

  assertEquals(root.tagName, 'message');
  assertEquals(root.getAttribute('from'), 'user@example.com');
  assertEquals(root.getAttribute('to'), 'friend@example.com');

  const body = root.querySelector('body');
  assert(body);
  assertEquals(body.textContent, 'Hello!');
});

Deno.test('parseXML - parses valid XMPP presence stanza', () => {
  const xml = '<presence from="user@example.com"><show>away</show><status>Be right back</status></presence>';
  const doc = parseXML(xml);
  const root = doc.documentElement;

  assertEquals(root.tagName, 'presence');
  assertEquals(root.getAttribute('from'), 'user@example.com');

  const show = root.querySelector('show');
  assert(show);
  assertEquals(show.textContent, 'away');
});

Deno.test('parseXML - parses valid XMPP IQ stanza', () => {
  const xml = '<iq type="get" id="roster1"><query xmlns="jabber:iq:roster"/></iq>';
  const doc = parseXML(xml);
  const root = doc.documentElement;

  assertEquals(root.tagName, 'iq');
  assertEquals(root.getAttribute('type'), 'get');
  assertEquals(root.getAttribute('id'), 'roster1');
});

// Security tests

Deno.test('parseXML - rejects DOCTYPE declaration (entity expansion prevention)', () => {
  const xml = '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><message><body>&xxe;</body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: DOCTYPE declarations not allowed',
  );
});

Deno.test('parseXML - rejects DOCTYPE with entity expansion attack', () => {
  const xml = `<!DOCTYPE lolz [
    <!ENTITY lol "lol">
    <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  ]>
  <message><body>&lol2;</body></message>`;

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: DOCTYPE declarations not allowed',
  );
});

Deno.test('parseXML - rejects script tags (XSS prevention)', () => {
  const xml = '<message><body><script>alert("XSS")</script></body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects script tags with attributes', () => {
  const xml = '<message><body><script src="evil.js"></script></body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects iframe tags (XSS prevention)', () => {
  const xml = '<message><body><iframe src="https://evil.com"></iframe></body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects object tags (XSS prevention)', () => {
  const xml = '<message><body><object data="evil.swf"></object></body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects embed tags (XSS prevention)', () => {
  const xml = '<message><body><embed src="evil.swf"></embed></body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects form tags (XSS prevention)', () => {
  const xml = '<message><body><form action="evil.php"></form></body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects html tags (XSS prevention)', () => {
  const xml = '<html><body><message>Hello</message></body></html>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects body tags (XSS prevention)', () => {
  const xml = '<message><body onload="alert(1)">Hello</body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects link tags (XSS prevention)', () => {
  const xml = '<message><link rel="stylesheet" href="evil.css"/></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects meta tags (XSS prevention)', () => {
  const xml = '<message><meta http-equiv="refresh" content="0;url=evil.com"/></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects event handler attributes onclick (XSS prevention)', () => {
  const xml = '<message onclick="alert(1)"><body>Hello</body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects event handler attributes onload (XSS prevention)', () => {
  const xml = '<message onload="alert(1)"><body>Hello</body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - rejects event handler attributes onerror (XSS prevention)', () => {
  const xml = '<message onerror="alert(1)"><body>Hello</body></message>';

  assertThrows(
    () => parseXML(xml),
    Error,
    'Security: Potentially dangerous content detected',
  );
});

Deno.test('parseXML - throws error for malformed XML', () => {
  const xml = '<message><body>Unclosed tag';

  assertThrows(
    () => parseXML(xml),
    Error,
    'XML Parse Error',
  );
});

Deno.test('parseXML - handles XML with namespaces', () => {
  const xml = '<message xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams"><body>Hello</body></message>';
  const doc = parseXML(xml);
  const root = doc.documentElement;

  assertEquals(root.tagName, 'message');
  assertEquals(root.getAttribute('xmlns'), 'jabber:client');
});

Deno.test('parseXML - handles XML with CDATA sections (legitimate use)', () => {
  const xml = '<message><body><![CDATA[<>&"\']]></body></message>';
  const doc = parseXML(xml);
  const root = doc.documentElement;

  assertEquals(root.tagName, 'message');
  const body = root.querySelector('body');
  assert(body);
  // CDATA content should be preserved
  assertEquals(body.textContent, '<>&"\'');
});
