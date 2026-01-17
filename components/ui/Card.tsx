import { theme } from '@/constants/theme';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'light';

export interface CardProps extends ViewProps {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Custom container style */
  style?: ViewStyle;
  /** Child elements */
  children: React.ReactNode;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export interface TouchableCardProps extends TouchableOpacityProps {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Custom container style */
  style?: ViewStyle;
  /** Child elements */
  children: React.ReactNode;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Card Component
 *
 * A themeable card container for grouping related content.
 *
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <Text>Card content</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  style,
  children,
  accessibilityLabel,
  ...viewProps
}) => {
  const containerStyle = [styles.base, styles[variant], style];

  return (
    <View
      style={containerStyle}
      // accessibilityRole="group"
      accessibilityLabel={accessibilityLabel}
      {...viewProps}
    >
      {children}
    </View>
  );
};

/**
 * TouchableCard Component
 *
 * A pressable version of the Card component.
 *
 * @example
 * ```tsx
 * <TouchableCard
 *   variant="elevated"
 *   onPress={() => console.log('Card pressed')}
 * >
 *   <Text>Pressable card content</Text>
 * </TouchableCard>
 * ```
 */
export const TouchableCard: React.FC<TouchableCardProps> = ({
  variant = 'default',
  style,
  children,
  accessibilityLabel,
  ...touchableProps
}) => {
  const containerStyle = [styles.base, styles[variant], style];

  return (
    <TouchableOpacity
      style={containerStyle}
      activeOpacity={0.8}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      {...touchableProps}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    ...theme.components.card.default,
  },
  default: {
    ...theme.components.card.default,
  },
  elevated: {
    ...theme.components.card.elevated,
  },
  bordered: {
    ...theme.components.card.bordered,
  },
  light: {
    ...theme.components.card.light,
  },
});

export default Card;
