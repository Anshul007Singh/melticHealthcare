import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  /** Button text */
  children: string;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Show loading indicator */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

/**
 * Button Component
 *
 * A fully accessible, themeable button component with multiple variants.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onPress={() => console.log('Pressed')}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  ...touchableProps
}) => {
  // Determine container styles
  const containerStyle = [
    styles.base,
    styles[`${variant}Container`],
    styles[`${size}Container`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabledContainer,
    style,
  ];

  // Determine text styles
  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  // Loading indicator color based on variant
  const getIndicatorColor = (): string => {
    if (variant === 'secondary' || variant === 'outline') {
      return theme.colors.primary.main;
    }
    return theme.colors.text.inverse;
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...touchableProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIndicatorColor()} />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base styles
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.components.button.primary,
  },
  baseText: {
    ...theme.typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Variant container styles
  primaryContainer: {
    ...theme.components.button.primary,
  },
  secondaryContainer: {
    ...theme.components.button.secondary,
  },
  successContainer: {
    ...theme.components.button.success,
  },
  dangerContainer: {
    ...theme.components.button.danger,
  },
  outlineContainer: {
    ...theme.components.button.outline,
  },
  textContainer: {
    ...theme.components.button.text,
  },

  // Variant text styles
  primaryText: {
    color: theme.colors.primary.contrast,
  },
  secondaryText: {
    color: theme.colors.primary.main,
  },
  successText: {
    color: theme.colors.text.inverse,
  },
  dangerText: {
    color: theme.colors.text.inverse,
  },
  outlineText: {
    color: theme.colors.text.primary,
  },
  textText: {
    color: theme.colors.primary.main,
  },

  // Size variants
  smallContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,  // Updated to meet WCAG/iOS HIG minimum touch target size
  },
  mediumContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: theme.layout.minTouchTarget,
  },
  largeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },

  // Size text styles
  smallText: {
    fontSize: theme.typography.small.fontSize,
  },
  mediumText: {
    fontSize: theme.typography.body.fontSize,
  },
  largeText: {
    fontSize: theme.typography.h4.fontSize,
  },

  // Disabled states
  disabledContainer: {
    backgroundColor: theme.colors.neutral.gray100,
    borderColor: theme.colors.neutral.gray200,
    opacity: 0.6,
  },
  disabledText: {
    color: theme.colors.text.tertiary,
  },

  // Full width
  fullWidth: {
    width: '100%',
  },
});

export default Button;
