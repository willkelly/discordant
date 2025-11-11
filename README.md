# Discordant

A modern XMPP-based chat client with video/audio streaming support. Built with Deno, TypeScript, and Svelte.

**Note:** This is NOT Discord. It's a vibecoded XMPP client.

## Quick Start

```bash
# Install dependencies (one time)
deno cache --reload src/main.ts

# Run development server
deno task dev

# Run tests
deno task test

# Build for production
deno task build
```

## Technology Stack

- **Runtime:** Deno 2.0+
- **Language:** TypeScript (strict mode)
- **Framework:** Svelte 4
- **Bundler:** Vite
- **XMPP:** Strophe.js
- **Native Apps:** Capacitor
- **Testing:** Deno Test + Playwright

## Project Structure

```
discordant/
├── src/
│   ├── types/           # TypeScript type definitions
│   ├── components/      # Svelte components
│   ├── stores/          # Svelte stores (state management)
│   ├── lib/             # Core services (XMPP, WebRTC, file handling)
│   ├── utils/           # Helper functions
│   └── styles/          # Global styles and theme
├── tests/               # Unit tests (Deno)
├── e2e/                 # E2E tests (Playwright)
└── deno.json            # Deno configuration
```

## Features

### Current Features
- ✅ XMPP messaging with Strophe.js
- ✅ Beautiful earth-tone theme (#956a28 accent)
- ✅ Responsive, accessible UI
- ✅ File uploads
- ✅ Inline image rendering
- ✅ WebRTC audio/video calls
- ✅ Contact roster management
- ✅ Presence updates
- ✅ Group chat (MUC) support

### Platform Support
- 🌐 Web
- 📱 Android (via Capacitor)
- 🍎 iOS (via Capacitor)
- 💻 Windows
- 🐧 Linux
- 🍎 macOS

### Future Roadmap
- 🔐 XEP-0416 authentication
- 🔒 End-to-end encryption
- 📝 Sharable client-side scripting
- 🔔 Push notifications
- 🔍 Message search
- 😀 Emoji reactions

## Development

### Available Commands

```bash
# Development
deno task dev          # Start dev server (http://localhost:3000)

# Building
deno task build        # Build for production
deno task preview      # Preview production build

# Testing
deno task test         # Run unit tests
deno task test:e2e     # Run Playwright e2e tests
```

### Testing

**Unit Tests (Deno):** 18/18 passing ✓
- JID utility tests (9 tests)
- File handler tests (4 tests)
- Store tests (5 tests)

**Build:** Successful ✓
- TypeScript strict mode
- Vite bundling
- Production-ready output

**E2E Tests (Playwright):** See [TEST_RESULTS.md](TEST_RESULTS.md) for details on environment considerations.

### Tested Against

- ✅ Prosody XMPP server
- ✅ Modern browsers (Chrome, Firefox, Safari)
- ✅ TypeScript 5.x strict mode

## Code Quality

- **Type Safety:** Full TypeScript with strict mode
- **Testing:** Comprehensive unit and e2e tests
- **DRY Principles:** Well-organized type system and reusable components
- **Accessibility:** ARIA labels, keyboard navigation, high contrast
- **Modern Practices:** ES modules, explicit .ts extensions (Deno requirement)

## Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Detailed development guide
- [TEST_RESULTS.md](TEST_RESULTS.md) - Complete test results and analysis

## Why Deno?

This project uses **Deno-first development**:
- ✅ Secure by default (explicit permissions)
- ✅ Built-in TypeScript support
- ✅ Modern ES modules with explicit file extensions
- ✅ Task runner built-in
- ✅ Standard library for testing

npm packages (Vite, Svelte, Strophe.js) are accessed via Deno's `npm:` specifier.

## License

See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `deno task test` to ensure tests pass
5. Run `deno task build` to ensure it builds
6. Submit a pull request
