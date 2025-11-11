# Discordant - Claude Code Documentation

This documentation is specifically for working with this project using Claude Code. It provides context about the project structure, development setup, and testing infrastructure.

## Project Overview

Discordant is a modern XMPP-based chat client built with:
- **Runtime**: Deno 2.5+
- **Frontend**: Svelte 4 + Vite
- **Language**: TypeScript (strict mode)
- **XMPP**: Native implementation using WebSocket API
- **Testing**: Deno Test + Playwright + Docker XMPP server

## Quick Start for Development

```bash
# Install dependencies
/root/.deno/bin/deno install --unsafely-ignore-certificate-errors

# Run unit tests
/root/.deno/bin/deno test --allow-all --unsafely-ignore-certificate-errors

# Start dev server
/root/.deno/bin/deno task dev

# Run quality checks
/root/.deno/bin/deno task quality
```

## Testing Infrastructure

### Unit Tests (35 tests)

Unit tests run without external dependencies:

```bash
/root/.deno/bin/deno test tests/utils/ tests/stores/ tests/lib/ --allow-all
```

**Test files:**
- `tests/utils/jid_test.ts` - JID parsing utilities (9 tests)
- `tests/stores/conversations_test.ts` - Svelte store logic (5 tests)
- `tests/lib/xmpp/xml_test.ts` - XML parsing & security (17 tests)
- `tests/lib/storage/fileHandler_test.ts` - File handling (4 tests)

All unit tests should pass without any setup.

### Integration Tests (6 tests)

Integration tests require a Docker-based XMPP server:

**Setup:**
```bash
# Start the XMPP test server
./scripts/test-server.sh start

# Create test users
./scripts/test-server.sh setup-test-users

# Run integration tests
ENABLE_INTEGRATION_TESTS=true /root/.deno/bin/deno test tests/integration/ --allow-all
```

**Test file:**
- `tests/integration/xmpp_server_test.ts` - XMPP server integration (6 tests)

**Note:** Integration tests are automatically skipped when the server isn't running to prevent test failures in CI/CD environments where Docker may not be available.

**Test server endpoints:**
- WebSocket: `ws://localhost:5280/xmpp-websocket`
- XMPP Client: `localhost:5222`

**Default test users:**
- `testuser1@localhost` / `password123`
- `testuser2@localhost` / `password123`
- `alice@localhost` / `alicepass`
- `bob@localhost` / `bobpass`
- `admin@localhost` / `admin123`

### E2E Tests (Playwright)

E2E tests use Playwright for browser automation:

```bash
/root/.deno/bin/deno task test:e2e
```

**Known issue:** Chromium sandbox issues in container environments. Tests work fine in standard CI/CD.

## XMPP Test Server

A Docker-based Prosody XMPP server is available for integration testing.

### Management Commands

```bash
# Start server
./scripts/test-server.sh start

# Check status
./scripts/test-server.sh status

# Create a user
./scripts/test-server.sh create-user username password

# List users
./scripts/test-server.sh list-users

# View logs
./scripts/test-server.sh logs

# Stop server
./scripts/test-server.sh stop
```

### Configuration

- **Location**: `test-config/prosody/`
- **Docker Compose**: `docker-compose.test.yml`
- **Certificates**: Auto-generated self-signed certs in `test-config/prosody/certs/`

See `test-config/README.md` for comprehensive documentation.

## Project Structure

```
discordant/
├── src/
│   ├── types/              # TypeScript type definitions (union types)
│   │   ├── xmpp.ts        # XMPP protocol types
│   │   ├── chat.ts        # Message/conversation types
│   │   ├── user.ts        # User/contact types
│   │   ├── media.ts       # Audio/video call types
│   │   └── ...
│   ├── components/         # Svelte components
│   ├── stores/             # Svelte stores (state management)
│   │   ├── connection.ts  # XMPP connection state
│   │   ├── conversations.ts # Messages and conversations
│   │   ├── contacts.ts    # Contact roster
│   │   └── ...
│   ├── lib/
│   │   ├── xmpp/          # Native XMPP implementation
│   │   │   ├── native-client.ts # Main XMPP client
│   │   │   ├── xml.ts     # XML parsing with DOMParser
│   │   │   └── sasl.ts    # SASL authentication
│   │   ├── media/         # WebRTC services
│   │   └── storage/       # File handling
│   ├── utils/             # Helper functions
│   │   └── jid.ts         # JID parsing utilities
│   └── styles/            # Global styles and theme
├── tests/
│   ├── utils/             # Utility tests
│   ├── stores/            # Store tests
│   ├── lib/               # Library tests
│   └── integration/       # Integration tests (require XMPP server)
├── e2e/                   # Playwright E2E tests
├── scripts/
│   └── test-server.sh     # XMPP test server management
├── test-config/
│   └── prosody/           # XMPP server configuration
├── docker-compose.test.yml # Test server Docker Compose
├── deno.json              # Deno configuration
└── package.json           # npm compatibility layer
```

## Key Architecture Decisions

### Native XMPP Implementation

We implement XMPP using **native Web Standards** instead of libraries like Strophe.js:

- **WebSocket API** - XMPP over WebSocket (RFC 7395)
- **DOMParser** - XML parsing and construction
- **SASL PLAIN** - Authentication
- **Zero external XMPP dependencies**

**Benefits:**
- Smaller bundle size
- No unmaintained npm dependencies
- Full control over protocol implementation
- Follows Deno's Web Standards philosophy

### Type System

- **Union types** instead of enums (better tree-shaking)
- **No `any` types** - Full type safety
- **Explicit imports** - All imports include `.ts` extensions
- **Comprehensive coverage** - 7 type definition files, 40+ types

### Code Quality Standards

All code must pass:

```bash
/root/.deno/bin/deno task quality
```

This runs:
1. **Format check** - `deno fmt --check`
2. **Linting** - `deno lint`
3. **Type checking** - `deno check`
4. **Unit tests** - `deno test`

## Development Patterns

### Import Requirements

All imports MUST include explicit `.ts` extensions (Deno requirement):

```typescript
// ✅ Correct
import { JID } from '../types/xmpp.ts';
import { parseJID } from '../utils/jid.ts';

// ❌ Wrong - will fail in Deno
import { JID } from '../types/xmpp';
```

### Union Types Over Enums

```typescript
// ✅ Correct - union type
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// ❌ Avoid - enum
export enum MessageStatus { ... }
```

### Web Standards First

Leverage native Web APIs:

```typescript
// WebSocket for XMPP
const ws = new WebSocket('wss://xmpp.example.com/xmpp-websocket');

// DOMParser for XML
const parser = new DOMParser();
const doc = parser.parseFromString(xml, 'text/xml');

// Fetch API for HTTP
const response = await fetch('https://api.example.com/data');
```

### State Management (Svelte Stores)

In tests, use `get()` to read store values:

```typescript
import { get } from 'svelte/store';
import { conversations } from '@stores/conversations.ts';

const allConversations = get(conversations);
```

## Git Workflow

**Current branch:** `claude/work-in-progress-011CV1px9nmd8QACSdLQvpZV`

All development happens on feature branches starting with `claude/`.

### Committing Changes

```bash
# Add files
git add <files>

# Commit with descriptive message
git commit -m "Brief description

Detailed explanation of changes..."

# Push to remote
git push -u origin claude/work-in-progress-011CV1px9nmd8QACSdLQvpZV
```

## Common Tasks

### Adding New Tests

1. Create `*_test.ts` file in appropriate directory
2. Import test utilities: `import { assertEquals, assertExists } from '@std/assert';`
3. Write tests using `Deno.test()`
4. Run tests: `/root/.deno/bin/deno test <test-file> --allow-all`

### Modifying XMPP Implementation

Key files:
- `src/lib/xmpp/native-client.ts` - Main client
- `src/lib/xmpp/xml.ts` - XML utilities
- `src/lib/xmpp/sasl.ts` - Authentication
- `src/types/xmpp.ts` - Type definitions

**Testing:** Start test server and run integration tests

### Adding New Features

1. Define types in `src/types/`
2. Implement logic in `src/lib/` or `src/utils/`
3. Add tests in `tests/`
4. Create Svelte components in `src/components/`
5. Add store if needed in `src/stores/`
6. Run `deno task quality` to verify

## Troubleshooting

### Certificate Errors

Use `--unsafely-ignore-certificate-errors` flag:

```bash
/root/.deno/bin/deno test --allow-all --unsafely-ignore-certificate-errors
```

### Integration Tests Failing

1. Check if test server is running: `./scripts/test-server.sh status`
2. Check Docker: `docker ps`
3. View logs: `./scripts/test-server.sh logs`
4. Restart: `./scripts/test-server.sh restart`

### Deno Not Found

Use absolute path:

```bash
/root/.deno/bin/deno <command>
```

### Import Errors

Ensure all imports have `.ts` extensions and use absolute or relative paths.

## Resources

- **Test Server Documentation**: `test-config/README.md`
- **Project README**: `README.md`
- **Deno Manual**: https://docs.deno.com/
- **XMPP RFCs**:
  - RFC 6120 (Core)
  - RFC 6121 (IM)
  - RFC 7395 (WebSocket)

## Test Status

**Last test run:** 2025-11-11

```
✓ 35 unit tests passing
✓ 6 integration tests (skipped when server not running)
✓ E2E tests available (Playwright)
✓ All quality checks passing
```

## Performance Considerations

- **Bundle size**: Native XMPP keeps bundle small
- **Type safety**: No runtime overhead from types
- **Web Standards**: Browser-optimized APIs
- **Tree-shaking**: Union types enable better dead code elimination

## Security Features

- **XML Security**: Tests for XXE, entity expansion, XSS
- **SASL Auth**: Secure authentication mechanism
- **Type Safety**: Prevents common runtime errors
- **Explicit Permissions**: Deno's permission system

## Future Improvements

- [ ] Add SCRAM-SHA-1 authentication
- [ ] Implement OMEMO encryption
- [ ] Add Message Archive Management (MAM)
- [ ] Improve test coverage (currently 33%)
- [ ] Add more integration tests
- [ ] Implement push notifications

---

**Note**: This documentation is maintained for Claude Code. Keep it updated when making significant changes to project structure or workflows.
