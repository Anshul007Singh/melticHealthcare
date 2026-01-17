import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../ui/Typography';

export interface EmptySearchProps {
  /** Search query that returned no results */
  query?: string;
}

/**
 * EmptySearch Component
 *
 * Displays empty state when search returns no results.
 *
 * @example
 * ```tsx
 * <EmptySearch query={searchQuery} />
 * ```
 */
export const EmptySearch: React.FC<EmptySearchProps> = ({ query }) => {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <Ionicons
        name="search-outline"
        color={theme.colors.neutral.gray400}
        style={styles.icon}
      />

      {/* Title */}
      <Typography variant="bodyBold" color="primary" style={styles.title}>
        {query ? 'No results found' : 'Start searching'}
      </Typography>

      {/* Message */}
      <Typography variant="small" color="secondary" style={styles.message}>
        {query
          ? `We couldn't find anything matching "${query}". Try different keywords or check your spelling.`
          : 'Search for products, categories, brands, or visual aids'}
      </Typography>

      {/* Suggestions */}
      {query && (
        <View style={styles.suggestions}>
          <Typography
            variant="caption"
            color="tertiary"
            style={styles.suggestionsTitle}
          >
            Suggestions:
          </Typography>
          <Typography variant="caption" color="secondary">
            • Check your spelling
          </Typography>
          <Typography variant="caption" color="secondary">
            • Try different keywords
          </Typography>
          <Typography variant="caption" color="secondary">
            • Use more general terms
          </Typography>
        </View>
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
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: theme.spacing.lg,
  },
  suggestions: {
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  suggestionsTitle: {
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
});

export default EmptySearch;
