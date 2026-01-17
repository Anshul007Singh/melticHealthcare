import { theme } from '@/constants/theme';
import type {
  Brand,
  Category,
  Product,
  VisualAid,
} from '@/services/searchService';
import { highlightText } from '@/utils/searchUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableCard } from '../ui/Card';
import { Typography } from '../ui/Typography';

export type SearchResultType = 'product' | 'category' | 'brand' | 'visualAid';

export interface SearchResultItemProps {
  /** Type of search result */
  type: SearchResultType;
  /** The result data */
  data: Product | Category | Brand | VisualAid;
  /** Search query for highlighting */
  query: string;
  /** Callback when item is pressed */
  onPress?: () => void;
}

/**
 * SearchResultItem Component
 *
 * Renders a search result item based on its type.
 *
 * @example
 * ```tsx
 * <SearchResultItem
 *   type="product"
 *   data={product}
 *   query={searchQuery}
 *   onPress={closeModal}
 * />
 * ```
 */
export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  type,
  data,
  query,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    onPress?.();

    // Navigate based on type
    switch (type) {
      case 'product':
        const product = data as Product;
        router.push({
          pathname: '/pages/productDetail',
          params: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.src || '',
            ...product,
          },
        });
        break;

      case 'category':
        const category = data as Category;
        router.push({
          pathname: '/(drawer)/(tabs)/[productlist]',
          params: { query: category.slug },
        });
        break;

      case 'brand':
        const brand = data as Brand;
        router.push({
          pathname: '/(drawer)/(tabs)/[productlist]',
          params: { query: brand.slug },
        });
        break;

      case 'visualAid':
        // Visual aids handled differently - could open modal
        console.log('Visual aid pressed:', data);
        break;
    }
  };

  // Render based on type
  switch (type) {
    case 'product':
      return <ProductResultItem data={data as Product} query={query} onPress={handlePress} />;
    case 'category':
      return <CategoryResultItem data={data as Category} query={query} onPress={handlePress} />;
    case 'brand':
      return <BrandResultItem data={data as Brand} query={query} onPress={handlePress} />;
    case 'visualAid':
      return <VisualAidResultItem data={data as VisualAid} query={query} onPress={handlePress} />;
    default:
      return null;
  }
};

/**
 * Product Result Item
 */
const ProductResultItem: React.FC<{
  data: Product;
  query: string;
  onPress: () => void;
}> = ({ data, query, onPress }) => {
  const nameSegments = highlightText(data.name, query);
  const imageUri = data.images?.[0]?.src || '';

  return (
    <TouchableCard variant="default" onPress={onPress} style={styles.productCard}>
      {/* Product Image */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.productImage}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]}>
          <Ionicons
            name="image-outline"
            color={theme.colors.neutral.gray300}
          />
        </View>
      )}

      {/* Product Details */}
      <View style={styles.productDetails}>
        {/* Product Name with highlighting */}
        <Text style={styles.productName} numberOfLines={2}>
          {nameSegments.map((segment, index) => (
            <Text
              key={index}
              style={segment.highlighted && styles.highlightedText}
            >
              {segment.text}
            </Text>
          ))}
        </Text>

        {/* Category */}
        {data.categories?.[0] && (
          <Typography variant="tiny" color="secondary" style={styles.productCategory}>
            {data.categories[0].name}
          </Typography>
        )}

        {/* Price and SKU */}
        <View style={styles.productFooter}>
          <Typography variant="smallBold" color="link">
            ₹ {data.price || data.regular_price}
          </Typography>
          {data.sku && (
            <Typography variant="caption" color="tertiary">
              {data.sku}
            </Typography>
          )}
        </View>
      </View>
    </TouchableCard>
  );
};

/**
 * Category Result Item
 */
const CategoryResultItem: React.FC<{
  data: Category;
  query: string;
  onPress: () => void;
}> = ({ data, query, onPress }) => {
  const nameSegments = highlightText(data.name, query);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.categoryCard, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View ${data.name} category`}
    >
      <View style={styles.categoryIcon}>
        <Ionicons
          name="grid-outline"
          color={theme.colors.primary.main}
        />
      </View>

      <View style={styles.categoryDetails}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {nameSegments.map((segment, index) => (
            <Text
              key={index}
              style={segment.highlighted && styles.highlightedText}
            >
              {segment.text}
            </Text>
          ))}
        </Text>
        <Typography variant="caption" color="secondary">
          {data.count} {data.count === 1 ? 'product' : 'products'}
        </Typography>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        color={theme.colors.neutral.gray400}
      />
    </Pressable>
  );
};

/**
 * Brand Result Item
 */
const BrandResultItem: React.FC<{
  data: Brand;
  query: string;
  onPress: () => void;
}> = ({ data, query, onPress }) => {
  const nameSegments = highlightText(data.name, query);
  const imageUri = data.image?.src || '';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.brandCard, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View ${data.name} brand`}
    >
      {/* Brand Logo */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.brandLogo}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.brandLogo, styles.placeholderLogo]}>
          <Ionicons
            name="business-outline"
            color={theme.colors.neutral.gray400}
          />
        </View>
      )}

      <View style={styles.brandDetails}>
        <Text style={styles.brandName} numberOfLines={1}>
          {nameSegments.map((segment, index) => (
            <Text
              key={index}
              style={segment.highlighted && styles.highlightedText}
            >
              {segment.text}
            </Text>
          ))}
        </Text>
        <Typography variant="caption" color="secondary">
          {data.count} {data.count === 1 ? 'product' : 'products'}
        </Typography>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        color={theme.colors.neutral.gray400}
      />
    </Pressable>
  );
};

/**
 * Visual Aid Result Item
 */
const VisualAidResultItem: React.FC<{
  data: VisualAid;
  query: string;
  onPress: () => void;
}> = ({ data, query, onPress }) => {
  const title = data.title.rendered || '';
  const titleSegments = highlightText(title, query);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.visualAidCard, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View ${title}`}
    >
      <View style={styles.visualAidIcon}>
        <Ionicons
          name="document-text-outline"
          color={theme.colors.primary.main}
        />
      </View>

      <View style={styles.visualAidDetails}>
        <Text style={styles.visualAidTitle} numberOfLines={2}>
          {titleSegments.map((segment, index) => (
            <Text
              key={index}
              style={segment.highlighted && styles.highlightedText}
            >
              {segment.text}
            </Text>
          ))}
        </Text>
        <Typography variant="caption" color="secondary">
          PDF Document
        </Typography>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        color={theme.colors.neutral.gray400}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Product Card
  productCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xs,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'space-between',
  },
  productName: {
    ...theme.typography.small,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  productCategory: {
    marginBottom: theme.spacing.xs,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Category Card
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray100,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    ...theme.typography.small,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs / 2,
  },

  // Brand Card
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray100,
  },
  brandLogo: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
    backgroundColor: theme.colors.background.primary,
    marginRight: theme.spacing.md,
  },
  placeholderLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandDetails: {
    flex: 1,
  },
  brandName: {
    ...theme.typography.small,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs / 2,
  },

  // Visual Aid Card
  visualAidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray100,
  },
  visualAidIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  visualAidDetails: {
    flex: 1,
  },
  visualAidTitle: {
    ...theme.typography.small,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },

  // Common
  cardPressed: {
    backgroundColor: theme.colors.neutral.gray50,
  },
  highlightedText: {
    backgroundColor: theme.colors.semantic.warningBackground,
    color: theme.colors.semantic.warning,
    fontWeight: '600',
  },
});

export default SearchResultItem;
