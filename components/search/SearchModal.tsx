import { theme } from '@/constants/theme';
import { useSearch } from '@/hooks/useSearch';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { EmptySearch } from './EmptySearch';
import { RecentSearches } from './RecentSearches';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

export interface SearchModalProps {
  /** Whether modal is visible */
  visible: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Optional initial query */
  initialQuery?: string;
}

/**
 * SearchModal Component
 *
 * Full-screen search modal with search bar, recent searches, and results.
 *
 * @example
 * ```tsx
 * <SearchModal
 *   visible={isSearchVisible}
 *   onClose={() => setIsSearchVisible(false)}
 * />
 * ```
 */
export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  initialQuery = '',
}) => {
  const {
    query,
    setQuery,
    results,
    loading,
    errors,
    recentSearches,
    performSearch,
  } = useSearch(initialQuery);

  const searchInputRef = useRef(null);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (visible && searchInputRef.current) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  const handleRecentSearchSelect = (recentQuery: string) => {
    performSearch(recentQuery);
  };

  const handleResultPress = () => {
    // Close modal when navigating to result
    onClose();
  };

  const showRecentSearches = query.trim().length < 2 && recentSearches.length > 0;
  const showEmptySearch = query.trim().length < 2 && recentSearches.length === 0;
  const showResults = query.trim().length >= 2;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            {/* Search Bar */}
            <SearchBar
              ref={searchInputRef}
              value={query}
              onChangeText={setQuery}
              autoFocus={true}
              placeholder="Search products, categories, brands..."
              containerStyle={styles.searchBar}
            />

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close search"
              accessibilityHint="Double tap to close search modal"
            >
              <Ionicons
                name="close"
                color={theme.colors.text.primary}
              />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Recent Searches */}
            {showRecentSearches && (
              <RecentSearches
                searches={recentSearches}
                onSelect={handleRecentSearchSelect}
                onUpdate={() => {
                  // Refresh would happen through useSearch hook
                }}
              />
            )}

            {/* Empty Search State */}
            {showEmptySearch && <EmptySearch />}

            {/* Search Results */}
            {showResults && (
              <SearchResults
                results={results || {
                  products: [],
                  categories: [],
                  brands: [],
                  visualAids: [],
                  query: '',
                  timestamp: Date.now(),
                }}
                query={query}
                loading={loading}
                onResultPress={handleResultPress}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
    backgroundColor: theme.colors.background.primary,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 0,
    marginLeft: theme.spacing.lg,
  },
  closeButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.layout.minTouchTarget,
    height: theme.layout.minTouchTarget,
  },
  closeButtonPressed: {
    backgroundColor: theme.colors.neutral.gray100,
  },
  content: {
    flex: 1,
  },
});

export default SearchModal;
