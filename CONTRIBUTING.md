# Contributing to Discordant

Thank you for your interest in contributing to Discordant! This guide will help you get started.

## Prerequisites

- [Deno](https://deno.land/) 2.5 or later
- [Node.js](https://nodejs.org/) 20 or later (for Vite and npm dependencies)
- Git

## Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/discordant.git
   cd discordant
   ```

3. **Install dependencies:**
   ```bash
   npm install  # Install npm dependencies
   ```

4. **Run the development server:**
   ```bash
   deno task dev
   ```

## Development Workflow

### Before Making Changes

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

### Code Quality Standards

This project follows **strict Deno best practices**. Before committing, ensure all quality checks pass:

```bash
deno task quality
```

This runs:
- `deno fmt` - Code formatting
- `deno lint` - Linting
- `deno check` - Type checking
- `deno test` - Unit tests

### Deno Best Practices

1. **Explicit File Extensions**
   ```typescript
   // ✅ Correct
   import { foo } from './utils.ts';

   // ❌ Wrong
   import { foo } from './utils';
   ```

2. **Union Types Over Enums**
   ```typescript
   // ✅ Correct
   export type Status = 'pending' | 'success' | 'error';

   // ❌ Avoid
   export enum Status {
     PENDING = 'pending',
     SUCCESS = 'success',
     ERROR = 'error'
   }
   ```

3. **No `any` Types**
   ```typescript
   // ✅ Correct
   function process(data: string): number { ... }

   // ❌ Wrong
   function process(data: any): any { ... }
   ```

4. **Type-Only Exports**
   ```typescript
   // ✅ Correct - use 'export type' for type-only exports
   export type { MyType } from './types.ts';

   // ❌ Wrong - isolatedModules will fail
   export { MyType } from './types.ts';
   ```

### Running Tests

```bash
# Run all tests
deno task test

# Run tests in watch mode
deno task test:watch

# Generate coverage report
deno task coverage
```

### Code Formatting

Code is automatically formatted by `deno fmt`:

```bash
# Format code
deno task fmt

# Check formatting without modifying
deno task fmt:check
```

### Type Checking

```bash
deno task check
```

## Pull Request Process

1. **Ensure all quality checks pass:**
   ```bash
   deno task quality
   ```

2. **Write descriptive commit messages:**
   ```
   Add native WebSocket XMPP implementation

   - Replace Strophe.js with Web Standards WebSocket
   - Implement SASL PLAIN authentication
   - Add resource binding support
   ```

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** on GitHub

5. **Wait for CI checks to pass** - GitHub Actions will automatically run:
   - Quality checks (fmt, lint, check, test)
   - Build verification
   - Security audit (for main/master branch PRs)

6. **Address review feedback** if requested

## Project Structure

```
discordant/
├── src/
│   ├── lib/
│   │   ├── xmpp/          # Native XMPP implementation
│   │   ├── media/         # WebRTC services
│   │   └── storage/       # File handling
│   ├── types/             # TypeScript types (union types, not enums!)
│   ├── stores/            # Svelte stores
│   ├── components/        # Svelte components
│   ├── utils/             # Utility functions
│   └── styles/            # Global styles
├── tests/                 # Unit tests
├── e2e/                   # End-to-end tests
└── .github/               # GitHub Actions workflows
```

## Writing Tests

Tests use Deno's built-in test framework:

```typescript
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.test('feature - does something', () => {
  const result = myFunction('input');
  assertEquals(result, 'expected');
});
```

Test files must:
- End with `_test.ts`
- Be in the `tests/` directory
- Have comprehensive coverage for new features

## Documentation

When adding new features:

1. **Update the README** if it's a user-facing feature
2. **Add JSDoc comments** to all exported functions/types
3. **Update DEVELOPMENT.md** if it affects the development workflow

Example JSDoc:

```typescript
/**
 * Parse a JID string into its component parts
 *
 * @param jidString - The JID string to parse (e.g., "user@domain.com/resource")
 * @returns Parsed JID components
 * @throws {Error} If the JID format is invalid
 */
export function parseJID(jidString: string): JID {
  // ...
}
```

## Reporting Issues

When reporting issues, please include:

1. **Deno version:** `deno --version`
2. **Operating system**
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Error messages** (if any)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive community

## Questions?

- Open a [GitHub Issue](https://github.com/willkelly/discordant/issues)
- Check existing issues and discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Discordant! 🎉
