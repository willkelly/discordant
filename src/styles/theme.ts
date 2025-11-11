/**
 * Theme Configuration
 *
 * Earth-tone theme with #956a28 as the primary accent color.
 * Focused on readability and modern aesthetics.
 */

import type { Theme } from '@types/ui';

export const defaultTheme: Theme = {
  name: 'Earth Tones',
  colors: {
    // Primary accent color - warm copper brown
    primary: '#956a28',
    primaryHover: '#a87a35',
    primaryActive: '#7d5820',

    // Secondary - warm brown
    secondary: '#8B7355',

    // Background colors - layered earth tones
    background: {
      primary: '#FAF7F2', // Off-white, easy on the eyes
      secondary: '#F5E6D3', // Cream
      tertiary: '#E8D5C4', // Light tan
      elevated: '#FFFFFF', // Pure white for cards/elevated surfaces
    },

    // Text colors - high contrast for readability
    text: {
      primary: '#2A2419', // Very dark brown, almost black
      secondary: '#4A3C2E', // Dark brown
      tertiary: '#6B5D4F', // Medium brown
      inverse: '#FAF7F2', // Off-white for dark backgrounds
      link: '#956a28', // Primary accent
    },

    // Border colors - subtle earth tones
    border: {
      primary: '#D4C4B0', // Light brown border
      secondary: '#E8DDD0', // Very light brown
      focus: '#956a28', // Primary accent for focus states
    },

    // Status colors - adapted to earth tone palette
    status: {
      success: '#6B8E4E', // Earthy green
      warning: '#C98528', // Warm orange
      error: '#B85C50', // Terracotta red
      info: '#5B7C99', // Muted blue
    },

    // Presence indicators
    presence: {
      online: '#6B8E4E', // Green
      away: '#C98528', // Orange
      busy: '#B85C50', // Red
      offline: '#8B7D6B', // Gray-brown
    },
  },

  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyHeading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyMono: '"Fira Code", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },

    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',  // Fully rounded
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(74, 60, 46, 0.05)',
    md: '0 4px 6px -1px rgba(74, 60, 46, 0.1), 0 2px 4px -1px rgba(74, 60, 46, 0.06)',
    lg: '0 10px 15px -3px rgba(74, 60, 46, 0.1), 0 4px 6px -2px rgba(74, 60, 46, 0.05)',
    xl: '0 20px 25px -5px rgba(74, 60, 46, 0.1), 0 10px 10px -5px rgba(74, 60, 46, 0.04)',
  },
};

/**
 * Generates CSS custom properties from theme
 */
export function generateCSSVariables(theme: Theme): string {
  return `
    /* Colors */
    --color-primary: ${theme.colors.primary};
    --color-primary-hover: ${theme.colors.primaryHover};
    --color-primary-active: ${theme.colors.primaryActive};
    --color-secondary: ${theme.colors.secondary};

    --color-bg-primary: ${theme.colors.background.primary};
    --color-bg-secondary: ${theme.colors.background.secondary};
    --color-bg-tertiary: ${theme.colors.background.tertiary};
    --color-bg-elevated: ${theme.colors.background.elevated};

    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-text-tertiary: ${theme.colors.text.tertiary};
    --color-text-inverse: ${theme.colors.text.inverse};
    --color-text-link: ${theme.colors.text.link};

    --color-border-primary: ${theme.colors.border.primary};
    --color-border-secondary: ${theme.colors.border.secondary};
    --color-border-focus: ${theme.colors.border.focus};

    --color-status-success: ${theme.colors.status.success};
    --color-status-warning: ${theme.colors.status.warning};
    --color-status-error: ${theme.colors.status.error};
    --color-status-info: ${theme.colors.status.info};

    --color-presence-online: ${theme.colors.presence.online};
    --color-presence-away: ${theme.colors.presence.away};
    --color-presence-busy: ${theme.colors.presence.busy};
    --color-presence-offline: ${theme.colors.presence.offline};

    /* Typography */
    --font-family: ${theme.typography.fontFamily};
    --font-family-heading: ${theme.typography.fontFamilyHeading};
    --font-family-mono: ${theme.typography.fontFamilyMono};

    --font-size-xs: ${theme.typography.fontSize.xs};
    --font-size-sm: ${theme.typography.fontSize.sm};
    --font-size-base: ${theme.typography.fontSize.base};
    --font-size-lg: ${theme.typography.fontSize.lg};
    --font-size-xl: ${theme.typography.fontSize.xl};
    --font-size-2xl: ${theme.typography.fontSize['2xl']};
    --font-size-3xl: ${theme.typography.fontSize['3xl']};

    --font-weight-normal: ${theme.typography.fontWeight.normal};
    --font-weight-medium: ${theme.typography.fontWeight.medium};
    --font-weight-semibold: ${theme.typography.fontWeight.semibold};
    --font-weight-bold: ${theme.typography.fontWeight.bold};

    --line-height-tight: ${theme.typography.lineHeight.tight};
    --line-height-normal: ${theme.typography.lineHeight.normal};
    --line-height-relaxed: ${theme.typography.lineHeight.relaxed};

    /* Spacing */
    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    --spacing-2xl: ${theme.spacing['2xl']};
    --spacing-3xl: ${theme.spacing['3xl']};

    /* Border Radius */
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
    --radius-full: ${theme.borderRadius.full};

    /* Shadows */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};
  `;
}
