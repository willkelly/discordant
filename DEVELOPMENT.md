# Discordant - Development Guide

## Overview

Discordant is a modern, beautiful XMPP-based chat client built with Deno, TypeScript, and Svelte. It features audio/video streaming support, file sharing, and a clean earth-tone UI optimized for readability.

## Project Structure

```
discordant/
├── src/
│   ├── types/              # Comprehensive TypeScript type definitions
│   │   ├── xmpp.ts        # XMPP protocol types
│   │   ├── user.ts        # User and contact types
│   │   ├── chat.ts        # Chat and message types
│   │   ├── media.ts       # Media streaming types
│   │   ├── storage.ts     # File handling types
│   │   └── ui.ts          # UI state types
│   │
│   ├── components/        # Svelte components
│   │   ├── shared/        # Reusable UI components
│   │   │   ├── Button.svelte
│   │   │   ├── Input.svelte
│   │   │   ├── Avatar.svelte
│   │   │   └── Toast.svelte
│   │   ├── auth/          # Authentication components
│   │   │   └── LoginForm.svelte
│   │   └── chat/          # Chat components
│   │       ├── ConversationList.svelte
│   │       ├── MessageList.svelte
│   │       ├── MessageInput.svelte
│   │       └── ChatView.svelte
│   │
│   ├── stores/            # Svelte stores for state management
│   │   ├── connection.ts  # XMPP connection state
│   │   ├── user.ts        # Current user state
│   │   ├── contacts.ts    # Contact roster
│   │   ├── conversations.ts # Conversations and messages
│   │   ├── calls.ts       # Audio/video calls
│   │   └── ui.ts          # UI state (modals, toasts, etc.)
│   │
│   ├── lib/               # Core services and utilities
│   │   ├── xmpp/
│   │   │   └── client.ts  # XMPP client service
│   │   ├── media/
│   │   │   └── webrtc.ts  # WebRTC service
│   │   └── storage/
│   │       └── fileHandler.ts # File handling service
│   │
│   ├── utils/             # Helper functions
│   │   └── jid.ts         # JID parsing utilities
│   │
│   ├── styles/            # Global styles and theme
│   │   ├── theme.ts       # Theme configuration
│   │   └── global.css     # Global CSS
│   │
│   ├── App.svelte         # Root component
│   └── main.ts            # Entry point
│
├── tests/                 # Unit tests (Deno)
│   ├── utils/
│   ├── lib/
│   └── stores/
│
├── e2e/                   # E2E tests (Playwright)
│   ├── login.spec.ts
│   ├── ui.spec.ts
│   └── accessibility.spec.ts
│
└── Configuration files
    ├── deno.json          # Deno configuration
    ├── package.json       # NPM dependencies
    ├── vite.config.ts     # Vite bundler config
    ├── tsconfig.json      # TypeScript config
    ├── playwright.config.ts # Playwright config
    └── capacitor.config.ts  # Capacitor (native apps) config
```

## Technology Stack

- **Runtime:** Deno
- **Language:** TypeScript (strict mode)
- **Framework:** Svelte 4
- **Build Tool:** Vite
- **XMPP Library:** Strophe.js
- **Native Apps:** Capacitor
- **Testing:** Deno Test + Playwright

## Getting Started

### Prerequisites

- Deno 1.40+
- Node.js 18+ (for npm dependencies)

### Installation

This is a **Deno-first project**. Use Deno commands primarily:

```bash
# Cache dependencies (recommended for Deno)
deno cache --reload src/main.ts

# Or install npm packages if needed
npm install
```

### Development

```bash
# Start dev server (recommended - uses Deno)
deno task dev

# Alternative using npm
npm run dev
```

The app will be available at http://localhost:3000

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

### 1. XMPP Messaging

- Full XMPP protocol support via Strophe.js
- Real-time message delivery
- Presence updates
- Contact roster management

### 2. Audio/Video Calls

- WebRTC-based calls
- Audio and video support
- Mute/unmute controls
- Camera on/off toggle

### 3. File Sharing

- File upload support
- Inline image rendering
- Automatic image optimization
- Thumbnail generation

### 4. State Management

All application state is managed through Svelte stores:

- `connectionState` - XMPP connection status
- `currentUser` - Current user account
- `contacts` - Contact roster
- `conversations` - Chat conversations
- `messages` - Message history
- `activeCalls` - Active audio/video calls
- `ui` - UI state (modals, toasts, theme)

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
# Build for web (recommended - uses Deno)
deno task build

# Alternative using npm
npm run build

# Preview production build
deno task preview

# Build for Android
npx cap add android
npx cap sync android
npx cap open android

# Build for iOS
npx cap add ios
npx cap sync ios
npx cap open ios
```

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

### Using npm Packages

npm packages are accessed via the `npm:` specifier in Deno:

```typescript
// In deno.json tasks
"dev": "deno run --allow-all npm:vite"

// This allows Deno to run npm packages without node_modules
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

1. Add type definitions first (with .ts extensions!)
2. Create reusable components
3. Use existing stores or create new ones
4. Write unit tests
5. Run `deno task test` to verify tests pass
6. Run `deno task build` to ensure it builds
7. Add e2e tests for user flows
8. Update documentation

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
