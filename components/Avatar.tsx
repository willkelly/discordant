/**
 * Avatar Component
 *
 * Displays user avatar with presence indicator.
 */

import type { PresenceShow } from '@types/xmpp.ts';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  presence?: PresenceShow;
  initials?: string;
}

export default function Avatar({
  src,
  alt = '',
  size = 'md',
  presence,
  initials = '',
}: AvatarProps) {
  const avatarClasses = [
    'avatar',
    `avatar-${size}`,
    presence ? 'has-presence' : '',
  ].filter(Boolean).join(' ');

  const presenceClasses = [
    'presence-indicator',
    presence ? `presence-${presence}` : '',
  ].filter(Boolean).join(' ');

  return (
    <div class={avatarClasses}>
      {src
        ? <img src={src} alt={alt} class='avatar-image' />
        : (
          <div class='avatar-initials'>
            {initials}
          </div>
        )}

      {presence && <div class={presenceClasses}></div>}
    </div>
  );
}
