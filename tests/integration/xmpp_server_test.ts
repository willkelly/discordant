/**
 * Integration tests using the Docker-based XMPP test server
 *
 * Prerequisites:
 * 1. Start the test server: ./scripts/test-server.sh start
 * 2. Create test users: ./scripts/test-server.sh setup-test-users
 * 3. Run tests: deno task test
 */

import { assertEquals, assertExists } from '@std/assert';

const TEST_SERVER_URL = 'ws://localhost:5280/xmpp-websocket';
const TEST_DOMAIN = 'localhost';

/**
 * Helper function to create a WebSocket connection and authenticate
 */
async function createAuthenticatedConnection(
  username: string,
  password: string,
  resource = 'test-resource'
): Promise<{ ws: WebSocket; jid: string }> {
  const ws = new WebSocket(TEST_SERVER_URL);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Connection timeout'));
    }, 10000);

    let clientJid = '';

    ws.onopen = () => {
      // Send stream opening
      ws.send(`<?xml version='1.0'?><stream:stream to='${TEST_DOMAIN}' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>`);
    };

    ws.onmessage = (event) => {
      const data = event.data as string;

      // Stream features received
      if (data.includes('<stream:features>') && data.includes('<mechanism>PLAIN</mechanism>')) {
        // Send SASL auth
        const authPayload = btoa(`\0${username}\0${password}`);
        ws.send(`<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>${authPayload}</auth>`);
      }
      // Auth successful
      else if (data.includes('<success xmlns=\'urn:ietf:params:xml:ns:xmpp-sasl\'/>')) {
        // Restart stream
        ws.send(`<?xml version='1.0'?><stream:stream to='${TEST_DOMAIN}' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>`);
      }
      // Bind available
      else if (data.includes('<bind xmlns=\'urn:ietf:params:xml:ns:xmpp-bind\'/>')) {
        // Request resource binding
        ws.send(`<iq type='set' id='bind_1'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'><resource>${resource}</resource></bind></iq>`);
      }
      // Bind successful
      else if (data.includes('<jid>') && data.includes('bind_1')) {
        const match = data.match(/<jid>([^<]+)<\/jid>/);
        if (match) {
          clientJid = match[1];
          // Request session
          ws.send(`<iq type='set' id='session_1'><session xmlns='urn:ietf:params:xml:ns:xmpp-session'/></iq>`);
        }
      }
      // Session established - authentication complete
      else if (data.includes('session_1') && data.includes('result')) {
        clearTimeout(timeout);
        resolve({ ws, jid: clientJid });
      }
    };

    ws.onerror = (error) => {
      clearTimeout(timeout);
      reject(error);
    };

    ws.onclose = () => {
      clearTimeout(timeout);
      if (!clientJid) {
        reject(new Error('Connection closed before authentication'));
      }
    };
  });
}

/**
 * Helper to close connection gracefully
 */
async function closeConnection(ws: WebSocket): Promise<void> {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('</stream:stream>');
    ws.close();
  }
  // Wait a bit for cleanup
  await new Promise(resolve => setTimeout(resolve, 100));
}

Deno.test({
  name: 'XMPP Server - basic authentication',
  ignore: false, // Set to true if server is not running
  fn: async () => {
    const { ws, jid } = await createAuthenticatedConnection('testuser1', 'password123');

    // Verify we got a valid JID
    assertExists(jid);
    assertEquals(jid.includes('testuser1@localhost/'), true);

    await closeConnection(ws);
  },
});

Deno.test({
  name: 'XMPP Server - send and receive presence',
  ignore: false,
  fn: async () => {
    const client1 = await createAuthenticatedConnection('alice', 'alicepass', 'client1');
    const client2 = await createAuthenticatedConnection('bob', 'bobpass', 'client2');

    // Send presence from alice
    let presenceReceived = false;

    const presencePromise = new Promise<void>((resolve) => {
      client2.ws.onmessage = (event) => {
        const data = event.data as string;
        if (data.includes('<presence') && data.includes('alice@localhost')) {
          presenceReceived = true;
          resolve();
        }
      };
    });

    // Alice sends presence
    client1.ws.send('<presence><show>chat</show><status>Available</status></presence>');

    // Wait for presence (with timeout)
    await Promise.race([
      presencePromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Presence timeout')), 5000)),
    ]);

    assertEquals(presenceReceived, true);

    await closeConnection(client1.ws);
    await closeConnection(client2.ws);
  },
});

Deno.test({
  name: 'XMPP Server - send and receive message',
  ignore: false,
  fn: async () => {
    const client1 = await createAuthenticatedConnection('testuser1', 'password123', 'sender');
    const client2 = await createAuthenticatedConnection('testuser2', 'password123', 'receiver');

    // Wait for a message
    const messagePromise = new Promise<string>((resolve) => {
      client2.ws.onmessage = (event) => {
        const data = event.data as string;
        if (data.includes('<message') && data.includes('<body>')) {
          const bodyMatch = data.match(/<body>([^<]+)<\/body>/);
          if (bodyMatch) {
            resolve(bodyMatch[1]);
          }
        }
      };
    });

    // Send a message from client1 to client2
    const messageText = 'Hello from testuser1!';
    client1.ws.send(
      `<message to='${client2.jid}' type='chat' id='msg_${Date.now()}'><body>${messageText}</body></message>`
    );

    // Wait for the message with timeout
    const receivedMessage = await Promise.race([
      messagePromise,
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Message timeout')), 5000)),
    ]);

    assertEquals(receivedMessage, messageText);

    await closeConnection(client1.ws);
    await closeConnection(client2.ws);
  },
});

Deno.test({
  name: 'XMPP Server - multiple concurrent connections',
  ignore: false,
  fn: async () => {
    // Create multiple connections simultaneously
    const connections = await Promise.all([
      createAuthenticatedConnection('testuser1', 'password123', 'conn1'),
      createAuthenticatedConnection('testuser2', 'password123', 'conn2'),
      createAuthenticatedConnection('alice', 'alicepass', 'conn3'),
      createAuthenticatedConnection('bob', 'bobpass', 'conn4'),
    ]);

    // Verify all connections are established
    assertEquals(connections.length, 4);
    connections.forEach(({ jid }) => {
      assertExists(jid);
      assertEquals(jid.includes('@localhost/'), true);
    });

    // Close all connections
    await Promise.all(connections.map(({ ws }) => closeConnection(ws)));
  },
});

Deno.test({
  name: 'XMPP Server - handle invalid credentials',
  ignore: false,
  fn: async () => {
    const ws = new WebSocket(TEST_SERVER_URL);

    const authFailed = await new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000);

      ws.onopen = () => {
        ws.send(`<?xml version='1.0'?><stream:stream to='${TEST_DOMAIN}' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>`);
      };

      ws.onmessage = (event) => {
        const data = event.data as string;

        if (data.includes('<mechanism>PLAIN</mechanism>')) {
          // Send auth with wrong credentials
          const authPayload = btoa('\0wronguser\0wrongpass');
          ws.send(`<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>${authPayload}</auth>`);
        } else if (data.includes('<failure')) {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        }
      };
    });

    assertEquals(authFailed, true);
  },
});
