import {
  loadCachedSearchResults,
  loadRecentSearches,
  saveRecentSearch,
  cacheSearchResults,
} from '@/utils/storageUtils';
import { searchAll, SearchResults } from '@/services/searchService';
import type { SearchError } from '@/services/searchService';
import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

export interface UseSearchReturn {
  /** Current search query */
  query: string;
  /** Set search query */
  setQuery: (query: string) => void;
  /** Search results */
  results: SearchResults | null;
  /** Whether search is loading */
  loading: boolean;
  /** Search errors */
  errors: SearchError[];
  /** Recent search queries */
  recentSearches: string[];
  /** Clear search */
  clearSearch: () => void;
  /** Retry search */
  retrySearch: () => void;
  /** Perform search with specific query */
  performSearch: (query: string) => Promise<void>;
}

/**
 * useSearch Hook
 *
 * Manages search state, debouncing, caching, and recent searches.
 *
 * @param initialQuery - Optional initial query
 * @param debounceDelay - Debounce delay in milliseconds (default: 300ms)
 * @returns Search state and methods
 *
 * @example
 * ```tsx
 * const {
 *   query,
 *   setQuery,
 *   results,
 *   loading,
 *   errors,
 *   recentSearches
 * } = useSearch();
 * ```
 */
export function useSearch(
  initialQuery: string = '',
  debounceDelay: number = 300
): UseSearchReturn {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SearchError[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, debounceDelay);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches().then((searches) => {
      setRecentSearches(searches);
    });
  }, []);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearchInternal(debouncedQuery);
    } else if (debouncedQuery.trim().length === 0) {
      // Clear results when query is empty
      setResults(null);
      setErrors([]);
    }
  }, [debouncedQuery]);

  /**
   * Internal search function
   */
  const performSearchInternal = async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();

    // Check cache first
    const cachedResults = await loadCachedSearchResults<SearchResults>(
      trimmedQuery
    );

    if (cachedResults) {
      setResults(cachedResults);
      setErrors([]);
      setLoading(false);
      return;
    }

    // Perform fresh search
    setLoading(true);
    setErrors([]);

    try {
      const { results: searchResults, errors: searchErrors } =
        await searchAll(trimmedQuery);

      setResults(searchResults);
      setErrors(searchErrors);

      // Cache results
      await cacheSearchResults(trimmedQuery, searchResults);

      // Save to recent searches if there are results
      if (
        searchResults.products.length > 0 ||
        searchResults.categories.length > 0 ||
        searchResults.brands.length > 0 ||
        searchResults.visualAids.length > 0
      ) {
        await saveRecentSearch(trimmedQuery);
        // Reload recent searches
        const updatedSearches = await loadRecentSearches();
        setRecentSearches(updatedSearches);
      }
    } catch (error) {
      console.error('Search error:', error);
      setErrors([
        {
          type: 'products',
          error: error as any,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Perform search with specific query
   */
  const performSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    await performSearchInternal(searchQuery);
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setErrors([]);
  };

  /**
   * Retry search
   */
  const retrySearch = () => {
    if (query.trim().length >= 2) {
      performSearchInternal(query);
    }
  };

  return {
    query,
    setQuery,
    results,
    loading,
    errors,
    recentSearches,
    clearSearch,
    retrySearch,
    performSearch,
  };
}

export default useSearch;
