/**
 * Input Component
 *
 * Reusable text input with label and error states.
 */

import { JSX } from 'preact';

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'url';
  value: string;
  onChange?: JSX.GenericEventHandler<HTMLInputElement>;
  onInput?: JSX.GenericEventHandler<HTMLInputElement>;
  onFocus?: JSX.FocusEventHandler<HTMLInputElement>;
  onBlur?: JSX.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
}

export default function Input({
  type = 'text',
  value,
  onChange,
  onInput,
  onFocus,
  onBlur,
  placeholder = '',
  label = '',
  error = '',
  disabled = false,
  required = false,
  fullWidth = false,
  id,
}: InputProps) {
  const inputId = id || `input-${crypto.randomUUID()}`;
  const wrapperClasses = ['input-wrapper', fullWidth ? 'full-width' : ''].filter(Boolean).join(
    ' ',
  );
  const inputClasses = ['input', error ? 'error' : ''].filter(Boolean).join(' ');

  return (
    <div class={wrapperClasses}>
      {label && (
        <label for={inputId} class='label'>
          {label}
          {required && <span class='required'>*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        class={inputClasses}
        onChange={onChange}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {error && <span class='error-message'>{error}</span>}
    </div>
  );
}
