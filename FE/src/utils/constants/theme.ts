// Theme Constants - Following 60-30-10 Design Rule
// Based on Figma color palette: 2D1E1A, DA7339, EFE6DB, EBD187, 78A243

export const COLORS = {
  // Primary Colors (from Figma)
  darkBrown: '#2D1E1A',      // Dark brown/black
  orange: '#DA7339',         // Primary orange
  cream: '#EFE6DB',          // Light cream/beige
  gold: '#EBD187',           // Light gold/yellow
  green: '#78A243',          // Green

  // 60-30-10 Application
  base: '#EFE6DB',           // 60% - Main backgrounds, cards
  dominant: '#2D1E1A',       // 30% - Text, headers, borders
  accent: '#DA7339',         // 10% - CTAs, buttons, key highlights

  // Semantic Colors
  success: '#78A243',        // Green for success states
  warning: '#EBD187',        // Gold for warnings
  danger: '#DC2626',         // Red for errors/danger
  info: '#3B82F6',           // Blue for info

  // Neutral Palette (derived from base colors)
  neutral: {
    50: '#FAF8F6',           // Lightest
    100: '#EFE6DB',          // Base cream
    200: '#E5D5C5',
    300: '#D4BFA9',
    400: '#C3A98D',
    500: '#A98B6F',
    600: '#8B6F56',
    700: '#6D553E',
    800: '#4D3C2B',          // Darker brown
    900: '#2D1E1A',          // Darkest
  },

  // Orange Palette
  orange_palette: {
    50: '#FEF5ED',
    100: '#FCE8D6',
    200: '#F9D1AD',
    300: '#F5BA84',
    400: '#EF9858',
    500: '#DA7339',          // Main orange
    600: '#C55E27',
    700: '#A44A1D',
    800: '#7D3715',
    900: '#5C280F',
  },

  // Green Palette
  green_palette: {
    50: '#F5F9F0',
    100: '#E8F2DC',
    200: '#D1E5B9',
    300: '#B4D68F',
    400: '#96C565',
    500: '#78A243',          // Main green
    600: '#638835',
    700: '#4E6D29',
    800: '#3A521E',
    900: '#283814',
  },
} as const;

// Component-specific color mappings
export const COMPONENT_COLORS = {
  // Backgrounds
  background: {
    primary: COLORS.cream,              // Main page background
    secondary: COLORS.neutral[50],      // Secondary sections
    card: '#FFFFFF',                    // Card backgrounds
    hover: COLORS.neutral[100],         // Hover states
    elevated: '#FFFFFF',                // Elevated surfaces (modals, dropdowns)
  },

  // Text
  text: {
    primary: COLORS.darkBrown,          // Main text
    secondary: COLORS.neutral[700],     // Secondary text
    tertiary: COLORS.neutral[600],      // Tertiary text
    disabled: COLORS.neutral[400],      // Disabled text
    inverse: '#FFFFFF',                 // Text on dark backgrounds
    link: COLORS.orange,                // Links
  },

  // Borders
  border: {
    primary: COLORS.neutral[300],       // Main borders
    secondary: COLORS.neutral[200],     // Subtle borders
    accent: COLORS.orange,              // Accent borders
    focus: COLORS.orange_palette[400],  // Focus states
  },

  // Buttons
  button: {
    primary: {
      bg: COLORS.orange,
      hover: COLORS.orange_palette[600],
      active: COLORS.orange_palette[700],
      text: '#FFFFFF',
    },
    secondary: {
      bg: COLORS.neutral[200],
      hover: COLORS.neutral[300],
      active: COLORS.neutral[400],
      text: COLORS.darkBrown,
    },
    success: {
      bg: COLORS.green,
      hover: COLORS.green_palette[600],
      active: COLORS.green_palette[700],
      text: '#FFFFFF',
    },
    danger: {
      bg: COLORS.danger,
      hover: '#B91C1C',
      active: '#991B1B',
      text: '#FFFFFF',
    },
    ghost: {
      bg: 'transparent',
      hover: COLORS.neutral[100],
      active: COLORS.neutral[200],
      text: COLORS.darkBrown,
    },
  },

  // Status & Badges
  status: {
    active: {
      bg: COLORS.green_palette[100],
      text: COLORS.green_palette[800],
      border: COLORS.green_palette[300],
    },
    inactive: {
      bg: COLORS.neutral[100],
      text: COLORS.neutral[700],
      border: COLORS.neutral[300],
    },
    banned: {
      bg: '#FEE2E2',
      text: '#991B1B',
      border: '#FCA5A5',
    },
    verified: {
      bg: COLORS.green_palette[50],
      text: COLORS.green_palette[700],
      border: COLORS.green_palette[200],
    },
    pending: {
      bg: '#FEF3C7',
      text: '#92400E',
      border: '#FCD34D',
    },
  },

  // Role badges
  role: {
    ADMIN: {
      bg: '#FEE2E2',
      text: '#991B1B',
      border: '#FCA5A5',
    },
    MANAGER: {
      bg: '#DBEAFE',
      text: '#1E40AF',
      border: '#93C5FD',
    },
    CHEF: {
      bg: COLORS.orange_palette[100],
      text: COLORS.orange_palette[800],
      border: COLORS.orange_palette[300],
    },
    WAITER: {
      bg: COLORS.green_palette[100],
      text: COLORS.green_palette[800],
      border: COLORS.green_palette[300],
    },
    SHIPPER: {
      bg: '#E9D5FF',
      text: '#6B21A8',
      border: '#C084FC',
    },
    CUSTOMER: {
      bg: COLORS.neutral[100],
      text: COLORS.neutral[800],
      border: COLORS.neutral[300],
    },
  },

  // Stats cards
  stats: {
    total: {
      bg: `linear-gradient(135deg, ${COLORS.orange_palette[50]} 0%, #FFFFFF 100%)`,
      border: COLORS.orange_palette[200],
      icon: COLORS.orange,
    },
    active: {
      bg: `linear-gradient(135deg, ${COLORS.green_palette[50]} 0%, #FFFFFF 100%)`,
      border: COLORS.green_palette[200],
      icon: COLORS.green,
    },
    verified: {
      bg: `linear-gradient(135deg, ${COLORS.neutral[50]} 0%, #FFFFFF 100%)`,
      border: COLORS.neutral[200],
      icon: COLORS.neutral[600],
    },
    warning: {
      bg: `linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 100%)`,
      border: '#FDE68A',
      icon: '#D97706',
    },
  },

  // Tables
  table: {
    header: COLORS.neutral[50],
    row: '#FFFFFF',
    rowHover: COLORS.cream,
    rowSelected: COLORS.orange_palette[50],
    border: COLORS.neutral[200],
  },

  // Forms
  form: {
    input: {
      bg: '#FFFFFF',
      border: COLORS.neutral[300],
      focus: COLORS.orange,
      error: COLORS.danger,
      disabled: COLORS.neutral[100],
    },
    label: COLORS.darkBrown,
    helper: COLORS.neutral[600],
    error: COLORS.danger,
  },
} as const;

// Gradients
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.orange_palette[600]} 100%)`,
  secondary: `linear-gradient(135deg, ${COLORS.neutral[200]} 0%, ${COLORS.neutral[300]} 100%)`,
  success: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.green_palette[600]} 100%)`,
  hero: `linear-gradient(135deg, ${COLORS.cream} 0%, ${COLORS.neutral[50]} 100%)`,
  card: `linear-gradient(135deg, #FFFFFF 0%, ${COLORS.cream} 100%)`,
  statsOrange: `linear-gradient(135deg, ${COLORS.orange_palette[50]} 0%, #FFFFFF 100%)`,
  statsGreen: `linear-gradient(135deg, ${COLORS.green_palette[50]} 0%, #FFFFFF 100%)`,
} as const;

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(45, 30, 26, 0.05)',
  md: '0 4px 6px -1px rgba(45, 30, 26, 0.1), 0 2px 4px -1px rgba(45, 30, 26, 0.06)',
  lg: '0 10px 15px -3px rgba(45, 30, 26, 0.1), 0 4px 6px -2px rgba(45, 30, 26, 0.05)',
  xl: '0 20px 25px -5px rgba(45, 30, 26, 0.1), 0 10px 10px -5px rgba(45, 30, 26, 0.04)',
  '2xl': '0 25px 50px -12px rgba(45, 30, 26, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(45, 30, 26, 0.06)',
  none: 'none',
} as const;

// Spacing (using Tailwind's spacing scale)
export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

// Border Radius
export const RADIUS = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Fully rounded
} as const;

// Transitions
export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Z-index scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
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
} as const;

export default {
  COLORS,
  COMPONENT_COLORS,
  GRADIENTS,
  SHADOWS,
  SPACING,
  RADIUS,
  TRANSITIONS,
  Z_INDEX,
  TYPOGRAPHY,
};
