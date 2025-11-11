# Component Migration Plan: Svelte → Fresh/Preact

## Architecture Decision: Islands vs Components

**Critical concept**: Fresh uses Islands Architecture

- **Islands** = Interactive components with client-side JS (hydrated on client)
- **Components** = Static, server-rendered only (no client JS)
- **Goal**: Minimize islands, maximize static components for performance

## Component Analysis & Classification

### Static Components (3) - No hydration needed

These are pure display components with no state:

1. **Button** (`components/Button.tsx`)
   - Pure presentation component
   - Props: variant, size, disabled, onClick, children
   - No state management needed

2. **Input** (`components/Input.tsx`)
   - Controlled input, but parent manages state
   - Props: label, type, value, onChange, error, disabled
   - No internal state

3. **Avatar** (`components/Avatar.tsx`)
   - Pure display of user image/initials
   - Props: src, alt, size, status
   - Completely static

### Islands (6) - Need hydration for interactivity

4. **ToastIsland** (`islands/ToastIsland.tsx`)
   - Reads: `toasts` signal
   - Auto-updates when toasts change
   - Renders in `_app.tsx` (global)

5. **LoginIsland** (`islands/LoginIsland.tsx`)
   - Local state: serverUrl, jid, password, errors, isLoading
   - Uses `useSignal()` for form state
   - Dispatches login event to parent via prop callback

6. **ConversationListIsland** (`islands/ConversationListIsland.tsx`)
   - Reads: `sortedConversations`, `activeConversationId` signals
   - Interactive: clicking conversations
   - Updates `activeConversationId` signal

7. **MessageListIsland** (`islands/MessageListIsland.tsx`)
   - Reads: `activeMessages` signal
   - Auto-scrolls to bottom on new messages
   - Displays message history

8. **MessageInputIsland** (`islands/MessageInputIsland.tsx`)
   - Local state: message text, file attachments
   - Calls parent's `onSendMessage` callback
   - Handles Enter key, file uploads

9. **ChatViewIsland** (`islands/ChatViewIsland.tsx`)
   - Container for MessageList + MessageInput
   - Orchestrates communication between them
   - Reads: `activeConversation` signal

## Conversion Rules: Svelte → Preact

### 1. File Structure

```svelte
<!-- Svelte -->
<script lang="ts">
  export let name: string;
  let count = 0;
</script>

<button on:click={() => count++}>
  {name}: {count}
</button>

<style>
  button { color: blue; }
</style>
```

```tsx
// Preact
import { useSignal } from '@preact/signals';

interface Props {
  name: string;
}

export default function Counter({ name }: Props) {
  const count = useSignal(0);

  return (
    <button onClick={() => count.value++} class='btn'>
      {name}: {count.value}
    </button>
  );
}
```

### 2. Props

- **Svelte**: `export let propName: Type;`
- **Preact**: Function parameter with interface

### 3. State Management

| Svelte                        | Preact                                            |
| ----------------------------- | ------------------------------------------------- |
| `let x = 0` (reactive)        | `const x = useSignal(0)`                          |
| `$storeName` (auto-subscribe) | `signalName.value`                                |
| `$: doubled = count * 2`      | `const doubled = computed(() => count.value * 2)` |
| `store.set(value)`            | `signal.value = value`                            |
| `store.update(fn)`            | `signal.value = fn(signal.value)`                 |

### 4. Event Handling

- **Svelte**: `on:click={handler}`
- **Preact**: `onClick={handler}`
- **Svelte**: `on:input={(e) => value = e.target.value}`
- **Preact**: `onInput={(e) => value.value = e.currentTarget.value}`

### 5. Conditionals

- **Svelte**: `{#if condition}...{:else}...{/if}`
- **Preact**: `{condition ? <div>...</div> : <div>...</div>}`
- **Preact**: `{condition && <div>...</div>}` (no else)

### 6. Loops

- **Svelte**: `{#each items as item, i}...{/each}`
- **Preact**: `{items.map((item, i) => <div key={item.id}>...</div>)}`

### 7. Slots/Children

- **Svelte**: `<slot />`
- **Preact**: `{props.children}`

### 8. Binding

- **Svelte**: `<input bind:value={text} />`
- **Preact**: `<input value={text.value} onInput={(e) => text.value = e.currentTarget.value} />`

### 9. Event Dispatching

- **Svelte**: `const dispatch = createEventDispatcher(); dispatch('login', data);`
- **Preact**: Pass callback prop: `props.onLogin?.(data)`

### 10. Styles

- **Svelte**: Scoped `<style>` tags
- **Fresh**: Global CSS in `static/styles/` or inline styles
- **Strategy**: Use BEM-style class names for uniqueness

## Migration Execution Order

### Phase 1: Foundation (Static Components)

✅ Already done:

- Fresh structure created
- Signals created
- deno.json configured

🔨 Now:

1. Create `components/Button.tsx`
2. Create `components/Input.tsx`
3. Create `components/Avatar.tsx`

### Phase 2: Simple Island (Toast)

4. Create `islands/ToastIsland.tsx`
5. Add to `routes/_app.tsx`
6. Test signal reactivity

### Phase 3: Form Island (Login)

7. Create `islands/LoginIsland.tsx`
8. Test form handling and validation
9. Update `routes/index.tsx` to use LoginIsland

### Phase 4: Chat Islands

10. Create `islands/ConversationListIsland.tsx`
11. Create `islands/MessageListIsland.tsx`
12. Create `islands/MessageInputIsland.tsx`
13. Create `islands/ChatViewIsland.tsx`

### Phase 5: Integration

14. Update `routes/index.tsx` with full app logic
15. Update `src/lib/xmpp/client.ts` to use signals
16. Generate `fresh.gen.ts` manifest
17. Test basic flow: login → see conversations → send message

### Phase 6: Cleanup

18. Remove old Svelte files (`src/components/**/*.svelte`, `src/App.svelte`)
19. Remove `src/stores/` directory
20. Remove Svelte/Vite config files
21. Update `package.json` (remove Vite, Svelte, @sveltejs/*)
22. Update `.gitignore`

### Phase 7: CI/CD & Docs

23. Update GitHub Actions workflows
24. Update README.md
25. Update CLAUDE.md
26. Delete DENO_FIRST.md (no longer needed!)

### Phase 8: Testing

27. Run unit tests (`deno task test`)
28. Run integration tests with XMPP server
29. Manual testing of full flow

## Critical XMPP Client Changes

File: `src/lib/xmpp/client.ts`

**Find/Replace operations:**

```typescript
// Import changes
- import { writable } from 'svelte/store';
+ // Remove import (signals imported globally)

// Store access changes
- connectionState.set('connecting')
+ connectionState.value = 'connecting'

- conversations.update(map => { map.set(id, conv); return map; })
+ conversations.value = new Map(conversations.value).set(id, conv)

// Reading stores
- get(conversations)
+ conversations.value
```

## Styles Strategy

All component styles will be in `static/styles/components/`:

- `static/styles/components/button.css`
- `static/styles/components/input.css`
- `static/styles/components/avatar.css`
- `static/styles/components/toast.css`
- `static/styles/components/chat.css`

Import in `static/styles/global.css`:

```css
@import './components/button.css';
@import './components/input.css';
/* etc */
```

## Testing Checkpoints

After each phase, verify:

1. **Phase 1**: Components render correctly
2. **Phase 2**: Toast shows/hides on signal change
3. **Phase 3**: Can submit login form
4. **Phase 4**: All chat components render
5. **Phase 5**: Full login → chat flow works
6. **Phase 6**: No Svelte references remain
7. **Phase 7**: CI/CD passes
8. **Phase 8**: All tests green

## Success Criteria

✅ App loads and shows login screen
✅ Can log in (stores XMPP connection)
✅ Conversations load and display
✅ Can send messages
✅ Toasts work
✅ No Vite/Svelte dependencies
✅ `deno task start` works
✅ `deno task build` works
✅ All tests pass
✅ CI/CD green

## Rollback Plan

If migration fails:

1. Revert to commit before `fe33e34`
2. Keep FRESH_MIGRATION.md for future attempt
3. Consider hybrid approach (Fresh + keeping some Svelte)

---

**Ready to execute**: Starting with Phase 1 (Static Components)
