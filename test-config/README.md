# XMPP Test Server

This directory contains configuration for a local XMPP server (Prosody) used for testing.

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Ports 5222, 5280, and 5281 available

### Start the Server

```bash
./scripts/test-server.sh start
```

This will:
1. Generate self-signed SSL certificates (if needed)
2. Start the Prosody XMPP server in Docker
3. Wait for the server to be ready

### Create Test Users

```bash
# Create individual users
./scripts/test-server.sh create-user alice password123
./scripts/test-server.sh create-user bob password123

# Or create all default test users at once
./scripts/test-server.sh setup-test-users
```

Default test users (created by `setup-test-users`):
- `testuser1@localhost` / `password123`
- `testuser2@localhost` / `password123`
- `alice@localhost` / `alicepass`
- `bob@localhost` / `bobpass`
- `admin@localhost` / `admin123`

### Stop the Server

```bash
./scripts/test-server.sh stop
```

## Server Endpoints

- **WebSocket**: `ws://localhost:5280/xmpp-websocket`
- **XMPP Client**: `localhost:5222`
- **HTTP**: `http://localhost:5280`

## Using in Tests

### Deno Tests

```typescript
// tests/integration/xmpp_client_test.ts
import { XMPPClient } from '@lib/xmpp/native-client.ts';

Deno.test('Connect to test server', async () => {
  const client = new XMPPClient({
    service: 'ws://localhost:5280/xmpp-websocket',
    domain: 'localhost',
    resource: 'test-resource',
  });

  await client.connect('testuser1', 'password123');

  // Your test code here

  await client.disconnect();
});
```

### Before Running Tests

Make sure the test server is running:

```bash
# Terminal 1: Start the server
./scripts/test-server.sh start

# Terminal 2: Run tests
deno task test
```

Or use a test setup script that starts/stops the server automatically.

## Management Commands

```bash
# Check server status
./scripts/test-server.sh status

# View server logs
./scripts/test-server.sh logs

# List registered users
./scripts/test-server.sh list-users

# Restart server
./scripts/test-server.sh restart

# Delete a user
./scripts/test-server.sh delete-user alice
```

## Configuration

The Prosody configuration is located at:
- `test-config/prosody/prosody.cfg.lua`

Key settings for testing:
- Registration enabled (no throttling)
- No encryption required
- WebSocket support enabled
- BOSH support enabled
- Message Archive Management (MAM) enabled
- In-memory storage

## Troubleshooting

### Port Already in Use

If ports 5222, 5280, or 5281 are already in use, you can modify the ports in `docker-compose.test.yml`:

```yaml
ports:
  - "15222:5222"   # Changed external port
  - "15280:5280"
  - "15281:5281"
```

Then update your test connection URLs accordingly.

### Server Won't Start

1. Check Docker is running: `docker ps`
2. Check logs: `./scripts/test-server.sh logs`
3. Try restarting: `./scripts/test-server.sh restart`

### Can't Connect from Tests

1. Verify server is running: `./scripts/test-server.sh status`
2. Check the WebSocket endpoint is accessible:
   ```bash
   curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
        http://localhost:5280/xmpp-websocket
   ```
3. Ensure test users exist: `./scripts/test-server.sh list-users`

### Permission Errors

Make sure scripts are executable:

```bash
chmod +x scripts/test-server.sh
chmod +x test-config/prosody/generate-certs.sh
```

## CI/CD Integration

For automated testing in CI/CD pipelines:

```bash
# In your CI script
./scripts/test-server.sh start
./scripts/test-server.sh setup-test-users

# Run your tests
deno task test

# Cleanup
./scripts/test-server.sh stop
```

Example GitHub Actions workflow:

```yaml
- name: Start XMPP test server
  run: |
    ./scripts/test-server.sh start
    ./scripts/test-server.sh setup-test-users

- name: Run tests
  run: deno task test

- name: Stop XMPP test server
  if: always()
  run: ./scripts/test-server.sh stop
```

## Architecture

```
┌─────────────────┐
│   Test Runner   │
└────────┬────────┘
         │
         │ WebSocket
         │ ws://localhost:5280/xmpp-websocket
         │
┌────────▼────────┐
│  Prosody XMPP   │
│     Server      │
│   (Docker)      │
└─────────────────┘
```

The test server:
- Runs in an isolated Docker container
- Uses in-memory storage (no persistence)
- Accepts WebSocket connections on port 5280
- Supports standard XMPP features (presence, messaging, IQ)
- Allows easy user registration for testing

## Cleanup

To completely remove the test server and associated data:

```bash
./scripts/test-server.sh stop
docker compose -f docker-compose.test.yml down -v
```
