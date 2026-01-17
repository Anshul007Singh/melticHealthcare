import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ViewProps,
} from 'react-native';
import { theme } from '@/constants/theme';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'error' | 'warning';

export interface BadgeProps extends ViewProps {
  /** Number or text to display in badge */
  count?: number | string;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Show badge even if count is 0 */
  showZero?: boolean;
  /** Maximum count to display (shows "99+" if exceeded) */
  maxCount?: number;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
}

/**
 * Badge Component
 *
 * Display a small badge indicator, typically for notifications or counts.
 *
 * @example
 * ```tsx
 * <Badge count={5} variant="error" />
 * <Badge count={100} maxCount={99} />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  count = 0,
  variant = 'default',
  showZero = false,
  maxCount = 99,
  style,
  textStyle,
  ...viewProps
}) => {
  // Don't show badge if count is 0 and showZero is false
  if (!showZero && count === 0) {
    return null;
  }

  // Format count display
  const displayCount =
    typeof count === 'number' && count > maxCount ? `${maxCount}+` : String(count);

  const containerStyle = [
    styles.base,
    styles[`${variant}Container`],
    // Adjust size for longer text
    displayCount.length > 2 && styles.wideBadge,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    textStyle,
  ];

  return (
    <View
      style={containerStyle}
      accessibilityRole="text"
      accessibilityLabel={`${count} notifications`}
      {...viewProps}
    >
      <Text style={textStyles}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    ...theme.components.badge.default,
  },
  baseText: {
    ...theme.typography.tinyBold,
    color: theme.colors.text.inverse,
  },

  // Variant container styles
  defaultContainer: {
    ...theme.components.badge.default,
  },
  primaryContainer: {
    ...theme.components.badge.primary,
  },
  successContainer: {
    ...theme.components.badge.success,
  },
  errorContainer: {
    backgroundColor: theme.colors.semantic.error,
    borderRadius: theme.borderRadius.round,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  warningContainer: {
    backgroundColor: theme.colors.semantic.warning,
    borderRadius: theme.borderRadius.round,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  // Variant text styles
  defaultText: {
    color: theme.colors.text.inverse,
  },
  primaryText: {
    color: theme.colors.text.inverse,
  },
  successText: {
    color: theme.colors.text.inverse,
  },
  errorText: {
    color: theme.colors.text.inverse,
  },
  warningText: {
    color: theme.colors.text.primary,
  },

  // Wide badge for 100+
  wideBadge: {
    paddingHorizontal: 8,
    minWidth: 24,
  },
});

export default Badge;
