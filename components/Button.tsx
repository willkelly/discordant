/**
 * Button Component
 *
 * Reusable button with variants and sizes.
 */

import { JSX } from 'preact';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element | JSX.Element[] | string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  children,
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      class={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
