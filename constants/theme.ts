/**
 * Meltic Healthcare Design System
 *
 * Single source of truth for all design tokens including colors, typography,
 * spacing, and component styles. This ensures consistency across the entire
 * application and makes theming/branding updates easy.
 *
 * Usage:
 * import { theme } from '@/constants/theme';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.primary.main,
 *     padding: theme.spacing.lg,
 *   }
 * });
 */

import { TextStyle, ViewStyle } from 'react-native';

// ============================================================================
// COLORS
// ============================================================================

const colors = {
  // Primary Brand Colors (based on existing #0060AA)
  primary: {
    main: '#0060AA',        // Primary brand blue - headers, primary buttons, links
    light: '#F5FAFD',       // Light background for cards and sections
    lighter: '#C4E0F5',     // Borders and subtle accents
    dark: '#002948',        // Hover/pressed states for primary elements
    contrast: '#FFFFFF',    // Text color on primary backgrounds
  },

  // Semantic Colors
  semantic: {
    success: '#28A745',              // Success states, confirmations
    successBackground: '#D4EDDA',    // Success backgrounds
    successLight: '#D4EDDA',         // Alias for backward compatibility
    error: '#FF4C4C',                // Error states, destructive actions
    errorBackground: '#F8D7DA',      // Error backgrounds
    errorLight: '#F8D7DA',           // Alias for backward compatibility
    warning: '#FFC107',              // Warning states
    warningBackground: '#FFF3CD',    // Warning backgrounds
    warningLight: '#FFF3CD',         // Alias for backward compatibility
    info: '#17A2B8',                 // Informational messages
    infoBackground: '#D1ECF1',       // Info backgrounds
    infoLight: '#D1ECF1',            // Alias for backward compatibility
  },

  // Neutral Palette (Grays)
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9F9F9',       // Lightest gray - alternate backgrounds
    gray100: '#F2F2F2',      // Very light gray - disabled backgrounds
    gray200: '#E0E0E0',      // Light gray - borders
    gray300: '#CCCCCC',      // Medium-light gray - dividers
    gray400: '#AAAAAA',      // Medium gray
    gray500: '#999999',      // True middle gray
    gray600: '#777777',      // Medium-dark gray
    gray700: '#555555',      // Dark gray - secondary text
    gray800: '#333333',      // Very dark gray
    gray900: '#1A1A1A',      // Almost black - primary text
    black: '#000000',
  },

  // Text Colors (semantic mapping)
  text: {
    primary: '#1A1A1A',      // Main text color
    secondary: '#555555',    // Secondary text, labels
    tertiary: '#999999',     // Disabled text, placeholders
    inverse: '#FFFFFF',      // Text on dark backgrounds
    link: '#0060AA',         // Links
    success: '#28A745',      // Success messages
    error: '#FF4C4C',        // Error messages
    warning: '#FFC107',      // Warning messages
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',      // Main app background
    secondary: '#F9F9F9',    // Alternate sections
    tertiary: '#F2F2F2',     // Card backgrounds
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

const typography = {
  // Display / Headings
  h1: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 28,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Body Text
  body: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22,
    letterSpacing: 0,
  },

  // Smaller Text
  small: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0,
  },
  smallBold: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Caption / Labels
  caption: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
    letterSpacing: 0,
  },
  captionBold: {
    fontSize: 13,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Tiny (badges, labels)
  tiny: {
    fontSize: 10,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 14,
    letterSpacing: 0,
  },
  tinyBold: {
    fontSize: 10,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 14,
    letterSpacing: 0,
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

const spacing = {
  none: 0,
  xs: 4,      // Extra small - tight spacing
  sm: 8,      // Small - compact spacing
  md: 12,     // Medium - default spacing
  lg: 16,     // Large - comfortable spacing
  xl: 20,     // Extra large - generous spacing
  xxl: 24,    // 2X large - section spacing
  xxxl: 32,   // 3X large - major section breaks
  huge: 40,   // Huge - special use cases
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

const borderRadius = {
  none: 0,
  sm: 6,      // Small - subtle rounding
  md: 10,     // Medium - cards, buttons
  lg: 12,     // Large - prominent cards
  xl: 16,     // Extra large - modal corners
  xxl: 24,    // Very round corners
  round: 999, // Fully rounded (pills, avatars)
} as const;

// ============================================================================
// SHADOWS / ELEVATION
// ============================================================================

const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Android
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // Android
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8, // Android
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12, // Android
  },
} as const;

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================

const layout = {
  screenPadding: 16,          // Standard screen edge padding
  cardMargin: 12,             // Space between cards
  headerHeight: 60,           // Standard header height
  bottomTabHeight: 60,        // Bottom tab bar height
  minTouchTarget: 44,         // Minimum touch target (iOS HIG)
  maxContentWidth: 600,       // Max width for readable content
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
} as const;

// ============================================================================
// COMPONENT STYLES
// ============================================================================

const components = {
  // Button Variants
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.main,
      borderWidth: 0,
      minHeight: layout.minTouchTarget,
      padding: 15,
      borderRadius: borderRadius.md,
      ...shadows.sm,
    } as ViewStyle,

    secondary: {
      backgroundColor: colors.neutral.white,
      borderColor: colors.primary.main,
      borderWidth: 2,
      minHeight: layout.minTouchTarget,
      padding: 15,
      borderRadius: borderRadius.md,
    } as ViewStyle,

    success: {
      backgroundColor: colors.semantic.success,
      borderColor: colors.semantic.success,
      borderWidth: 0,
      minHeight: layout.minTouchTarget,
      padding: 15,
      borderRadius: borderRadius.md,
      ...shadows.sm,
    } as ViewStyle,

    danger: {
      backgroundColor: colors.semantic.error,
      borderColor: colors.semantic.error,
      borderWidth: 0,
      minHeight: layout.minTouchTarget,
      padding: 15,
      borderRadius: borderRadius.md,
      ...shadows.sm,
    } as ViewStyle,

    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.neutral.gray300,
      borderWidth: 1,
      minHeight: layout.minTouchTarget,
      padding: 15,
      borderRadius: borderRadius.md,
    } as ViewStyle,

    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      minHeight: layout.minTouchTarget,
      paddingVertical: 8,
      paddingHorizontal: 12,
    } as ViewStyle,
  },

  // Card Variants
  card: {
    default: {
      backgroundColor: colors.neutral.white,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.md,
    } as ViewStyle,

    elevated: {
      backgroundColor: colors.neutral.white,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.md,
    } as ViewStyle,

    bordered: {
      backgroundColor: colors.neutral.white,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.neutral.gray200,
      padding: spacing.lg,
      marginBottom: spacing.md,
    } as ViewStyle,

    light: {
      backgroundColor: colors.primary.light,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.primary.lighter,
      padding: spacing.lg,
      marginBottom: spacing.md,
    } as ViewStyle,
  },

  // Input/Form Styles
  input: {
    default: {
      backgroundColor: colors.neutral.white,
      borderWidth: 1,
      borderColor: colors.neutral.gray300,
      borderRadius: borderRadius.sm,
      paddingVertical: 13,
      paddingHorizontal: 15,
      minHeight: layout.minTouchTarget,
      fontSize: typography.body.fontSize,
      color: colors.text.primary,
    } as TextStyle & ViewStyle,

    focused: {
      borderColor: colors.primary.main,
      borderWidth: 1,
    } as ViewStyle,

    error: {
      borderColor: colors.semantic.error,
      borderWidth: 2,
    } as ViewStyle,

    disabled: {
      backgroundColor: colors.neutral.gray100,
      borderColor: colors.neutral.gray200,
      color: colors.text.tertiary,
    } as TextStyle & ViewStyle,
  },

  // Badge/Pill Styles
  badge: {
    default: {
      backgroundColor: colors.semantic.error,
      borderRadius: borderRadius.round,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    } as ViewStyle,

    primary: {
      backgroundColor: colors.primary.main,
      borderRadius: borderRadius.round,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    } as ViewStyle,

    success: {
      backgroundColor: colors.semantic.success,
      borderRadius: borderRadius.round,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    } as ViewStyle,
  },

  // Modal Styles
  modal: {
    overlay: {
      flex: 1,
      backgroundColor: colors.background.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,

    container: {
      backgroundColor: colors.neutral.white,
      borderRadius: borderRadius.xl,
      padding: spacing.xxl,
      minWidth: 300,
      maxWidth: 400,
      ...shadows.xl,
    } as ViewStyle,

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    } as ViewStyle,
  },

  // Shimmer/Loading Styles
  shimmer: {
    container: {
      backgroundColor: colors.neutral.gray100,
      borderRadius: borderRadius.sm,
      overflow: 'hidden',
    } as ViewStyle,

    effect: {
      backgroundColor: colors.neutral.gray200,
      opacity: 0.6,
    } as ViewStyle,
  },
} as const;

// ============================================================================
// ACCESSIBILITY
// ============================================================================

const accessibility = {
  minTouchTarget: 44,        // iOS Human Interface Guidelines
  minContrastRatio: 4.5,     // WCAG AA for normal text
  minContrastRatioLarge: 3.0,// WCAG AA for large text (18pt+)
  reducedMotion: false,      // Can be toggled based on user preference
  focusIndicatorWidth: 2,    // Focus outline width
  focusIndicatorColor: colors.primary.main,
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  components,
  accessibility,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a consistent spacing value
 * @example getSpacing('md', 'lg') => 28 (12 + 16)
 */
export const getSpacing = (...keys: (keyof typeof spacing)[]): number => {
  return keys.reduce((acc, key) => acc + spacing[key], 0);
};

/**
 * Create a consistent opacity for colors
 * @example withOpacity(theme.colors.primary.main, 0.5) => 'rgba(0, 96, 170, 0.5)'
 */
export const withOpacity = (hexColor: string, opacity: number): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get touch target padding to ensure minimum size
 * @example getTouchTargetPadding(30) => 7 (to reach 44px total)
 */
export const getTouchTargetPadding = (currentSize: number): number => {
  const minSize = accessibility.minTouchTarget;
  return currentSize < minSize ? (minSize - currentSize) / 2 : 0;
};

/**
 * Check if color contrast meets WCAG standards
 * Simplified version - for production use a proper contrast checker
 */
export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  large: boolean = false
): boolean => {
  // This is a placeholder - implement proper contrast calculation for production
  const required = large ? accessibility.minContrastRatioLarge : accessibility.minContrastRatio;
  return true; // TODO: Implement actual contrast calculation
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default theme;
