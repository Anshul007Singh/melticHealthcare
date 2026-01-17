/**
 * Search Utilities
 *
 * Helper functions for search scoring, filtering, and text highlighting
 */

import type { Brand, Category, Product, VisualAid } from '@/services/searchService';

/**
 * Search scoring algorithm
 * Returns a score from 0-100 based on match quality
 */
export function scoreMatch(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();

  // Exact match (case-insensitive)
  if (lowerText === lowerQuery) {
    return 100;
  }

  // Starts with query
  if (lowerText.startsWith(lowerQuery)) {
    return 80;
  }

  // Contains query
  if (lowerText.includes(lowerQuery)) {
    // Higher score if query appears near the beginning
    const index = lowerText.indexOf(lowerQuery);
    const relativePosition = index / lowerText.length;
    return Math.floor(50 + (1 - relativePosition) * 20); // 50-70 range
  }

  // Word boundary match (query matches start of any word)
  const words = lowerText.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(lowerQuery)) {
      return 60;
    }
  }

  return 0;
}

/**
 * Score a product for search relevance
 */
export function scoreProduct(product: Product, query: string): number {
  let score = 0;

  // Name match (highest priority)
  score += scoreMatch(product.name, query) * 1.5;

  // SKU match (high priority for exact matches)
  if (product.sku) {
    const skuScore = scoreMatch(product.sku, query);
    if (skuScore === 100) {
      score += 150; // Exact SKU match is very relevant
    } else {
      score += skuScore * 0.8;
    }
  }

  // Category match
  if (product.categories && product.categories.length > 0) {
    const categoryScores = product.categories.map((cat) =>
      scoreMatch(cat.name, query)
    );
    const maxCategoryScore = Math.max(...categoryScores, 0);
    score += maxCategoryScore * 0.5;
  }

  return Math.min(Math.floor(score), 200); // Cap at 200
}

/**
 * Score a category for search relevance
 */
export function scoreCategory(category: Category, query: string): number {
  let score = 0;

  // Name match
  score += scoreMatch(category.name, query) * 1.5;

  // Description match
  if (category.description) {
    score += scoreMatch(category.description, query) * 0.3;
  }

  // Slug match
  score += scoreMatch(category.slug, query) * 0.5;

  return Math.floor(score);
}

/**
 * Score a brand for search relevance
 */
export function scoreBrand(brand: Brand, query: string): number {
  let score = 0;

  // Name match
  score += scoreMatch(brand.name, query) * 1.5;

  // Description match
  if (brand.description) {
    score += scoreMatch(brand.description, query) * 0.3;
  }

  // Slug match
  score += scoreMatch(brand.slug, query) * 0.5;

  return Math.floor(score);
}

/**
 * Score a visual aid for search relevance
 */
export function scoreVisualAid(visualAid: VisualAid, query: string): number {
  let score = 0;

  // Title match
  score += scoreMatch(visualAid.title.rendered, query) * 1.5;

  // Content match (HTML stripped)
  if (visualAid.content?.rendered) {
    const textContent = stripHtml(visualAid.content.rendered);
    score += scoreMatch(textContent, query) * 0.3;
  }

  return Math.floor(score);
}

/**
 * Sort products by relevance score
 */
export function sortProductsByRelevance(
  products: Product[],
  query: string
): Product[] {
  return products
    .map((product) => ({
      product,
      score: scoreProduct(product, query),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);
}

/**
 * Sort categories by relevance score
 */
export function sortCategoriesByRelevance(
  categories: Category[],
  query: string
): Category[] {
  return categories
    .map((category) => ({
      category,
      score: scoreCategory(category, query),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ category }) => category);
}

/**
 * Sort brands by relevance score
 */
export function sortBrandsByRelevance(brands: Brand[], query: string): Brand[] {
  return brands
    .map((brand) => ({
      brand,
      score: scoreBrand(brand, query),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ brand }) => brand);
}

/**
 * Sort visual aids by relevance score
 */
export function sortVisualAidsByRelevance(
  visualAids: VisualAid[],
  query: string
): VisualAid[] {
  return visualAids
    .map((visualAid) => ({
      visualAid,
      score: scoreVisualAid(visualAid, query),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ visualAid }) => visualAid);
}

/**
 * Highlight matching text in a string
 * Returns array of text segments with highlighted flag
 */
export interface HighlightedText {
  text: string;
  highlighted: boolean;
}

export function highlightText(text: string, query: string): HighlightedText[] {
  if (!query.trim()) {
    return [{ text, highlighted: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const segments: HighlightedText[] = [];

  let currentIndex = 0;
  let matchIndex = lowerText.indexOf(lowerQuery, currentIndex);

  while (matchIndex !== -1) {
    // Add non-highlighted text before match
    if (matchIndex > currentIndex) {
      segments.push({
        text: text.substring(currentIndex, matchIndex),
        highlighted: false,
      });
    }

    // Add highlighted match
    segments.push({
      text: text.substring(matchIndex, matchIndex + lowerQuery.length),
      highlighted: true,
    });

    currentIndex = matchIndex + lowerQuery.length;
    matchIndex = lowerText.indexOf(lowerQuery, currentIndex);
  }

  // Add remaining text
  if (currentIndex < text.length) {
    segments.push({
      text: text.substring(currentIndex),
      highlighted: false,
    });
  }

  return segments;
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Extract plain text from HTML rendered content
 */
export function extractTextFromHtml(html: string): string {
  // Remove HTML tags
  let text = stripHtml(html);

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return text.trim();
}

/**
 * Validate search query
 */
export interface QueryValidation {
  isValid: boolean;
  message?: string;
}

export function validateSearchQuery(query: string): QueryValidation {
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { isValid: false, message: 'Search query cannot be empty' };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      message: 'Search query must be at least 2 characters',
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      message: 'Search query is too long (max 100 characters)',
    };
  }

  return { isValid: true };
}
