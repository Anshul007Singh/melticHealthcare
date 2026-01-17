/**
 * Search Service
 *
 * Handles universal search across Products, Categories, Brands, and Visual Aids
 */

import { apiClient, ApiError } from './apiClient';

// Type definitions
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  sku: string;
  stock_status: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  meta_data?: any[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: { src: string } | null;
  count: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: { src: string } | null;
  count: number;
}

export interface VisualAid {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_media?: number;
  slug: string;
}

export interface SearchResults {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  visualAids: VisualAid[];
  query: string;
  timestamp: number;
}

export interface SearchError {
  type: 'products' | 'categories' | 'brands' | 'visualAids';
  error: ApiError;
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const data = await apiClient.get('/wc/v3/products', {
      search: query,
      per_page: 20,
    });
    return data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Search categories by query
 */
export async function searchCategories(query: string): Promise<Category[]> {
  try {
    const data = await apiClient.get('/wc/v3/products/categories', {
      search: query,
      per_page: 20,
    });
    return data || [];
  } catch (error) {
    console.error('Error searching categories:', error);
    throw error;
  }
}

/**
 * Search brands by query
 */
export async function searchBrands(query: string): Promise<Brand[]> {
  try {
    // Note: Adjust endpoint based on actual WooCommerce brands endpoint
    // This might be /wc/v3/products/attributes or a custom endpoint
    const data = await apiClient.get('/wc/v3/products/brands', {
      search: query,
      per_page: 20,
    });
    return data || [];
  } catch (error) {
    console.error('Error searching brands:', error);
    throw error;
  }
}

/**
 * Search visual aids by query
 */
export async function searchVisualAids(query: string): Promise<VisualAid[]> {
  try {
    const data = await apiClient.get('/wp/v2/visual_aids', {
      search: query,
      per_page: 20,
    }, {
      includeAuth: false, // WordPress API doesn't need WooCommerce auth
    });
    return data || [];
  } catch (error) {
    console.error('Error searching visual aids:', error);
    throw error;
  }
}

/**
 * Search all content types in parallel
 * Returns results and any errors that occurred
 */
export async function searchAll(query: string): Promise<{
  results: SearchResults;
  errors: SearchError[];
}> {
  const trimmedQuery = query.trim();

  // Return empty results if query is too short
  if (trimmedQuery.length < 2) {
    return {
      results: {
        products: [],
        categories: [],
        brands: [],
        visualAids: [],
        query: trimmedQuery,
        timestamp: Date.now(),
      },
      errors: [],
    };
  }

  // Search all content types in parallel using Promise.allSettled
  const [productsResult, categoriesResult, brandsResult, visualAidsResult] =
    await Promise.allSettled([
      searchProducts(trimmedQuery),
      searchCategories(trimmedQuery),
      searchBrands(trimmedQuery),
      searchVisualAids(trimmedQuery),
    ]);

  // Collect results and errors
  const results: SearchResults = {
    products: productsResult.status === 'fulfilled' ? productsResult.value : [],
    categories:
      categoriesResult.status === 'fulfilled' ? categoriesResult.value : [],
    brands: brandsResult.status === 'fulfilled' ? brandsResult.value : [],
    visualAids:
      visualAidsResult.status === 'fulfilled' ? visualAidsResult.value : [],
    query: trimmedQuery,
    timestamp: Date.now(),
  };

  const errors: SearchError[] = [];

  if (productsResult.status === 'rejected') {
    errors.push({ type: 'products', error: productsResult.reason });
  }
  if (categoriesResult.status === 'rejected') {
    errors.push({ type: 'categories', error: categoriesResult.reason });
  }
  if (brandsResult.status === 'rejected') {
    errors.push({ type: 'brands', error: brandsResult.reason });
  }
  if (visualAidsResult.status === 'rejected') {
    errors.push({ type: 'visualAids', error: visualAidsResult.reason });
  }

  return { results, errors };
}

/**
 * Get total result count
 */
export function getTotalResultCount(results: SearchResults): number {
  return (
    results.products.length +
    results.categories.length +
    results.brands.length +
    results.visualAids.length
  );
}

/**
 * Check if search has any results
 */
export function hasResults(results: SearchResults): boolean {
  return getTotalResultCount(results) > 0;
}
