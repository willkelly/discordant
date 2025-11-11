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
- **Architecture**: Islands-based with server-side rendering

## Quick Start for Development

```bash
# No installation needed - dependencies are auto-fetched

# Run development server (with hot reload)
deno task start

# Run all quality checks (format, lint, type check, tests)
deno task quality

# Run tests only
deno test --allow-all --unsafely-ignore-certificate-errors

# Run formatting
deno fmt

# Run linter
deno lint

# Type check
deno task check
```

## Repository Statistics

**Total Application Code:** ~2,800 lines (excluding tests)
- Routes: 2 files, ~94 lines
- Islands: 6 files, ~520 lines
- Components: 3 files, ~163 lines
- Signals: 6 files, ~214 lines
- Types: 7 files, ~1,466 lines
- XMPP Library: 4 files, ~877 lines
- Media/Storage: 2 files, ~270 lines
- Utils: 1 file, ~100 lines

**Test Code:** ~1,200 lines
- Unit Tests: 5 files, 41 tests
- E2E Tests: 7 files (Playwright)

## Project Structure

```
discordant/
├── routes/                    # Fresh file-based routes (2 files)
│   ├── _app.tsx              # Root layout with theme
│   └── index.tsx             # Main app route (login/chat switching)
│
├── islands/                   # Interactive Preact components (6 files, ~520 lines)
│   ├── LoginIsland.tsx       # Authentication form (144 lines)
│   ├── ChatViewIsland.tsx    # Main chat interface container (90 lines)
│   ├── ConversationListIsland.tsx  # Sidebar conversation list (100 lines)
│   ├── MessageListIsland.tsx # Scrollable message display (110 lines)
│   ├── MessageInputIsland.tsx # Message composition with file upload (76 lines)
│   └── ToastIsland.tsx       # Toast notification system
│
├── components/                # Static Preact components (3 files, ~163 lines)
│   ├── Avatar.tsx            # User avatars with presence indicators (47 lines)
│   ├── Button.tsx            # Reusable button with variants (46 lines)
│   └── Input.tsx             # Form input with validation (70 lines)
│
├── signals/                   # Preact Signals state management (6 files, ~214 lines)
│   ├── connection.ts         # XMPP connection state (30 lines)
│   ├── conversations.ts      # Messages and conversations (60 lines)
│   ├── contacts.ts           # Contact roster management (36 lines)
│   ├── user.ts               # Current user data (20 lines)
│   ├── calls.ts              # Audio/video call state (30 lines)
│   └── ui.ts                 # UI state (toasts, modals) (38 lines)
│
├── src/
│   ├── types/                # TypeScript type definitions (7 files, ~1,466 lines)
│   │   ├── xmpp.ts          # XMPP protocol types (400+ lines)
│   │   ├── chat.ts          # Message/conversation types (240 lines)
│   │   ├── user.ts          # User/contact/roster types (200 lines)
│   │   ├── media.ts         # Audio/video call types (200 lines)
│   │   ├── ui.ts            # Theme/UI types (200 lines)
│   │   ├── storage.ts       # File handling types (100 lines)
│   │   └── index.ts         # Central type exports (26 lines)
│   │
│   ├── lib/
│   │   ├── xmpp/            # Native XMPP implementation (4 files, ~877 lines)
│   │   │   ├── native-client.ts  # Main XMPP client (400+ lines)
│   │   │   ├── xml.ts       # XML parsing with security (300+ lines)
│   │   │   ├── sasl.ts      # SASL authentication (100 lines)
│   │   │   └── client.ts    # Client exports (77 lines)
│   │   │
│   │   ├── media/
│   │   │   └── webrtc.ts    # WebRTC service (170 lines)
│   │   │
│   │   └── storage/
│   │       └── fileHandler.ts # File upload/download (100 lines)
│   │
│   ├── utils/
│   │   └── jid.ts           # JID parsing utilities (100 lines)
│   │
│   └── styles/
│       └── theme.ts         # Theme configuration (duplicate, use static/)
│
├── static/                   # Static assets served directly
│   └── styles/
│       └── theme.ts         # Earth-tone theme config (200 lines)
│
├── tests/                    # Unit & integration tests (5 files, ~741 lines)
│   ├── utils/
│   │   └── jid_test.ts      # JID parsing tests (9 tests, 150 lines)
│   ├── signals/
│   │   └── conversations_test.ts # Signal logic tests (5 tests, 100 lines)
│   ├── lib/
│   │   ├── xmpp/
│   │   │   └── xml_test.ts  # XML security tests (17 tests, 300+ lines)
│   │   └── storage/
│   │       └── fileHandler_test.ts # File handling tests (4 tests, 100 lines)
│   └── integration/
│       └── xmpp_server_test.ts # Server integration (6 tests, 191 lines)
│
├── e2e/                      # Playwright E2E tests (7 files, ~460 lines)
│   ├── login.spec.ts        # Login flow testing
│   ├── ui.spec.ts           # UI interaction testing
│   ├── accessibility.spec.ts # Accessibility testing
│   └── ... (debug specs)
│
├── .github/workflows/        # CI/CD automation (4 workflows)
│   ├── quality.yml          # Lint, format, type check, test
│   ├── pr.yml               # Pull request quality gate
│   ├── security.yml         # Security scanning
│   └── release.yml          # Release automation
│
├── test-config/             # Docker XMPP server config
│   └── prosody/             # Prosody configuration
│
├── scripts/
│   └── test-server.sh       # XMPP test server management
│
├── deno.json                # Deno configuration & import maps
├── fresh.config.ts          # Fresh framework configuration
├── dev.ts                   # Development server entry
├── main.ts                  # Production server entry
└── docker-compose.test.yml  # Test server Docker Compose
```

## Testing Infrastructure

### Unit Tests (41 tests total, all passing ✅)

Unit tests run without external dependencies:

```bash
# Run all unit tests
deno test tests/utils/ tests/signals/ tests/lib/ --allow-all

# Run specific test file
deno test tests/lib/xmpp/xml_test.ts --allow-all
```

**Test files:**

- `tests/utils/jid_test.ts` - JID parsing utilities (9 tests)
- `tests/signals/conversations_test.ts` - Preact signals logic (5 tests)
- `tests/lib/xmpp/xml_test.ts` - **XML parsing & security** (17 tests)
  - XSS prevention (script, iframe, object, embed tags)
  - Entity expansion attacks
  - Event handler attribute filtering
  - DOCTYPE declaration blocking
- `tests/lib/storage/fileHandler_test.ts` - File handling (4 tests)

All unit tests pass without any setup. Run with `deno task test`.

### Integration Tests (6 tests, conditionally run)

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
  - Basic authentication
  - Presence exchange
  - Message sending/receiving
  - Multiple concurrent connections
  - Invalid credential handling

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

**Test files:**

- `e2e/login.spec.ts` - Login flow testing
- `e2e/ui.spec.ts` - UI interaction testing
- `e2e/accessibility.spec.ts` - Accessibility testing
- `e2e/smoke.spec.ts` - Basic functionality testing
- Debug specs for troubleshooting

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

## Key Architecture Decisions

### 1. Fresh Islands Architecture

We use **Fresh v2** (Deno's native web framework) with islands architecture:

- **Server-side rendering** - Static HTML generated on server
- **Islands hydration** - Only interactive components get client JS (6 islands, ~520 lines)
- **Minimal JavaScript** - Small bundle sizes, fast page loads (~520 lines of client code)
- **Preact Signals** - Fine-grained reactivity (214 lines of state management)

**Benefits:**

- Excellent performance (mostly static HTML)
- Zero build step in development
- Native Deno integration
- Automatic code splitting
- Runtime compilation (no build artifacts)

### 2. Native XMPP Implementation

We implement XMPP using **native Web Standards** instead of libraries like Strophe.js:

- **WebSocket API** - XMPP over WebSocket (RFC 7395)
- **DOMParser** - XML parsing and construction
- **SASL PLAIN** - Authentication
- **Zero external XMPP dependencies**
- **877 lines** of native implementation vs 1000s in libraries

**Benefits:**

- Smaller bundle size
- No unmaintained npm dependencies
- Full control over protocol implementation
- Follows Deno's Web Standards philosophy

### 3. Type System (Union Types > Enums)

- **Union types** instead of enums (better tree-shaking)
- **No `any` types** - Full type safety (strict mode)
- **Explicit imports** - All imports include `.ts` extensions
- **Comprehensive coverage** - 7 type definition files, 1,466 lines, 40+ types

**Why union types?**

```typescript
// ✅ Good - tree-shakes unused values
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// ❌ Avoid - entire enum bundled even if only one value used
export enum MessageStatus { SENDING, SENT, DELIVERED, READ, FAILED }
```

### 4. Security First

- **17 XML security tests** - XSS prevention, entity expansion attacks
- **DOCTYPE blocking** - Prevents XXE vulnerabilities
- **Tag filtering** - Blocks script, iframe, object, embed tags
- **Event handler filtering** - Strips onclick, onload, onerror attributes
- **Type safety** - Strict TypeScript prevents runtime errors

### 5. Code Quality Standards

All code must pass:

```bash
deno task quality
```

This runs:

1. **Format check** - `deno fmt --check`
2. **Linting** - `deno lint`
3. **Type checking** - `deno task check`
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

### Import Map Aliases

Use the configured aliases in `deno.json`:

```typescript
// Type imports
import type { JID } from '@types/xmpp.ts';
import type { ChatMessage } from '@types/chat.ts';

// Library imports
import { xmppClient } from '@lib/xmpp/client.ts';
import { parseJID } from '@utils/jid.ts';

// Signal imports
import { conversations } from '@signals/conversations.ts';
import { showToast } from '@signals/ui.ts';
```

### Union Types Over Enums

```typescript
// ✅ Correct - union type
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// ❌ Avoid - enum
export enum MessageStatus { SENDING, SENT, DELIVERED, READ, FAILED }
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

// Write signal value (creates new Map for reactivity)
const updated = new Map(conversations.value);
updated.set(id, conversation);
conversations.value = updated;

// Computed signals update automatically
const sorted = sortedConversations.value; // derived from conversations
```

**Important:** Preact signals don't have an `.update()` method. Always reassign `.value`:

```typescript
// ✅ Correct
const calls = new Map(activeCalls.value);
calls.set(id, call);
activeCalls.value = calls;

// ❌ Wrong - update() doesn't exist
activeCalls.update(calls => { ... });
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

Ensure all imports have `.ts` or `.tsx` extensions and use absolute or relative paths, or import map aliases.

### Type Errors

Common issues:
- Missing `.ts`/`.tsx` extensions on imports
- Using `@types/` prefix instead of direct `../src/types/` paths in files
- Import map aliases work everywhere except in TSX files (use relative paths there)

## CI/CD Workflows

### Quality Workflow (`.github/workflows/quality.yml`)

Runs on every push:
- ✅ Format check (`deno fmt --check`)
- ✅ Linting (`deno lint`)
- ✅ Type checking (`deno task check`)
- ✅ Unit tests (`deno task test`)
- ✅ Build verification (Fresh v2 initialization)

### PR Workflow (`.github/workflows/pr.yml`)

Runs on pull requests:
- ✅ Full quality suite (`deno task quality`)
- ✅ Build verification
- 📝 Comments on PR if checks fail

**Note:** Fresh v2 uses runtime compilation, so no build artifacts are generated. The build step validates that the app can initialize.

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

## Current Status

**Last updated:** 2025-11-11

```
✅ All quality checks passing
✅ 41 unit tests passing
✅ Integration tests available (requires Docker)
✅ E2E tests configured
✅ CI/CD workflows passing
✅ Fresh v2 migration complete
✅ Type safety: strict mode, no any types
✅ Security: 17 XML security tests
```

**Code statistics:**
- Application code: ~2,800 lines
- Type definitions: ~1,466 lines
- Test code: ~1,200 lines
- Total: ~5,400 lines of TypeScript

## Performance Considerations

- **Islands architecture**: Minimal client-side JavaScript (~520 lines)
- **Bundle size**: Native XMPP + Fresh keeps bundle small
- **Server-side rendering**: Fast initial page loads
- **Type safety**: No runtime overhead from types
- **Web Standards**: Browser-optimized APIs
- **Tree-shaking**: Union types enable better dead code elimination

## Security Features

- **XML Security**: 17 tests for XXE, entity expansion, XSS
- **SASL Auth**: Secure authentication mechanism
- **Type Safety**: Prevents common runtime errors
- **Explicit Permissions**: Deno's permission system
- **Tag Filtering**: Blocks dangerous HTML tags
- **Event Handler Filtering**: Strips malicious attributes

## Future Improvements

- [ ] Add SCRAM-SHA-1 authentication
- [ ] Implement OMEMO encryption
- [ ] Add Message Archive Management (MAM)
- [ ] Improve test coverage
- [ ] Add more integration tests
- [ ] Implement push notifications
- [ ] Add file upload/download
- [ ] Implement group chat (MUC)

---

**Note**: This documentation is maintained for Claude Code. Keep it updated when making significant changes to project structure or workflows.
