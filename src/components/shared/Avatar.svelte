<script lang="ts">
  /**
   * Avatar Component
   *
   * Displays user avatar with presence indicator.
   */

  import type { PresenceShow } from '@types/xmpp';

  export let src: string | undefined = undefined;
  export let alt = '';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let presence: PresenceShow | undefined = undefined;
  export let initials = '';
</script>

<div class="avatar avatar-{size}" class:has-presence={presence}>
  {#if src}
    <img {src} {alt} class="avatar-image" />
  {:else}
    <div class="avatar-initials">
      {initials}
    </div>
  {/if}

  {#if presence}
    <div class="presence-indicator presence-{presence}"></div>
  {/if}
</div>

<style>
  .avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg-tertiary);
    border-radius: var(--radius-full);
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar-sm {
    width: 2rem;
    height: 2rem;
  }

  .avatar-md {
    width: 2.5rem;
    height: 2.5rem;
  }

  .avatar-lg {
    width: 3rem;
    height: 3rem;
  }

  .avatar-xl {
    width: 4rem;
    height: 4rem;
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-initials {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    text-transform: uppercase;
  }

  .avatar-sm .avatar-initials {
    font-size: var(--font-size-xs);
  }

  .avatar-lg .avatar-initials,
  .avatar-xl .avatar-initials {
    font-size: var(--font-size-base);
  }

  .presence-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-bg-elevated);
  }

  .avatar-lg .presence-indicator,
  .avatar-xl .presence-indicator {
    width: 1rem;
    height: 1rem;
  }

  .presence-chat {
    background-color: var(--color-presence-online);
  }

  .presence-away,
  .presence-xa {
    background-color: var(--color-presence-away);
  }

  .presence-dnd {
    background-color: var(--color-presence-busy);
  }
</style>
