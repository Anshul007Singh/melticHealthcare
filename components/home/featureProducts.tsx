import { Card, H3, Shimmer, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { fetchProducts } from '@/data/productList';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const FeatureProductsCarousel = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const onViewAllHandler = () => {
    router.push({
      pathname: '../productlist',
      params: { query: 'featured' },
    });
  };

  const onClickHandler = (item: any) => {
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

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      if (data && Array.isArray(data)) {
        const featuredProducts = data
          .filter((item) => item.featured === true)
          .slice(0, 7);
        setProducts(featuredProducts);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onClickHandler(item)}
      accessibilityRole="button"
      accessibilityLabel={`Product: ${item.name}`}
    >
      <Card variant="default" style={styles.cardInner}>
        <Image
          source={{
            uri: item.images?.[0]?.src || 'https://via.placeholder.com/150',
          }}
          style={styles.image}
          resizeMode='contain'
          accessibilityLabel={`${item.name} product image`}
        />
        <View style={styles.cardBody}>
          <Typography variant="small" numberOfLines={2}>
            {item.name}
          </Typography>
          <Typography variant="tiny" color="secondary" style={styles.categoryText}>
            {item.categories?.[0]?.name || 'Category'}
          </Typography>
          <View style={styles.cardFooter}>
            <Typography variant="bodyBold" color="link">
              {item.price ? `₹ ${item.price}` : 'Price on Request'}
            </Typography>
            {item.sku && (
              <Typography variant="caption" color="tertiary">
                SKU: {item.sku}
              </Typography>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderShimmerItem = () => (
    <Card variant="default" style={styles.card}>
      <Shimmer width="100%" height={140} borderRadius={0} />
      <View style={styles.cardBody}>
        <Shimmer width={120} height={16} borderRadius={theme.borderRadius.sm} />
        <View style={{ marginTop: theme.spacing.xs }}>
          <Shimmer width={80} height={14} borderRadius={theme.borderRadius.sm} />
        </View>
        <View style={{ marginTop: theme.spacing.sm }}>
          <Shimmer width={100} height={14} borderRadius={theme.borderRadius.sm} />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <H3>Feature Products</H3>
        <TouchableOpacity
          onPress={onViewAllHandler}
          accessibilityRole="button"
          accessibilityLabel="View all featured products"
        >
          <Typography variant="smallBold" color="link">
            View All
          </Typography>
        </TouchableOpacity>
      </View>

      {loading ? (
        <FlatList
          horizontal
          data={[1, 2, 3, 4]} // Dummy array for shimmer
          renderItem={renderShimmerItem}
          keyExtractor={(item, index) => `shimmer-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.sm }}
        />
      ) : products.length === 0 ? (
        <Typography
          variant="body"
          color="secondary"
          center
          style={{ marginVertical: theme.spacing.xl }}
        >
          No featured products available.
        </Typography>
      ) : (
        <FlatList
          horizontal
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.sm }}
        />
      )}
    </View>
  );
};

export default FeatureProductsCarousel;

const CARD_WIDTH = Dimensions.get('window').width * 0.5;

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    
  },
  cardInner: {
    padding: 0,
    overflow: 'hidden',
    backgroundColor: theme.colors.neutral.white,
  },
  image: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: theme.spacing.md,
  },
  categoryText: {
    marginTop: theme.spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
});
