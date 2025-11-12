# Discordant - Development Guide

## Overview

Discordant is a modern, beautiful XMPP-based chat client built with Fresh v2 (Deno's native web framework) and Preact. It features audio/video streaming support, file sharing, and a clean earth-tone UI optimized for readability.

## Project Structure

```
discordant/
├── routes/                # Fresh file-based routing
│   ├── _app.tsx          # Root layout component
│   └── index.tsx         # Main application route
│
├── islands/               # Interactive Preact components (client-side hydration)
│   ├── LoginIsland.tsx
│   ├── ChatViewIsland.tsx
│   ├── ConversationListIsland.tsx
│   ├── MessageListIsland.tsx
│   ├── MessageInputIsland.tsx
│   └── ToastIsland.tsx
│
├── components/            # Static Preact components (no client JS)
│   ├── Avatar.tsx
│   ├── Button.tsx
│   └── Input.tsx
│
├── signals/               # Preact Signals for reactive state
│   ├── connection.ts     # XMPP connection state
│   ├── user.ts           # Current user state
│   ├── contacts.ts       # Contact roster
│   ├── conversations.ts  # Conversations and messages
│   ├── calls.ts          # Audio/video calls
│   └── ui.ts             # UI state (modals, toasts, etc.)
│
├── src/
│   ├── types/             # Comprehensive TypeScript type definitions
│   │   ├── xmpp.ts       # XMPP protocol types
│   │   ├── user.ts       # User and contact types
│   │   ├── chat.ts       # Chat and message types
│   │   ├── media.ts      # Media streaming types
│   │   ├── storage.ts    # File handling types
│   │   └── ui.ts         # UI state types
│   │
│   ├── lib/              # Core services and utilities
│   │   ├── xmpp/
│   │   │   ├── native-client.ts  # Native XMPP client
│   │   │   ├── xml.ts            # XML parsing with security
│   │   │   └── sasl.ts           # SASL authentication
│   │   ├── media/
│   │   │   └── webrtc.ts         # WebRTC service
│   │   └── storage/
│   │       └── fileHandler.ts    # File handling service
│   │
│   └── utils/            # Helper functions
│       └── jid.ts        # JID parsing utilities
│
├── static/               # Static assets served directly
│   └── styles/
│       └── theme.ts      # Earth-tone theme configuration
│
├── tests/                # Unit tests (Deno)
│   ├── utils/
│   ├── lib/
│   ├── signals/
│   └── integration/      # XMPP server integration tests
│
├── e2e/                  # E2E tests (Playwright)
│   ├── login.spec.ts
│   ├── ui.spec.ts
│   └── accessibility.spec.ts
│
└── Configuration files
    ├── deno.json         # Deno configuration & import maps
    ├── fresh.config.ts   # Fresh v2 configuration
    ├── dev.ts            # Development server entry
    ├── main.ts           # Production server entry
    └── docker-compose.test.yml  # XMPP test server
```

## Technology Stack

- **Runtime:** Deno 2.5+
- **Language:** TypeScript (strict mode)
- **Framework:** Fresh v2
- **UI Library:** Preact
- **Reactivity:** Preact Signals
- **XMPP:** Native WebSocket implementation (no external library)
- **Testing:** Deno Test + Playwright + Docker XMPP server

## Getting Started

### Prerequisites

- Deno 2.5+

### Installation

This is a **100% Deno project**. No npm installation required!

```bash
# Dependencies are automatically fetched on first run
# Just start the dev server
deno task start
```

### Development

```bash
# Start Fresh dev server with hot reload
deno task start
```

The app will be available at http://localhost:8000

### Testing

```bash
# Run all quality checks (fmt, lint, check, test)
deno task quality

# Run unit tests only
deno task test

# Run tests in watch mode
deno task test:watch

# Run e2e tests
deno task test:e2e
```

**Current Test Results:**

- ✅ Unit tests: 35/35 passing
- ✅ Integration tests: 5 tests (conditionally run with Docker)
- ✅ Security tests: 17 XML security tests
- ✅ All quality checks passing

## Theme and Design

### Color Scheme

The app uses an earth-tone palette optimized for readability:

- **Primary/Accent:** `#956a28` (warm copper brown)
- **Background:** `#FAF7F2` (off-white)
- **Secondary Background:** `#F5E6D3` (cream)
- **Tertiary Background:** `#E8D5C4` (light tan)
- **Text Primary:** `#2A2419` (dark brown, high contrast)
- **Text Secondary:** `#4A3C2E` (medium brown)

### Design Principles

1. **Readability First:** High contrast, comfortable spacing, clear typography
2. **Accessibility:** ARIA labels, keyboard navigation, focus indicators
3. **Responsive:** Mobile-first design that scales to desktop
4. **Modern:** Clean, minimal interface with smooth transitions

## Key Features

### 1. Fresh Islands Architecture

Fresh uses an **islands architecture**:

- Static HTML rendered on the server (fast initial load)
- Only interactive components are hydrated on the client
- Minimal JavaScript sent to browser (~520 lines of client code)
- Excellent performance and SEO

**Islands** (interactive):

- LoginIsland - Authentication form with validation
- ChatViewIsland - Main chat interface container
- ConversationListIsland - Conversation sidebar
- MessageListIsland - Message display with auto-scroll
- MessageInputIsland - Message composition with file upload
- ToastIsland - Global notifications

**Components** (static):

- Avatar - User avatars with presence indicators
- Button - UI buttons with variants
- Input - Form inputs with validation

### 2. Preact Signals

State management using **Preact Signals** for fine-grained reactivity:

```typescript
import { computed, signal } from '@preact/signals';

// Mutable signals
export const connectionState = signal<ConnectionStateType>('disconnected');

// Computed signals (derived state)
export const isConnected = computed(() => {
  const state = connectionState.value;
  return state === 'connected' || state === 'authenticated';
});

// Direct access
connectionState.value = 'connecting';
console.log(isConnected.value); // false
```

**Signals:**

- `connection.ts` - XMPP connection state
- `user.ts` - Current user account
- `contacts.ts` - Contact roster
- `conversations.ts` - Chat conversations and messages
- `calls.ts` - Active audio/video calls
- `ui.ts` - UI state (modals, toasts, theme)

### 3. Native XMPP Implementation

Custom XMPP client using Web Standards:

- WebSocket API for XMPP over WebSocket (RFC 7395)
- DOMParser for XML parsing
- SASL PLAIN authentication
- Zero external XMPP dependencies
- Full protocol control
- 877 lines of native implementation

### 4. WebRTC Calls

- WebRTC-based audio/video calls
- Mute/unmute controls
- Camera on/off toggle

### 5. File Sharing

- File upload support
- Inline image rendering
- Automatic image optimization

## Type System

The app uses a comprehensive type system to ensure type safety and enable better IDE support:

- **XMPP Types** (`types/xmpp.ts`): Connection, stanzas, JIDs (400+ lines)
- **User Types** (`types/user.ts`): Accounts, contacts, presence (200 lines)
- **Chat Types** (`types/chat.ts`): Messages, conversations, groups (240 lines)
- **Media Types** (`types/media.ts`): Calls, streams, devices (200 lines)
- **Storage Types** (`types/storage.ts`): Uploads, downloads, files (100 lines)
- **UI Types** (`types/ui.ts`): Theme, modals, notifications (200 lines)

**Total: 1,466 lines of type definitions, 40+ types**

All types use **union types** instead of enums for better tree-shaking.

## DRY Principles

The codebase follows DRY (Don't Repeat Yourself) principles:

1. **Reusable Components:** Button, Input, Avatar, etc.
2. **Shared Types:** Comprehensive type definitions used throughout
3. **Utility Functions:** JID parsing, file formatting, etc.
4. **Service Layer:** XMPP, WebRTC, file handling abstracted into services
5. **Signal Pattern:** Centralized reactive state management

## Building for Production

```bash
# Fresh v2 uses runtime compilation
# The build command verifies initialization
deno task build

# Run production server
deno task start
```

**Note:** Fresh v2 uses runtime compilation, not traditional build artifacts. There is no `_fresh/` or `dist/` directory. The app compiles on demand for optimal performance.

## Testing Against XMPP Server

### Docker-Based Test Server

We provide a fully configured Prosody XMPP server for integration testing:

```bash
# Start test server
./scripts/test-server.sh start

# Create test users
./scripts/test-server.sh setup-test-users

# Check status
./scripts/test-server.sh status

# Run integration tests
ENABLE_INTEGRATION_TESTS=true deno test --allow-all

# Stop server
./scripts/test-server.sh stop
```

### Server Configuration

- **WebSocket Endpoint:** `ws://localhost:5280/xmpp-websocket`
- **XMPP Client Port:** `localhost:5222`
- **Configuration:** `test-config/prosody/`
- **Documentation:** `test-config/README.md`

### Test Users

Default test users created by setup script:

- `testuser1@localhost` / `password123`
- `testuser2@localhost` / `password123`
- `alice@localhost` / `alicepass`
- `bob@localhost` / `bobpass`
- `admin@localhost` / `admin123`

## Deno-Specific Development

This project follows **Deno-first development practices**:

### Import Requirements

Deno requires **explicit file extensions** in all imports:

```typescript
// ✅ Correct - includes .ts extension
import { JID } from '../src/types/xmpp.ts';
import { parseJID } from '../src/utils/jid.ts';

// ❌ Wrong - missing extension (will fail in Deno)
import { JID } from '../types/xmpp';
import { parseJID } from '../utils/jid';
```

### Import Map Aliases

Use configured aliases in `deno.json`:

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

### Type Safety

- All code uses TypeScript strict mode
- No `any` types throughout codebase
- Union types preferred over enums
- Explicit imports with `.ts`/`.tsx` extensions

### Permissions

Deno requires explicit permissions. Development tasks use `--allow-all`:

```json
{
  "tasks": {
    "start": "deno run -A --watch=static/,routes/,islands/,signals/ dev.ts",
    "test": "deno test --allow-all --parallel --coverage"
  }
}
```

## Contributing

When adding new features:

1. **Add type definitions** in `src/types/` (with .ts extensions!)
2. **Create components**:
   - Use `components/` for static components (no JS)
   - Use `islands/` for interactive components (hydrated)
3. **Use signals** for state management or create new signal files
4. **Write tests** in `tests/`
5. **Run quality checks**: `deno task quality`
6. **Update documentation**

### Creating Islands vs Components

Use **islands** when you need:

- User interaction (clicks, form inputs)
- Client-side state (useSignal)
- Event handlers
- Effects (useEffect)

Use **components** when you have:

- Static content
- Server-rendered UI
- No interactivity
- Better performance (no JS sent)

## Available Commands

```bash
# Development
deno task start         # Start dev server with hot reload
deno task check         # Type check all files

# Testing
deno task test          # Run unit tests with coverage
deno task test:watch    # Run tests in watch mode
deno task test:e2e      # Run Playwright e2e tests
deno task coverage      # Generate HTML coverage report

# Code Quality
deno task fmt           # Format code
deno task lint          # Lint code
deno task quality       # Run ALL checks (fmt, lint, check, test)

# Building
deno task build         # Verify Fresh v2 initialization
```

## Code Statistics

**Total Application Code:** ~2,800 lines

- Routes: 94 lines
- Islands: 520 lines (client-side JS)
- Components: 163 lines
- Signals: 214 lines
- XMPP Library: 877 lines
- Media/Storage: 270 lines
- Utils: 100 lines
- Types: 1,466 lines

**Test Code:** ~1,200 lines

- Unit Tests: 741 lines (35 tests)
- E2E Tests: 460 lines (7 spec files)

**Total:** ~5,400 lines TypeScript

## Performance Characteristics

- **Client JS:** Only ~520 lines (islands only)
- **Server-side:** Everything else rendered on server
- **Bundle Size:** Minimal (Fresh v2 sends only needed code)
- **Build Process:** Zero build time (runtime compilation)
- **Hot Reload:** Instant (~5s cold start)
- **Test Performance:** ~125ms for 35 tests

## Security Features

- **XML Security:** 17 tests for XXE, entity expansion, XSS
- **SASL Auth:** Secure authentication mechanism
- **Type Safety:** Prevents common runtime errors
- **Explicit Permissions:** Deno's permission system
- **Tag Filtering:** Blocks dangerous HTML tags
- **Event Handler Filtering:** Strips malicious attributes

## Future Roadmap

- SCRAM-SHA-1 authentication
- End-to-end encryption (OMEMO)
- Message Archive Management (MAM)
- Push notifications
- Message search
- Emoji reactions
- Voice messages
- Screen sharing

## License

See LICENSE file for details.
