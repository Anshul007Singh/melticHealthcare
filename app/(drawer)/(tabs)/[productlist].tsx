import {
  Card,
  EmptyState,
  Shimmer,
  TouchableCard,
  Typography,
} from '@/components/ui';
import { theme } from '@/constants/theme';
import { fetchProducts } from '@/data/productList';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc';
type ViewMode = 'grid' | 'list';

// Simple {name, slug} pair used for categories/brands so we can match
// incoming route params (which are slugs) against the correct field,
// while still filtering/displaying by the human-readable name.
type Taxonomy = { name: string; slug: string };

const ALL: Taxonomy = { name: 'all', slug: 'all' };

// Normalizes a string for comparison: lowercase, spaces/underscores -> hyphens.
// This lets "Pain Relief" and "pain-relief" be treated as equal even when
// the product-level taxonomy data only gives us a name and no real slug.
const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-');

const ProductListScreen = () => {
  const params = useLocalSearchParams();
  const query = (params.query || params.productlist) as string | undefined;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [noMatch, setNoMatch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

  // Full taxonomy lists fetched directly from the API (not derived from
  // whichever products happen to be loaded), so all brands/categories show
  // up in the filter even before loadAllProducts() has run.
  const [categories, setCategories] = useState<Taxonomy[]>([ALL]);
  const [brands, setBrands] = useState<Taxonomy[]>([ALL]);

  const router = useRouter();

  // Ref to prevent race conditions in pagination
  const loadingRef = useRef(false);
  // Ref to track if initial filter setup from URL is complete
  const initialFilterSetupComplete = useRef(false);

  const loadTaxonomies = async () => {
    try {
      const [categoryData, brandData] = await Promise.all([
        fetchProducts('categories'),
        fetchProducts('brands'),
      ]);

      if (Array.isArray(categoryData)) {
        setCategories([
          ALL,
          ...categoryData.map((cat: any) => ({
            name: cat.name,
            slug: cat.slug ?? cat.name,
          })),
        ]);
      }

      if (Array.isArray(brandData)) {
        setBrands([
          ALL,
          ...brandData.map((brand: any) => ({
            name: brand.name,
            slug: brand.slug ?? brand.name,
          })),
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories/brands:', error);
    }
  };

  const loadAllProducts = async () => {
    setLoading(true);
    try {
      const allProducts: any[] = [];
      let page = 1;
      let hasMorePages = true;

      // Load all pages
      while (hasMorePages) {
        const data = await fetchProducts(undefined, page, 50);
        if (data && data.products && Array.isArray(data.products)) {
          // Deduplicate and append
          const existingIds = new Set(allProducts.map((p) => p.id));
          const newProducts = data.products.filter(
            (p: any) => !existingIds.has(p.id),
          );
          allProducts.push(...newProducts);

          // Check if there are more pages
          hasMorePages = page < data.totalPages;
          page++;
        } else {
          hasMorePages = false;
        }
      }

      setProducts(allProducts);
      setCurrentPage(page - 1);
      setTotalPages(1); // All products loaded, no more pages
      setHasMore(false);
      setAllProductsLoaded(true);
    } catch (error) {
      console.error('Error loading all products:', error);
    }
    setLoading(false);
  };

  const loadProducts = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const data = await fetchProducts(undefined, 1, 50);
      if (data && data.products && Array.isArray(data.products)) {
        // Deduplicate in case API returns duplicates in a single page
        const uniqueProducts = Array.from(
          new Map(data.products.map((p: any) => [p.id, p])).values(),
        );
        setProducts(uniqueProducts);
        setTotalPages(data.totalPages);
        setHasMore(data.currentPage < data.totalPages);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    try {
      const data = await fetchProducts(undefined, 1, 50);
      if (data && data.products && Array.isArray(data.products)) {
        // Deduplicate in case API returns duplicates in a single page
        const uniqueProducts = Array.from(
          new Map(data.products.map((p: any) => [p.id, p])).values(),
        );
        setProducts(uniqueProducts);
        setTotalPages(data.totalPages);
        setHasMore(data.currentPage < data.totalPages);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
    setRefreshing(false);
  };

  const loadMoreProducts = async () => {
    // Check both state and ref to prevent race conditions
    if (loadingMore || !hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    try {
      const data = await fetchProducts(undefined, nextPage, 50);
      if (data && data.products && Array.isArray(data.products)) {
        setProducts((prevProducts) => {
          // Create a Set of existing product IDs
          const existingIds = new Set(prevProducts.map((p) => p.id));

          // Filter out products that already exist
          const newProducts = data.products.filter(
            (p: any) => !existingIds.has(p.id),
          );

          // Log if duplicates were found (helps debug backend pagination issues)
          const duplicateCount = data.products.length - newProducts.length;
          if (duplicateCount > 0) {
            console.warn(
              `Filtered out ${duplicateCount} duplicate products from page ${nextPage}`,
            );
          }

          // Only append truly new products
          return [...prevProducts, ...newProducts];
        });
        setCurrentPage(nextPage);
        setHasMore(nextPage < data.totalPages);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    }
    setLoadingMore(false);
    loadingRef.current = false;
  };

  useEffect(() => {
    loadProducts();
    loadTaxonomies();
  }, []);

  // (categories/brands are now fetched directly via loadTaxonomies(), see above)

  useEffect(() => {
    // Only run initial filter setup once from URL query params
    if (
      !loading &&
      products.length > 0 &&
      !initialFilterSetupComplete.current
    ) {
      if (query && typeof query === 'string') {
        if (query.toLowerCase() === 'productlist') {
          setSelectedCategory('all');
          setSelectedBrand('all');
          setFeaturedFilter(false);
          setNoMatch(false);
        } else if (query.toLowerCase() === 'featured') {
          setSelectedCategory('all');
          setSelectedBrand('all');
          setFeaturedFilter(true);
          setNoMatch(false);
        } else {
          setFeaturedFilter(false);

          // Match against slug first (route params are slugs), then
          // fall back to name. normalize() makes "pain-relief" equal to
          // "Pain Relief" even when product-level data lacks a real slug.
          const normalizedQuery = normalize(query);
          const matchedCategory = categories.find(
            (cat) =>
              normalize(cat.slug) === normalizedQuery ||
              normalize(cat.name) === normalizedQuery,
          );
          const matchedBrand = brands.find(
            (brand) =>
              normalize(brand.slug) === normalizedQuery ||
              normalize(brand.name) === normalizedQuery,
          );

          if (matchedCategory) {
            setSelectedCategory(matchedCategory.name);
            setSelectedBrand('all');
            setNoMatch(false);
          } else if (matchedBrand) {
            setSelectedBrand(matchedBrand.name);
            setSelectedCategory('all');
            setNoMatch(false);
          } else {
            setNoMatch(true);
          }
        }
      }
      // Mark initial setup as complete to prevent re-running
      initialFilterSetupComplete.current = true;
    }
  }, [loading, products.length, query, categories, brands]);

  // Reset the flag when query param changes (new navigation)
  useEffect(() => {
    initialFilterSetupComplete.current = false;
    setNoMatch(false);
  }, [query]);

  const filteredAndSortedProducts = useMemo(() => {
    // Filter products
    const filtered = products.filter((item) => {
      if (item.status !== 'publish') {
        return false;
      }
      // Search filter
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categories.some((cat: any) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        (item.brands &&
          item.brands.some((brand: any) =>
            brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
          ));

      if (!matchSearch) {
        return false;
      }

      if (featuredFilter) {
        return item.featured === true;
      }

      const matchCategory =
        selectedCategory === 'all' ||
        item.categories.some((cat: any) => cat.name === selectedCategory);

      const matchBrand =
        selectedBrand === 'all' ||
        (item.brands &&
          item.brands.some((brand: any) => brand.name === selectedBrand));

      return matchCategory && matchBrand;
    });

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order
        break;
    }

    return sorted;
  }, [
    products,
    searchQuery,
    featuredFilter,
    selectedCategory,
    selectedBrand,
    sortBy,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedBrand !== 'all') count++;
    if (featuredFilter) count++;
    return count;
  }, [selectedCategory, selectedBrand, featuredFilter]);

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={() => (
          <Card variant='default' style={styles.gridItemContainer}>
            <Shimmer
              width='100%'
              height={160}
              borderRadius={theme.borderRadius.sm}
            />
            <View style={{ height: theme.spacing.sm }} />
            <Shimmer
              width='100%'
              height={16}
              borderRadius={theme.borderRadius.sm}
            />
            <View style={{ height: theme.spacing.xs }} />
            <Shimmer
              width='60%'
              height={16}
              borderRadius={theme.borderRadius.sm}
            />
            <View style={{ height: theme.spacing.xs }} />
            <Shimmer
              width='40%'
              height={18}
              borderRadius={theme.borderRadius.sm}
            />
          </Card>
        )}
      />
    );
  }

  if (noMatch) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon='search-outline'
          title='No Results Found'
          message={`We couldn't find any products matching "${query}". Try a different search term.`}
        />
      </View>
    );
  }

  const imageHandler = (item: any) => {
    const data = item.meta_data[0];
    const indications =
      data.value.filter(
        (content: { id: string }) => content.id === 'indications',
      )[0]?.content || '';
    const sideEffects =
      data.value.filter(
        (content: { id: string }) => content.id === 'side-effects',
      )[0]?.content || '';
    router.push({
      pathname: '/pages/productDetail',
      params: {
        id: item.id,
        title: item.name,
        img: item.images[0]?.src || '',
        category: item.categories[0]?.name || '',
        description: item.description,
        price: item.price,
        sku: item.sku,
        shortDescription: item.short_description,
        sideEffects: sideEffects,
        indications: indications,
      },
    });
  };
  const handleCategorySelect = async (cat: string) => {
    // Load all products first if applying a filter
    if (!allProductsLoaded && cat !== 'all') {
      await loadAllProducts();
    }
    setSelectedCategory(cat);
    setShowCategoryDropdown(false);
  };

  const handleBrandSelect = async (brand: string) => {
    // Load all products first if applying a filter
    if (!allProductsLoaded && brand !== 'all') {
      await loadAllProducts();
    }
    setSelectedBrand(brand);
    setShowBrandDropdown(false);
  };

  const toggleFilters = () => {
    // Close both dropdowns if any are open, otherwise open category dropdown
    if (showCategoryDropdown || showBrandDropdown) {
      setShowCategoryDropdown(false);
      setShowBrandDropdown(false);
    } else {
      setShowCategoryDropdown(true);
    }
  };

  const clearFilter = (type: 'category' | 'brand' | 'featured') => {
    if (type === 'category') {
      setSelectedCategory('all');
    } else if (type === 'brand') {
      setSelectedBrand('all');
    } else if (type === 'featured') {
      setFeaturedFilter(false);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setFeaturedFilter(false);

    // Reset to paginated mode
    if (allProductsLoaded) {
      setAllProductsLoaded(false);
      loadProducts(); // Reload first page
    }
  };

  const renderGridItem = ({ item }: any) => (
    <TouchableCard
      variant='elevated'
      style={styles.gridItemContainer}
      onPress={() => imageHandler(item)}
      accessibilityLabel={`View ${item.name}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.images[0]?.src || '' }}
          style={styles.gridImage}
          resizeMode='cover'
          accessibilityIgnoresInvertColors
        />
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons
              name='star'
              size={12}
              color={theme.colors.primary.light}
            />
            <Typography variant='tiny' style={styles.featuredText}>
              Featured
            </Typography>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Typography variant='caption' style={styles.title} numberOfLines={2}>
          {item.name}
        </Typography>
        <Typography
          variant='caption'
          color='secondary'
          style={styles.titleCategory}
        >
          {item.categories?.[0]?.name || 'No Category'}
        </Typography>
        <View style={styles.priceRow}>
          <Typography
            variant='bodyBold'
            color='primary'
            style={styles.priceText}
          >
            ₹{item.price}
          </Typography>
        </View>
      </View>
    </TouchableCard>
  );

  const renderListItem = ({ item }: any) => (
    <TouchableCard
      variant='elevated'
      style={styles.listItemContainer}
      onPress={() => imageHandler(item)}
      accessibilityLabel={`View ${item.name}`}
    >
      <Image
        source={{ uri: item.images[0]?.src || '' }}
        style={styles.listImage}
        resizeMode='cover'
        accessibilityIgnoresInvertColors
      />
      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Typography
            variant='bodyBold'
            style={styles.listTitle}
            numberOfLines={2}
          >
            {item.name}
          </Typography>
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons
                name='star'
                size={12}
                color={theme.colors.primary.light}
              />
            </View>
          )}
        </View>
        <Typography variant='small' color='secondary'>
          {item.categories?.[0]?.name || 'No Category'}
        </Typography>
        <View style={styles.listFooter}>
          <Typography variant='h4' color='primary' style={styles.listPrice}>
            ₹{item.price}
          </Typography>
        </View>
      </View>
    </TouchableCard>
  );

  return (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name='search'
            size={20}
            color={theme.colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Search products, categories, brands...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.tertiary}
            accessibilityLabel='Search products'
            accessibilityHint='Type to search for products by name, category, or brand'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              accessibilityRole='button'
              accessibilityLabel='Clear search'
            >
              <Ionicons
                name='close-circle'
                size={20}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Header with controls */}
      <View style={styles.headerContainer}>
        <Typography variant='h4' style={styles.headerText}>
          {filteredAndSortedProducts.length} Products
        </Typography>
        <View style={styles.headerControls}>
          {/* Sort Button */}
          <TouchableOpacity
            onPress={() => setShowSortMenu(!showSortMenu)}
            style={styles.controlButton}
            accessibilityRole='button'
            accessibilityLabel='Sort products'
          >
            <Ionicons
              name='swap-vertical'
              size={20}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>

          {/* View Toggle */}
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={styles.controlButton}
            accessibilityRole='button'
            accessibilityLabel={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list' : 'grid'}
              size={20}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>

          {/* Filter Button with Badge */}
          <TouchableOpacity
            onPress={toggleFilters}
            style={styles.controlButton}
            accessibilityRole='button'
            accessibilityLabel='Toggle filters'
          >
            <Ionicons
              name={
                showCategoryDropdown || showBrandDropdown
                  ? 'close'
                  : 'filter-outline'
              }
              size={20}
              color={theme.colors.primary.main}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Typography variant='tiny' style={styles.filterBadgeText}>
                  {activeFiltersCount}
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Menu */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          {[
            { label: 'Default', value: 'default' },
            { label: 'Price: Low to High', value: 'price-asc' },
            { label: 'Price: High to Low', value: 'price-desc' },
            { label: 'Name: A to Z', value: 'name-asc' },
            { label: 'Name: Z to A', value: 'name-desc' },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                setSortBy(option.value as SortOption);
                setShowSortMenu(false);
              }}
              style={[
                styles.sortOption,
                sortBy === option.value && styles.sortOptionSelected,
              ]}
            >
              <Typography
                variant='body'
                style={
                  sortBy === option.value
                    ? styles.sortOptionTextSelected
                    : styles.sortOptionText
                }
              >
                {option.label}
              </Typography>
              {sortBy === option.value && (
                <Ionicons
                  name='checkmark'
                  size={20}
                  color={theme.colors.primary.main}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Active Filters Chips */}
      {activeFiltersCount > 0 && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChips}
          >
            {selectedCategory !== 'all' && (
              <View style={styles.filterChip}>
                <Typography variant='small' style={styles.filterChipText}>
                  {selectedCategory}
                </Typography>
                <TouchableOpacity
                  onPress={() => clearFilter('category')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name='close'
                    size={16}
                    color={theme.colors.text.primary}
                  />
                </TouchableOpacity>
              </View>
            )}
            {selectedBrand !== 'all' && (
              <View style={styles.filterChip}>
                <Typography variant='small' style={styles.filterChipText}>
                  {selectedBrand}
                </Typography>
                <TouchableOpacity
                  onPress={() => clearFilter('brand')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name='close'
                    size={16}
                    color={theme.colors.text.primary}
                  />
                </TouchableOpacity>
              </View>
            )}
            {featuredFilter && (
              <View style={styles.filterChip}>
                <Typography variant='small' style={styles.filterChipText}>
                  Featured
                </Typography>
                <TouchableOpacity
                  onPress={() => clearFilter('featured')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name='close'
                    size={16}
                    color={theme.colors.text.primary}
                  />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={clearAllFilters}
              style={styles.clearAllChip}
            >
              <Typography variant='small' style={styles.clearAllText}>
                Clear All
              </Typography>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Filter Dropdowns */}
      {(showCategoryDropdown || showBrandDropdown) && (
        <View style={styles.filterContainer}>
          {/* Category Dropdown */}
          <View style={styles.dropdownSection}>
            <TouchableOpacity
              onPress={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowBrandDropdown(false);
              }}
              style={styles.dropdownHeader}
              accessibilityRole='button'
              accessibilityLabel='Category filter'
              accessibilityState={{ expanded: showCategoryDropdown }}
            >
              <Typography variant='bodyBold' style={styles.dropdownLabel}>
                Category
              </Typography>
              <View style={styles.dropdownSelectedRow}>
                <Typography variant='small' style={styles.dropdownSelected}>
                  {selectedCategory === 'all' ? 'All' : selectedCategory}
                </Typography>
                <Ionicons
                  name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </View>
            </TouchableOpacity>

            {showCategoryDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.slug}
                      onPress={() => handleCategorySelect(cat.name)}
                      style={[
                        styles.dropdownItem,
                        selectedCategory === cat.name &&
                          styles.dropdownItemSelected,
                      ]}
                      accessibilityRole='button'
                      accessibilityLabel={`Select ${cat.name === 'all' ? 'all products' : cat.name} category`}
                      accessibilityState={{
                        selected: selectedCategory === cat.name,
                      }}
                    >
                      <Typography
                        variant='body'
                        style={
                          selectedCategory === cat.name
                            ? styles.dropdownItemTextSelected
                            : styles.dropdownItemText
                        }
                      >
                        {cat.name === 'all' ? 'All Products' : cat.name}
                      </Typography>
                      {selectedCategory === cat.name && (
                        <Ionicons
                          name='checkmark'
                          size={20}
                          color={theme.colors.primary.main}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Brand Dropdown */}
          <View style={styles.dropdownSection}>
            <TouchableOpacity
              onPress={() => {
                setShowBrandDropdown(!showBrandDropdown);
                setShowCategoryDropdown(false);
              }}
              style={styles.dropdownHeader}
              accessibilityRole='button'
              accessibilityLabel='Brand filter'
              accessibilityState={{ expanded: showBrandDropdown }}
            >
              <Typography variant='bodyBold' style={styles.dropdownLabel}>
                Brand
              </Typography>
              <View style={styles.dropdownSelectedRow}>
                <Typography variant='small' style={styles.dropdownSelected}>
                  {selectedBrand === 'all' ? 'All' : selectedBrand}
                </Typography>
                <Ionicons
                  name={showBrandDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </View>
            </TouchableOpacity>

            {showBrandDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.slug}
                      onPress={() => handleBrandSelect(brand.name)}
                      style={[
                        styles.dropdownItem,
                        selectedBrand === brand.name &&
                          styles.dropdownItemSelected,
                      ]}
                      accessibilityRole='button'
                      accessibilityLabel={`Select ${brand.name === 'all' ? 'all brands' : brand.name} brand`}
                      accessibilityState={{
                        selected: selectedBrand === brand.name,
                      }}
                    >
                      <Typography
                        variant='body'
                        style={
                          selectedBrand === brand.name
                            ? styles.dropdownItemTextSelected
                            : styles.dropdownItemText
                        }
                      >
                        {brand.name === 'all' ? 'All Brands' : brand.name}
                      </Typography>
                      {selectedBrand === brand.name && (
                        <Ionicons
                          name='checkmark'
                          size={20}
                          color={theme.colors.primary.main}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      )}

      <FlatList
        data={filteredAndSortedProducts}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item) => item.id.toString()}
        key={viewMode} // Force re-render when view mode changes
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={
          viewMode === 'grid' ? styles.gridContainer : styles.listContainerStyle
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
        onEndReached={allProductsLoaded ? undefined : loadMoreProducts}
        onEndReachedThreshold={allProductsLoaded ? undefined : 0.5}
        ListFooterComponent={
          loadingMore && !allProductsLoaded ? (
            <View style={styles.loadingFooter}>
              <Shimmer
                width={150}
                height={20}
                borderRadius={theme.borderRadius.sm}
              />
              <Typography
                variant='small'
                color='secondary'
                style={styles.loadingText}
              >
                Loading more products...
              </Typography>
            </View>
          ) : allProductsLoaded ? (
            <View style={styles.loadingFooter}>
              <Typography
                variant='small'
                color='secondary'
                style={styles.loadingText}
              >
                Showing {filteredAndSortedProducts.length} of {products.length}{' '}
                products
              </Typography>
            </View>
          ) : hasMore === false && products.length > 0 ? (
            <View style={styles.loadingFooter}>
              <Typography
                variant='small'
                color='secondary'
                style={styles.loadingText}
              >
                All products loaded
              </Typography>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon='search-outline'
            title='No Products Found'
            message={
              searchQuery
                ? `No products match "${searchQuery}". Try a different search term.`
                : selectedCategory !== 'all' ||
                    selectedBrand !== 'all' ||
                    featuredFilter
                  ? "We couldn't find any products matching your filters. Try clearing some filters to see more results."
                  : 'No products available at the moment. Please check back later!'
            }
          />
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
  },
  headerText: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.semantic.error,
    borderRadius: theme.borderRadius.round,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: theme.colors.neutral.white,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  clearButton: {
    padding: theme.spacing.xs,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Sort Menu
  sortMenu: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
  },
  sortOptionSelected: {
    backgroundColor: theme.colors.primary.lighter,
  },
  sortOptionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  sortOptionTextSelected: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary.main,
  },

  // Active Filters
  activeFiltersContainer: {
    backgroundColor: theme.colors.background.primary,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
  },
  filterChips: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary.lighter,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  filterChipText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  clearAllChip: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.semantic.error,
    borderRadius: theme.borderRadius.round,
  },
  clearAllText: {
    color: theme.colors.neutral.white,
    fontWeight: '600',
  },

  // Grid View
  gridContainer: {
    padding: theme.spacing.sm,
  },
  gridItemContainer: {
    width: '47%',
    margin: theme.spacing.xs,
    padding: theme.spacing.sm,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: theme.colors.primary.lighter,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: 160,
  },
  featuredBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: theme.colors.semantic.error,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  featuredText: {
    color: theme.colors.text.inverse,
    fontWeight: '700',
  },
  productInfo: {
    padding: theme.spacing.xs,
  },
  title: {
    ...theme.typography.smallBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  titleCategory: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  priceText: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary.main,
  },

  // List View
  listContainerStyle: {
    padding: theme.spacing.sm,
  },
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.neutral.gray100,
  },
  listContent: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  listTitle: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  listPrice: {
    color: theme.colors.primary.main,
  },
  filterContainer: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
  },
  dropdownSection: {
    marginBottom: theme.spacing.md,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
    minHeight: 44,
  },
  dropdownLabel: {
    flex: 1,
  },
  dropdownSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dropdownSelected: {
    color: theme.colors.text.secondary,
  },
  dropdownList: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
    maxHeight: 200,
    ...theme.shadows.sm,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
    minHeight: 44,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primary.lighter,
  },
  dropdownItemText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  dropdownItemTextSelected: {
    ...theme.typography.body,
    color: theme.colors.primary.main,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFooter: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default ProductListScreen;
