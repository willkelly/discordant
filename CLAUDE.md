# Discordant - Claude Code Documentation

This documentation is specifically for working with this project using Claude Code. It provides context about the project structure, development setup, and testing infrastructure.

## Project Overview

Discordant is a modern XMPP-based chat client built with:

- **Runtime**: Deno 2.5+
- **Framework**: Fresh v2 (Deno's native web framework)
- **UI Library**: Preact + Preact Signals
- **Language**: TypeScript (strict mode)
- **XMPP**: Native implementation using WebSocket API
- **Testing**: Deno Test + Playwright + Docker XMPP server

## Quick Start for Development

```bash
# No installation needed - dependencies are auto-fetched

# Run unit tests
deno test --allow-all --unsafely-ignore-certificate-errors

# Start dev server (Fresh with hot reload)
deno task start

# Run quality checks
deno task quality
```

## Testing Infrastructure

### Unit Tests (35 tests)

Unit tests run without external dependencies:

```bash
deno test tests/utils/ tests/signals/ tests/lib/ --allow-all
```

**Test files:**

- `tests/utils/jid_test.ts` - JID parsing utilities (9 tests)
- `tests/signals/conversations_test.ts` - Preact signals logic (5 tests)
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
ENABLE_INTEGRATION_TESTS=true deno test tests/integration/ --allow-all
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
deno task test:e2e
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
├── routes/                # Fresh file-based routes
│   ├── _app.tsx          # Root layout
│   └── index.tsx         # Main application route
├── islands/               # Interactive Preact components (hydrated client-side)
│   ├── LoginIsland.tsx
│   ├── ChatViewIsland.tsx
│   ├── ConversationListIsland.tsx
│   ├── MessageListIsland.tsx
│   ├── MessageInputIsland.tsx
│   └── ToastIsland.tsx
├── components/            # Static Preact components (no client JS)
│   ├── Avatar.tsx
│   ├── Button.tsx
│   └── Input.tsx
├── signals/               # Preact Signals (reactive state management)
│   ├── connection.ts     # XMPP connection state
│   ├── conversations.ts  # Messages and conversations
│   ├── contacts.ts       # Contact roster
│   ├── user.ts           # Current user
│   ├── calls.ts          # Audio/video calls
│   └── ui.ts             # UI state
├── src/
│   ├── types/             # TypeScript type definitions (union types)
│   │   ├── xmpp.ts       # XMPP protocol types
│   │   ├── chat.ts       # Message/conversation types
│   │   ├── user.ts       # User/contact types
│   │   ├── media.ts      # Audio/video call types
│   │   └── ...
│   ├── lib/
│   │   ├── xmpp/         # Native XMPP implementation
│   │   │   ├── native-client.ts # Main XMPP client
│   │   │   ├── xml.ts    # XML parsing with DOMParser
│   │   │   └── sasl.ts   # SASL authentication
│   │   ├── media/        # WebRTC services
│   │   └── storage/      # File handling
│   ├── utils/            # Helper functions
│   │   └── jid.ts        # JID parsing utilities
│   └── styles/           # Global styles and theme
├── static/               # Static assets served directly
│   └── styles/           # Component-specific CSS
├── tests/
│   ├── utils/            # Utility tests
│   ├── signals/          # Signal tests
│   ├── lib/              # Library tests
│   └── integration/      # Integration tests (require XMPP server)
├── e2e/                  # Playwright E2E tests
├── scripts/
│   └── test-server.sh    # XMPP test server management
├── test-config/
│   └── prosody/          # XMPP server configuration
├── docker-compose.test.yml # Test server Docker Compose
├── fresh.config.ts       # Fresh configuration
├── dev.ts                # Development server entry
├── main.ts               # Production server entry
├── deno.json             # Deno configuration
└── package.json          # Metadata only (no dependencies)
```

## Key Architecture Decisions

### Fresh Islands Architecture

We use **Fresh v2** (Deno's native web framework) with islands architecture:

- **Server-side rendering** - Static HTML generated on server
- **Islands hydration** - Only interactive components get client JS
- **Minimal JavaScript** - Small bundle sizes, fast page loads
- **Preact Signals** - Fine-grained reactivity

**Benefits:**

- Excellent performance (mostly static HTML)
- Zero build step in development
- Native Deno integration
- Automatic code splitting

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
deno task quality
```

This runs:

1. **Format check** - `deno fmt --check`
2. **Linting** - `deno lint`
3. **Type checking** - `deno check`
4. **Unit tests** - `deno test`

## Development Patterns

### Import Requirements

All imports MUST include explicit extensions (Deno requirement):

```typescript
// ✅ Correct - .ts for TypeScript
import { JID } from '../src/types/xmpp.ts';
import { parseJID } from '../src/utils/jid.ts';

// ✅ Correct - .tsx for TSX files
import LoginIsland from '../islands/LoginIsland.tsx';

// ❌ Wrong - missing extension (will fail in Deno)
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

### State Management (Preact Signals)

Access signal values directly using `.value`:

```typescript
import { conversations } from '@signals/conversations.ts';

// Read signal value
const allConversations = conversations.value;

// Write signal value
conversations.value = new Map([...]);

// Computed signals update automatically
const sorted = sortedConversations.value; // derived from conversations
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
4. Run tests: `deno test <test-file> --allow-all`

### Modifying XMPP Implementation

Key files:

- `src/lib/xmpp/native-client.ts` - Main client (uses signals)
- `src/lib/xmpp/xml.ts` - XML utilities
- `src/lib/xmpp/sasl.ts` - Authentication
- `src/types/xmpp.ts` - Type definitions

**Testing:** Start test server and run integration tests

### Adding New Features

1. Define types in `src/types/`
2. Implement logic in `src/lib/` or `src/utils/`
3. Add tests in `tests/`
4. Create components:
   - Static components in `components/` (no client JS)
   - Interactive islands in `islands/` (hydrated)
5. Add signals if needed in `signals/`
6. Create routes if needed in `routes/`
7. Run `deno task quality` to verify

### Islands vs Components

**Use islands** when you need:

- User interaction (clicks, inputs)
- Client-side state (useSignal)
- Event handlers
- Effects (useEffect)

**Use components** when you have:

- Static content
- No interactivity
- Server-only rendering
- Better performance (no JS)

## Troubleshooting

### Certificate Errors

Use `--unsafely-ignore-certificate-errors` flag:

```bash
deno test --allow-all --unsafely-ignore-certificate-errors
```

### Integration Tests Failing

1. Check if test server is running: `./scripts/test-server.sh status`
2. Check Docker: `docker ps`
3. View logs: `./scripts/test-server.sh logs`
4. Restart: `./scripts/test-server.sh restart`

### Import Errors

Ensure all imports have `.ts` or `.tsx` extensions and use absolute or relative paths.

## Resources

- **Test Server Documentation**: `test-config/README.md`
- **Project README**: `README.md`
- **Fresh Documentation**: https://fresh.deno.dev/
- **Preact Signals**: https://preactjs.com/guide/v10/signals/
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

- **Islands architecture**: Minimal client-side JavaScript
- **Bundle size**: Native XMPP + Fresh keeps bundle small
- **Server-side rendering**: Fast initial page loads
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
