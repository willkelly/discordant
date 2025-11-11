# Fresh v2 Migration Progress

## Overview

Migrating Discordant from **Svelte 4 + Vite** to **Fresh v2** (Deno's native web framework) to achieve 100% Deno ecosystem.

## Why Fresh?

- ✅ **100% Deno** - No npm/node_modules needed
- ✅ **No build step** - Instant dev server startup
- ✅ **Islands architecture** - Minimal JavaScript shipped to client
- ✅ **Preact-based** - Fast, lightweight (3KB)
- ✅ **File-based routing** - Convention over configuration

## Migration Status

### ✅ Completed

1. **Project Structure** - Created Fresh v2 file structure
   - `routes/` - File-based routing
   - `islands/` - Interactive Preact components
   - `components/` - Static components
   - `signals/` - Preact signals (replaces stores)
   - `static/` - CSS and assets
   - `fresh.config.ts`, `dev.ts`, `main.ts`

2. **Configuration** - Updated `deno.json`
   - JSX/Preact configuration
   - Fresh v2 dependencies from JSR
   - Task runners (start, build, preview)
   - Import maps for @preact/signals

3. **State Management** - Converted Svelte stores → Preact signals
   - `signals/connection.ts` - XMPP connection state
   - `signals/conversations.ts` - Chat messages
   - `signals/contacts.ts` - Contact roster
   - `signals/user.ts` - Current user
   - `signals/calls.ts` - Audio/video calls
   - `signals/ui.ts` - UI state (modals, toasts)

### 🚧 In Progress

4. **Component Migration** - Converting Svelte → Preact islands
   - Need to convert 9 Svelte components to Preact/JSX
   - Svelte `.svelte` files → Preact `.tsx` islands
   - `bind:value` → controlled components with signals
   - `on:event` → `onEvent` props
   - `{#if}` → `{condition && <Component />}`
   - `<slot />` → `{props.children}`

### ⏳ TODO

5. **Core Islands** - Create essential interactive components
   - `islands/LoginIsland.tsx` - Login form
   - `islands/ChatIsland.tsx` - Main chat interface
   - `islands/MessageListIsland.tsx` - Message display
   - `islands/MessageInputIsland.tsx` - Message composition

6. **Static Components** - Non-interactive UI components
   - `components/Button.tsx`
   - `components/Input.tsx`
   - `components/Avatar.tsx`
   - `components/Toast.tsx`

7. **XMPP Client** - Update for signals
   - Update `src/lib/xmpp/client.ts` to use Preact signals
   - Replace Svelte store `.set()` with signal `.value =`
   - Keep core XMPP logic (already pure TypeScript)

8. **Cleanup** - Remove old dependencies
   - Delete `src/App.svelte`, `src/main.ts` (old entry points)
   - Delete `src/components/**/*.svelte` files
   - Delete `src/stores/` directory
   - Delete `vite.config.ts`, `svelte.config.js`
   - Update `package.json` - remove Vite/Svelte deps
   - Update `.gitignore` - remove `dist/`, `.svelte-kit/`

9. **CI/CD** - Update GitHub Actions
   - Change `deno task dev` → `deno task start`
   - Change `deno task build` → `deno run -A main.ts build`
   - Remove `npm ci` steps (no longer needed!)

10. **Documentation** - Update all docs
    - Update `README.md` with Fresh instructions
    - Update `CLAUDE.md` with Fresh architecture
    - Delete `DENO_FIRST.md` (no longer needed - 100% Deno!)

## Key Differences: Svelte vs Fresh/Preact

| Feature | Svelte | Fresh/Preact |
|---------|--------|--------------|
| **Reactivity** | Compiler magic (`$:`) | Explicit signals |
| **State** | `writable()` stores | `signal()` |
| **Derived** | `derived()` stores | `computed()` |
| **Components** | `.svelte` files | `.tsx` islands |
| **Binding** | `bind:value={x}` | `value={x.value} onInput={(e) => x.value = e.target.value}` |
| **Events** | `on:click` | `onClick` |
| **Conditionals** | `{#if}...{/if}` | `{condition && <Component />}` |
| **Loops** | `{#each}...{/each}` | `{array.map(item => <Component />)}` |
| **Slots** | `<slot />` | `{props.children}` |
| **Styles** | Scoped `<style>` | Global CSS or inline styles |

## Migration Examples

### Store → Signal

**Before (Svelte store):**
```typescript
import { writable, derived } from 'svelte/store';

export const count = writable(0);
export const doubled = derived(count, $count => $count * 2);

// Usage in component
$count = 5;
console.log($doubled); // 10
```

**After (Preact signal):**
```typescript
import { signal, computed } from '@preact/signals';

export const count = signal(0);
export const doubled = computed(() => count.value * 2);

// Usage in component
count.value = 5;
console.log(doubled.value); // 10
```

### Component → Island

**Before (Svelte):**
```svelte
<script lang="ts">
  import { count } from '../stores/count';

  function increment() {
    $count += 1;
  }
</script>

<button on:click={increment}>
  Count: {$count}
</button>
```

**After (Preact):**
```tsx
import { count } from '../signals/count.ts';

export default function CounterIsland() {
  return (
    <button onClick={() => count.value += 1}>
      Count: {count.value}
    </button>
  );
}
```

## Benefits of Migration

1. **True 100% Deno** - No package.json needed (except Capacitor for mobile)
2. **No build step** - Instant server startup, no waiting for Vite
3. **Smaller bundles** - Only islands are hydrated, minimal JS
4. **Better performance** - Preact is 3KB, signals are fast
5. **Simplified CI/CD** - No npm ci, just `deno task start`

## Next Steps

1. Create core islands (Login, Chat, Messages)
2. Update XMPP client to use signals
3. Remove Vite/Svelte dependencies
4. Test and iterate
5. Update documentation

---

**Status**: 🚧 In progress - Core infrastructure complete, components being migrated
