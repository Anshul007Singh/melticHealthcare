import { theme } from '@/constants/theme';
import type { SearchResults as SearchResultsType } from '@/services/searchService';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Shimmer } from '../ui/Shimmer';
import { Typography } from '../ui/Typography';
import { EmptySearch } from './EmptySearch';
import { SearchResultItem } from './SearchResultItem';

export type SearchTab = 'all' | 'products' | 'categories' | 'brands' | 'visualAids';

export interface SearchResultsProps {
  /** Search results */
  results: SearchResultsType;
  /** Search query */
  query: string;
  /** Whether search is loading */
  loading: boolean;
  /** Callback when result is pressed */
  onResultPress?: () => void;
}

/**
 * SearchResults Component
 *
 * Displays search results in a tabbed interface.
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  loading,
  onResultPress,
}) => {
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  // Calculate counts
  const counts = {
    all:
      results.products.length +
      results.categories.length +
      results.brands.length +
      results.visualAids.length,
    products: results.products.length,
    categories: results.categories.length,
    brands: results.brands.length,
    visualAids: results.visualAids.length,
  };

  // Get data for active tab
  const getTabData = () => {
    switch (activeTab) {
      case 'all':
        return [
          ...results.products.map((p) => ({ type: 'product' as const, data: p })),
          ...results.categories.map((c) => ({ type: 'category' as const, data: c })),
          ...results.brands.map((b) => ({ type: 'brand' as const, data: b })),
          ...results.visualAids.map((v) => ({ type: 'visualAid' as const, data: v })),
        ];
      case 'products':
        return results.products.map((p) => ({ type: 'product' as const, data: p }));
      case 'categories':
        return results.categories.map((c) => ({ type: 'category' as const, data: c }));
      case 'brands':
        return results.brands.map((b) => ({ type: 'brand' as const, data: b }));
      case 'visualAids':
        return results.visualAids.map((v) => ({ type: 'visualAid' as const, data: v }));
      default:
        return [];
    }
  };

  const tabData = getTabData();

  // Show loading shimmer
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.shimmerContainer}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.shimmerItem}>
              <Shimmer width={60} height={60} borderRadius={theme.borderRadius.sm} />
              <View style={styles.shimmerText}>
                <Shimmer width="80%" height={16} borderRadius={4} />
                <Shimmer width="60%" height={14} borderRadius={4} marginTop={theme.spacing.xs} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Show empty state
  if (counts.all === 0) {
    return (
      <View style={styles.container}>
        <EmptySearch query={query} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'products', label: 'Products', count: counts.products },
            { key: 'categories', label: 'Categories', count: counts.categories },
            { key: 'brands', label: 'Brands', count: counts.brands },
            { key: 'visualAids', label: 'Visual Aids', count: counts.visualAids },
          ]}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveTab(item.key as SearchTab)}
              style={[
                styles.tab,
                activeTab === item.key && styles.tabActive,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === item.key }}
              accessibilityLabel={`${item.label} tab, ${item.count} results`}
            >
              <Typography
                variant="smallBold"
                color={activeTab === item.key ? 'link' : 'secondary'}
              >
                {item.label} ({item.count})
              </Typography>
              {activeTab === item.key && <View style={styles.tabIndicator} />}
            </Pressable>
          )}
          contentContainerStyle={styles.tabsContent}
        />
      </View>

      {/* Results List */}
      <FlatList
        data={tabData}
        keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
        renderItem={({ item }) => (
          <SearchResultItem
            type={item.type}
            data={item.data}
            query={query}
            onPress={onResultPress}
          />
        )}
        contentContainerStyle={styles.resultsContent}
        ListEmptyComponent={<EmptySearch query={query} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
    backgroundColor: theme.colors.background.primary,
  },
  tabsContent: {
    paddingHorizontal: theme.spacing.md,
  },
  tab: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    position: 'relative',
  },
  tabActive: {
    // Active tab styling
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    height: 2,
    backgroundColor: theme.colors.primary.main,
  },
  resultsContent: {
    paddingVertical: theme.spacing.sm,
  },
  shimmerContainer: {
    padding: theme.spacing.lg,
  },
  shimmerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  shimmerText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
});

export default SearchResults;
