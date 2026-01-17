import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from './Typography';

export interface NetworkBannerProps {
  /** Whether the banner is visible */
  visible: boolean;
  /** Callback when retry is pressed */
  onRetry?: () => void;
  /** Custom message */
  message?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * NetworkBanner Component
 *
 * Displays a network error banner at the top of the screen.
 *
 * @example
 * ```tsx
 * <NetworkBanner
 *   visible={!isConnected}
 *   onRetry={() => refetchAll()}
 * />
 * ```
 */
export const NetworkBanner: React.FC<NetworkBannerProps> = ({
  visible,
  onRetry,
  message = 'No internet connection',
  accessibilityLabel,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessibilityLabel={accessibilityLabel || 'Network error banner'}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.content}>
        {/* Icon */}
        <Ionicons
          name="cloud-offline-outline"
          color={theme.colors.background.primary}
          style={styles.icon}
        />

        {/* Message */}
        <Typography
          variant="small"
          style={styles.message}
        >
          {message}
        </Typography>

        {/* Retry Button */}
        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Retry connection"
            accessibilityHint="Double tap to retry connecting"
          >
            <Ionicons
              name="refresh-outline"
              color={theme.colors.background.primary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.semantic.error,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  message: {
    color: theme.colors.background.primary,
    flex: 1,
  },
  retryButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  retryButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default NetworkBanner;
