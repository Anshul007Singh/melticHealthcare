import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Utilities
 *
 * Helper functions for AsyncStorage operations with error handling.
 */

const STORAGE_KEYS = {
  RECENT_SEARCHES: '@meltic:recent_searches',
  SEARCH_CACHE: '@meltic:search_cache',
  USER_PREFERENCES: '@meltic:user_preferences',
} as const;

export { STORAGE_KEYS };

/**
 * Save data to AsyncStorage
 */
export async function saveData<T>(key: string, data: T): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving data to storage (${key}):`, error);
    return false;
  }
}

/**
 * Load data from AsyncStorage
 */
export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading data from storage (${key}):`, error);
    return null;
  }
}

/**
 * Remove data from AsyncStorage
 */
export async function removeData(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from storage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all AsyncStorage data
 */
export async function clearAllData(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all storage:', error);
    return false;
  }
}

/**
 * Get all storage keys
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
}

/**
 * Recent Searches Management
 */

const MAX_RECENT_SEARCHES = 10;

/**
 * Save a recent search query
 */
export async function saveRecentSearch(query: string): Promise<boolean> {
  try {
    // Load existing searches
    const searches = await loadRecentSearches();

    // Remove duplicates and add new search at the beginning
    const updatedSearches = [
      query,
      ...searches.filter((s) => s.toLowerCase() !== query.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);

    // Save updated searches
    return await saveData(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
  } catch (error) {
    console.error('Error saving recent search:', error);
    return false;
  }
}

/**
 * Load recent searches
 */
export async function loadRecentSearches(): Promise<string[]> {
  try {
    const searches = await loadData<string[]>(STORAGE_KEYS.RECENT_SEARCHES);
    return searches || [];
  } catch (error) {
    console.error('Error loading recent searches:', error);
    return [];
  }
}

/**
 * Clear recent searches
 */
export async function clearRecentSearches(): Promise<boolean> {
  return await removeData(STORAGE_KEYS.RECENT_SEARCHES);
}

/**
 * Remove a specific recent search
 */
export async function removeRecentSearch(query: string): Promise<boolean> {
  try {
    const searches = await loadRecentSearches();
    const updatedSearches = searches.filter(
      (s) => s.toLowerCase() !== query.toLowerCase()
    );
    return await saveData(STORAGE_KEYS.RECENT_SEARCHES, updatedSearches);
  } catch (error) {
    console.error('Error removing recent search:', error);
    return false;
  }
}

/**
 * Search Cache Management
 */

export interface CachedSearchResult<T = any> {
  data: T;
  timestamp: number;
}

/**
 * Save search results to cache
 */
export async function cacheSearchResults<T>(
  query: string,
  results: T
): Promise<boolean> {
  try {
    const cache = await loadData<Record<string, CachedSearchResult<T>>>(
      STORAGE_KEYS.SEARCH_CACHE
    ) || {};

    const cacheKey = query.toLowerCase().trim();
    cache[cacheKey] = {
      data: results,
      timestamp: Date.now(),
    };

    return await saveData(STORAGE_KEYS.SEARCH_CACHE, cache);
  } catch (error) {
    console.error('Error caching search results:', error);
    return false;
  }
}

/**
 * Load cached search results
 * Returns null if cache is expired or doesn't exist
 */
export async function loadCachedSearchResults<T>(
  query: string,
  maxAge: number = 5 * 60 * 1000 // 5 minutes default
): Promise<T | null> {
  try {
    const cache = await loadData<Record<string, CachedSearchResult<T>>>(
      STORAGE_KEYS.SEARCH_CACHE
    );

    if (!cache) {
      return null;
    }

    const cacheKey = query.toLowerCase().trim();
    const cachedResult = cache[cacheKey];

    if (!cachedResult) {
      return null;
    }

    // Check if cache is expired
    const age = Date.now() - cachedResult.timestamp;
    if (age > maxAge) {
      return null;
    }

    return cachedResult.data;
  } catch (error) {
    console.error('Error loading cached search results:', error);
    return null;
  }
}

/**
 * Clear search cache
 */
export async function clearSearchCache(): Promise<boolean> {
  return await removeData(STORAGE_KEYS.SEARCH_CACHE);
}
