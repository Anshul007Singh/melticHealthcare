import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { Card } from './Card';
import { Typography } from './Typography';

export interface ErrorCardProps {
  /** Error message to display */
  message: string;
  /** Optional error title */
  title?: string;
  /** Callback when retry button is pressed */
  onRetry?: () => void;
  /** Label for retry button */
  retryLabel?: string;
  /** Ionicon name for error icon */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * ErrorCard Component
 *
 * Displays error messages with optional retry functionality.
 *
 * @example
 * ```tsx
 * <ErrorCard
 *   title="Failed to Load"
 *   message="Could not load categories"
 *   onRetry={() => refetchCategories()}
 * />
 * ```
 */
export const ErrorCard: React.FC<ErrorCardProps> = ({
  message,
  title = 'Error',
  onRetry,
  retryLabel = 'Try Again',
  icon = 'alert-circle-outline',
  accessibilityLabel,
}) => {
  return (
    <Card
      variant="bordered"
      style={styles.container}
      accessibilityLabel={accessibilityLabel || `Error: ${message}`}
      accessibilityRole="alert"
    >
      <View style={styles.content}>
        {/* Error Icon */}
        <Ionicons
          name={icon}
          color={theme.colors.semantic.error}
          style={styles.icon}
        />

        {/* Error Text */}
        <View style={styles.textContainer}>
          <Typography
            variant="bodyBold"
            color="error"
            style={styles.title}
          >
            {title}
          </Typography>
          <Typography
            variant="small"
            color="secondary"
            style={styles.message}
          >
            {message}
          </Typography>
        </View>

        {/* Retry Button */}
        {onRetry && (
          <Button
            variant="outline"
            size="small"
            onPress={onRetry}
            style={styles.retryButton}
            accessibilityLabel={`Retry: ${retryLabel}`}
            accessibilityHint="Double tap to retry loading the content"
          >
            {retryLabel}
          </Button>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.semantic.errorBackground,
    borderColor: theme.colors.semantic.error,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  icon: {
    marginBottom: theme.spacing.sm,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  message: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.sm,
    minWidth: 120,
  },
});

export default ErrorCard;
