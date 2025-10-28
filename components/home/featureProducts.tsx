import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { fetchProducts } from '@/data/productList';
import { router } from 'expo-router';

const FeatureProductsCarousel = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200], // Move shimmer across
  });

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
    <TouchableOpacity style={styles.card} onPress={() => onClickHandler(item)}>
      <Image
        source={{
          uri: item.images?.[0]?.src || 'https://via.placeholder.com/150',
        }}
        style={styles.image}
        resizeMode='contain'
      />
      <View style={styles.cardBody}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productType}>
          {item.categories?.[0]?.name || 'Category'}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>
            {item.price ? `₹ ${item.price}` : 'Price on Request'}
          </Text>
          <Text style={styles.packing}>
            {item.sku ? `SKU: ${item.sku}` : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShimmerItem = () => (
    <View style={styles.card}>
      {/* Image shimmer */}
      <View style={[styles.image, styles.shimmerContainer]}>
        <Animated.View
          style={[
            styles.shimmerEffect,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
      <View style={styles.cardBody}>
        <View style={[styles.shimmerLine, { width: 120, height: 16 }]} />
        <View
          style={[styles.shimmerLine, { width: 80, height: 14, marginTop: 8 }]}
        />
        <View
          style={[styles.shimmerLine, { width: 100, height: 14, marginTop: 8 }]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Feature Products</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll} onPress={onViewAllHandler}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <FlatList
          horizontal
          data={[1, 2, 3, 4]} // Dummy array for shimmer
          renderItem={renderShimmerItem}
          keyExtractor={(item, index) => `shimmer-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      ) : products.length === 0 ? (
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          No featured products available.
        </Text>
      ) : (
        <FlatList
          horizontal
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      )}
    </View>
  );
};

export default FeatureProductsCarousel;

const CARD_WIDTH = Dimensions.get('window').width * 0.6;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0060AA',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: 10,
    backgroundColor: '#F2F9FF',
  },
  productName: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  productType: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  price: {
    color: '#0060AA',
    fontWeight: '700',
    fontSize: 20,
  },
  packing: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* Shimmer styles */
  shimmerContainer: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
  shimmerEffect: {
    width: '50%',
    height: '100%',
    backgroundColor: '#F2F8FC',
    opacity: 0.6,
  },
  shimmerLine: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
});
