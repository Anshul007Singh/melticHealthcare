import { theme } from '@/constants/theme';
import { clearRecentSearches, removeRecentSearch } from '@/utils/storageUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Typography } from '../ui/Typography';

export interface RecentSearchesProps {
  /** Array of recent search queries */
  searches: string[];
  /** Callback when a recent search is selected */
  onSelect: (query: string) => void;
  /** Callback when searches are updated (after clear/remove) */
  onUpdate?: () => void;
}

/**
 * RecentSearches Component
 *
 * Displays recent search queries with ability to select or remove them.
 *
 * @example
 * ```tsx
 * <RecentSearches
 *   searches={recentSearches}
 *   onSelect={(query) => setQuery(query)}
 *   onUpdate={loadRecentSearches}
 * />
 * ```
 */
export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelect,
  onUpdate,
}) => {
  const handleClearAll = async () => {
    await clearRecentSearches();
    onUpdate?.();
  };

  const handleRemove = async (query: string) => {
    await removeRecentSearch(query);
    onUpdate?.();
  };

  if (searches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="bodyBold" color="primary">
          Recent Searches
        </Typography>
        <Pressable
          onPress={handleClearAll}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Clear all recent searches"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Typography variant="small" color="link">
            Clear All
          </Typography>
        </Pressable>
      </View>

      {/* Recent Searches List */}
      <FlatList
        data={searches}
        keyExtractor={(item, index) => `recent-${index}-${item}`}
        renderItem={({ item }) => (
          <View style={styles.searchItem}>
            <Pressable
              onPress={() => onSelect(item)}
              style={({ pressed }) => [
                styles.searchButton,
                pressed && styles.searchButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Search for ${item}`}
            >
              <Ionicons
                name="time-outline"
                color={theme.colors.neutral.gray500}
                style={styles.clockIcon}
              />
              <Typography
                variant="small"
                color="primary"
                style={styles.searchText}
                numberOfLines={1}
              >
                {item}
              </Typography>
            </Pressable>

            <Pressable
              onPress={() => handleRemove(item)}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.removeButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item} from recent searches`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close-outline"
                color={theme.colors.neutral.gray400}
              />
            </Pressable>
          </View>
        )}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  clearButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  clearButtonPressed: {
    backgroundColor: theme.colors.neutral.gray100,
  },
  listContent: {
    gap: theme.spacing.xs,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  searchButtonPressed: {
    backgroundColor: theme.colors.neutral.gray100,
  },
  clockIcon: {
    marginRight: theme.spacing.sm,
  },
  searchText: {
    flex: 1,
  },
  removeButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
  },
  removeButtonPressed: {
    backgroundColor: theme.colors.neutral.gray100,
  },
});

export default RecentSearches;
