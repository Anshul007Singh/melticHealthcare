import { Card, EmptyState, Shimmer, TouchableCard, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { fetchProducts } from '@/data/productList';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ProductListScreen = () => {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [noMatch, setNoMatch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    return () => {
      router.replace({
        pathname: '/[productlist]',
        params: { query: 'productlist', productlist: 'productlist' },
      });
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        if (data && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const all = products.flatMap((item) =>
      item.categories.map((cat: any) => cat.name),
    );
    return ['all', ...new Set(all)];
  }, [products]);

  const brands = useMemo(() => {
    const all = products.flatMap((item) =>
      item.brands ? item.brands.map((brand: any) => brand.name) : [],
    );
    return ['all', ...new Set(all)];
  }, [products]);

  useEffect(() => {
    if (!loading && products.length > 0) {
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
          const matchedCategory = categories.find(
            (cat) => cat.toLowerCase() === query.toLowerCase(),
          );
          const matchedBrand = brands.find(
            (brand) => brand.toLowerCase() === query.toLowerCase(),
          );

          if (matchedCategory) {
            setSelectedCategory(matchedCategory);
            setSelectedBrand('all');
            setNoMatch(false);
          } else if (matchedBrand) {
            setSelectedBrand(matchedBrand);
            setSelectedCategory('all');
            setNoMatch(false);
          } else {
            setNoMatch(true);
          }
        }
      } else {
        setFeaturedFilter(false);
        setNoMatch(false);
      }
    }
  }, [loading, products, query, categories, brands]);

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={() => (
          <Card variant="default" style={styles.itemContainer}>
            <Shimmer width="100%" height={120} borderRadius={theme.borderRadius.sm} />
            <View style={{ height: theme.spacing.sm }} />
            <Shimmer width="100%" height={16} borderRadius={theme.borderRadius.sm} />
            <View style={{ height: theme.spacing.xs }} />
            <Shimmer width="50%" height={16} borderRadius={theme.borderRadius.sm} />
          </Card>
        )}
      />
    );
  }

  if (noMatch) {
    return (
      <View style={styles.emptyContainer}>
        <EmptyState
          icon="search-outline"
          title="No Results Found"
          message={`We couldn't find any products matching "${query}". Try a different search term.`}
        />
      </View>
    );
  }

  const filteredProducts = products.filter((item) => {
    // Search filter
    const matchSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categories.some((cat: any) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (item.brands &&
        item.brands.some((brand: any) =>
          brand.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const imageHandler = (item: any) => {
    const data = item.meta_data[0];
    const indications =
      data.value.filter(
        (content: { id: string }) => content.id === 'indication',
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
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setShowCategoryDropdown(false);
  };

  const handleBrandSelect = (brand: string) => {
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

  const renderItem = ({ item }: any) => (
    <TouchableCard
      variant="default"
      style={styles.itemContainer}
      onPress={() => imageHandler(item)}
      accessibilityLabel={`View ${item.name}`}
    >
      <Image
        source={{ uri: item.images[0]?.src || '' }}
        style={styles.image}
        resizeMode='contain'
        accessibilityIgnoresInvertColors
      />
      <Typography variant="caption" style={styles.title} numberOfLines={2}>
        {item.name}
      </Typography>
      <Typography variant="caption" color="secondary" style={styles.titleCategory}>
        {item.categories?.[0]?.name || 'No Category'}
      </Typography>
      <Typography variant="smallBold" color="primary" style={styles.priceText}>
        ₹ {item.price}
      </Typography>
    </TouchableCard>
  );

  return (
    <>
    <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, categories, brands..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.tertiary}
            accessibilityLabel="Search products"
            accessibilityHint="Type to search for products by name, category, or brand"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.headerContainer}>
        <Typography variant="h4" style={styles.headerText}>
          {selectedCategory === 'all'
            ? `All Products${
                selectedBrand !== 'all' ? ` - ${selectedBrand}` : ''
              }`
            : `${selectedCategory}${
                selectedBrand !== 'all' ? ` - ${selectedBrand}` : ''
              }`}
        </Typography>
        <TouchableOpacity
          onPress={toggleFilters}
          style={styles.iconWrapper}
          accessibilityRole="button"
          accessibilityLabel="Toggle filters"
          accessibilityHint="Double tap to show or hide filter options"
        >
          <Feather
            name={showCategoryDropdown || showBrandDropdown ? 'x' : 'filter'}
            size={24}
            color={theme.colors.primary.main}
          />
        </TouchableOpacity>
      </View>

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
              accessibilityRole="button"
              accessibilityLabel="Category filter"
              accessibilityState={{ expanded: showCategoryDropdown }}
            >
              <Typography variant="bodyBold" style={styles.dropdownLabel}>
                Category
              </Typography>
              <View style={styles.dropdownSelectedRow}>
                <Typography variant="small" style={styles.dropdownSelected}>
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
                      key={cat}
                      onPress={() => handleCategorySelect(cat)}
                      style={[
                        styles.dropdownItem,
                        selectedCategory === cat && styles.dropdownItemSelected,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${cat === 'all' ? 'all products' : cat} category`}
                      accessibilityState={{ selected: selectedCategory === cat }}
                    >
                      <Typography
                        variant="body"
                        style={selectedCategory === cat ? styles.dropdownItemTextSelected : styles.dropdownItemText}
                      >
                        {cat === 'all' ? 'All Products' : cat}
                      </Typography>
                      {selectedCategory === cat && (
                        <Ionicons
                          name="checkmark"
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
              accessibilityRole="button"
              accessibilityLabel="Brand filter"
              accessibilityState={{ expanded: showBrandDropdown }}
            >
              <Typography variant="bodyBold" style={styles.dropdownLabel}>
                Brand
              </Typography>
              <View style={styles.dropdownSelectedRow}>
                <Typography variant="small" style={styles.dropdownSelected}>
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
                      key={brand}
                      onPress={() => handleBrandSelect(brand)}
                      style={[
                        styles.dropdownItem,
                        selectedBrand === brand && styles.dropdownItemSelected,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${brand === 'all' ? 'all brands' : brand} brand`}
                      accessibilityState={{ selected: selectedBrand === brand }}
                    >
                      <Typography
                        variant="body"
                        style={selectedBrand === brand ? styles.dropdownItemTextSelected : styles.dropdownItemText}
                      >
                        {brand === 'all' ? 'All Brands' : brand}
                      </Typography>
                      {selectedBrand === brand && (
                        <Ionicons
                          name="checkmark"
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
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No Products Found"
            message={
              searchQuery
                ? `No products match "${searchQuery}". Try a different search term.`
                : selectedCategory !== 'all' || selectedBrand !== 'all' || featuredFilter
                ? "We couldn't find any products matching your filters. Try clearing some filters to see more results."
                : "No products available at the moment. Please check back later!"
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
    display: 'flex',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.neutral.gray100,
  },
  iconWrapper: {
    marginRight: theme.spacing.md,
    minWidth: theme.layout.minTouchTarget,
    minHeight: theme.layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  searchContainer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.neutral.gray100,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
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
  listContainer: {
    padding: theme.spacing.sm,
  },
  itemContainer: {
    width: '45%',
    margin: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginTop: 5,
  },
  titleCategory: {
    fontSize: 11,
    color: '#333',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0060AA',
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
});

export default ProductListScreen;
