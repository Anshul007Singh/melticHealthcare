import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { Typography } from './Typography';

export interface EmptyStateAction {
  /** Action button label */
  label: string;
  /** Callback when action button is pressed */
  onPress: () => void;
}

export interface EmptyStateProps {
  /** Ionicon name for empty state icon */
  icon: keyof typeof Ionicons.glyphMap;
  /** Optional title */
  title?: string;
  /** Message to display */
  message: string;
  /** Optional action button */
  action?: EmptyStateAction;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * EmptyState Component
 *
 * Displays a friendly empty state with icon and optional action.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="cube-outline"
 *   title="No Products"
 *   message="No featured products available"
 *   action={{
 *     label: "Browse All Products",
 *     onPress: () => navigate('/products')
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
  accessibilityLabel,
}) => {
  return (
    <View
      style={styles.container}
      accessibilityLabel={accessibilityLabel || `Empty state: ${message}`}
      accessibilityRole="text"
    >
      {/* Icon */}
      <Ionicons
        name={icon}
        color={theme.colors.neutral.gray400}
        style={styles.icon}
      />

      {/* Text Content */}
      <View style={styles.textContainer}>
        {title && (
          <Typography
            variant="bodyBold"
            color="primary"
            style={styles.title}
          >
            {title}
          </Typography>
        )}
        <Typography
          variant="small"
          color="secondary"
          style={styles.message}
        >
          {message}
        </Typography>
      </View>

      {/* Optional Action Button */}
      {action && (
        <Button
          variant="primary"
          size="medium"
          onPress={action.onPress}
          style={styles.actionButton}
          accessibilityLabel={action.label}
        >
          {action.label}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
  },
  icon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.6,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
  actionButton: {
    marginTop: theme.spacing.sm,
    minWidth: 160,
  },
});

export default EmptyState;
