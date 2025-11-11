/**
 * XMPP Client Service
 *
 * Re-exports the native XMPP client implementation.
 * Uses pure Web Standards (WebSocket, DOMParser) - no external XMPP libraries.
 */

export { NativeXMPPClient, xmppClient } from './native-client.ts';
