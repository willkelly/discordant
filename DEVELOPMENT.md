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
│   │   │   ├── xml.ts            # XML parsing
│   │   │   └── sasl.ts           # SASL authentication
│   │   ├── media/
│   │   │   └── webrtc.ts         # WebRTC service
│   │   └── storage/
│   │       └── fileHandler.ts    # File handling service
│   │
│   ├── utils/            # Helper functions
│   │   └── jid.ts        # JID parsing utilities
│   │
│   └── styles/           # Global styles and theme
│       └── global.css    # Global CSS
│
├── static/               # Static assets served directly
│   └── styles/           # Component-specific CSS
│
├── tests/                # Unit tests (Deno)
│   ├── utils/
│   ├── lib/
│   └── signals/          # Signal tests
│
├── e2e/                  # E2E tests (Playwright)
│   ├── login.spec.ts
│   ├── ui.spec.ts
│   └── accessibility.spec.ts
│
└── Configuration files
    ├── deno.json         # Deno configuration
    ├── fresh.config.ts   # Fresh configuration
    ├── dev.ts            # Development server entry
    ├── main.ts           # Production server entry
    ├── tsconfig.json     # TypeScript config
    └── playwright.config.ts # Playwright config
```

## Technology Stack

- **Runtime:** Deno 2.5+
- **Language:** TypeScript (strict mode)
- **Framework:** Fresh v2 (beta)
- **UI Library:** Preact
- **Reactivity:** Preact Signals
- **XMPP:** Native WebSocket implementation (no external library)
- **Testing:** Deno Test + Playwright

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
# Run unit tests (recommended - uses Deno)
deno task test

# Run e2e tests
deno task test:e2e

# Alternative using npm
npm test
npm run test:e2e
```

**Current Test Results:**

- ✅ Unit tests: 18/18 passing
- ✅ Build: Successful
- ⚠️ E2E tests: See [TEST_RESULTS.md](TEST_RESULTS.md) for environment notes

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
- Minimal JavaScript sent to browser
- Excellent performance and SEO

**Islands** (interactive):

- LoginIsland - Authentication form with validation
- ChatViewIsland - Main chat interface container
- ConversationListIsland - Conversation sidebar
- MessageListIsland - Message display with auto-scroll
- MessageInputIsland - Message composition
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

- **XMPP Types** (`types/xmpp.ts`): Connection, stanzas, JIDs
- **User Types** (`types/user.ts`): Accounts, contacts, presence
- **Chat Types** (`types/chat.ts`): Messages, conversations, groups
- **Media Types** (`types/media.ts`): Calls, streams, devices
- **Storage Types** (`types/storage.ts`): Uploads, downloads, files
- **UI Types** (`types/ui.ts`): Theme, modals, notifications

All types are exported from `types/index.ts` for convenient importing.

## DRY Principles

The codebase follows DRY (Don't Repeat Yourself) principles:

1. **Reusable Components:** Button, Input, Avatar, etc.
2. **Shared Types:** Comprehensive type definitions used throughout
3. **Utility Functions:** JID parsing, file formatting, etc.
4. **Service Layer:** XMPP, WebRTC, file handling abstracted into services
5. **Store Pattern:** Centralized state management

## Building for Production

```bash
# Build for web
deno task build

# Run production server
deno task preview
```

Fresh builds are output to the `_fresh/` directory containing only the client-side JavaScript for islands.

## Testing Against Prosody

To test the app against a Prosody XMPP server:

1. Set up a Prosody server with WebSocket support
2. Configure WebSocket endpoint (e.g., `wss://your-server.com:5280/ws`)
3. Create test accounts
4. Connect using the login form

## Deno-Specific Development

This project follows **Deno-first development practices**:

### Import Requirements

Deno requires **explicit file extensions** in all imports:

```typescript
// ✅ Correct - includes .ts extension
import { JID } from '../types/xmpp.ts';
import { parseJID } from '../utils/jid.ts';

// ❌ Wrong - missing extension (will fail in Deno)
import { JID } from '../types/xmpp';
import { parseJID } from '../utils/jid';
```

### Importing Preact

Preact is imported from npm via Deno's JSR imports:

```typescript
// In components and islands
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

// JSX/TSX with Preact
export default function MyIsland() {
  const count = useSignal(0);
  return <button onClick={() => count.value++}>{count.value}</button>;
}
```

### Type Safety

- All code uses TypeScript strict mode
- No `any` types (removed all type casts)
- Union types preferred over enums for Svelte compatibility

### Permissions

Deno requires explicit permissions. All tasks use `--allow-all` for development:

```json
{
  "tasks": {
    "dev": "deno run --allow-all npm:vite",
    "test": "deno test --allow-all"
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
4. **Write unit tests** in `tests/`
5. **Run quality checks**: `deno task quality`
6. **Build to verify**: `deno task build`
7. **Add e2e tests** for user flows
8. **Update documentation**

### Creating Islands vs Components

Use **islands** when you need:

- User interaction (clicks, form inputs)
- Client-side state
- Event handlers
- Effects and side effects

Use **components** when you have:

- Static content
- Server-rendered UI
- No interactivity
- Better performance (no JS sent)

## Future Roadmap

- XEP-0416 authentication
- End-to-end encryption
- Client-side scripting support
- Push notifications
- Message search
- Emoji reactions
- Voice messages
- Screen sharing

## License

See LICENSE file for details.
