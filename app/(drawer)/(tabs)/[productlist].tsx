import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fetchProducts } from '@/data/productList';
import { useRouter } from 'expo-router';

const ShimmerPlaceholder = ({ style }: { style?: any }) => {
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
    outputRange: [-150, 150],
  });

  return (
    <View style={[styles.shimmerContainer, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const ProductListScreen = () => {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [noMatch, setNoMatch] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
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
          <View style={styles.itemContainer}>
            <ShimmerPlaceholder style={styles.image} />
            <ShimmerPlaceholder style={{ height: 16, marginTop: 8 }} />
            <ShimmerPlaceholder
              style={{ height: 16, marginTop: 6, width: '50%' }}
            />
          </View>
        )}
      />
    );
  }

  if (noMatch) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No products available for "{query?.toUpperCase()}".
        </Text>
      </View>
    );
  }

  const filteredProducts = products.filter((item) => {
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
        (content: { id: string }) => content.id === 'indications',
      )[0]?.content || '';
    const sideEffects =
      data.value.filter(
        (content: { id: string }) => content.id === 'side-effects',
      )[0]?.content || '';

    router.push({
      pathname: '/productDetail',
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
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  const applyFilter = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => imageHandler(item)}>
        <Image
          source={{ uri: item.images[0]?.src || '' }}
          style={styles.image}
          resizeMode='contain'
        />
      </TouchableOpacity>
      <Text style={styles.title}>{item.name} </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>
          {item.categories?.[0]?.name || 'No Category'}
        </Text>
        <Text style={styles.title}>₹ {item.price}</Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {selectedCategory === 'all' && selectedBrand === 'all'
            ? 'All Products'
            : `${selectedCategory !== 'all' ? selectedCategory : ''} ${
                selectedBrand !== 'all' ? ` - ${selectedBrand}` : ''
              }`}
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.iconWrapper}
        >
          <Feather name='filter' size={24} color='#59AFFF' />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
      />
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.sectionTitle}>Categories</Text>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategorySelect(cat)}
                  style={[
                    styles.modalItem,
                    selectedCategory === cat && styles.selectedItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedCategory === cat && styles.selectedText,
                    ]}
                  >
                    {cat === 'all' ? 'All Products' : cat}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionTitle}>Brands</Text>
              {brands.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  onPress={() => handleBrandSelect(brand)}
                  style={[
                    styles.modalItem,
                    selectedBrand === brand && styles.selectedItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      selectedBrand === brand && styles.selectedText,
                    ]}
                  >
                    {brand === 'all' ? 'All Brands' : brand}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={applyFilter}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
    borderRadius: 8,
  },
  shimmer: {
    width: '50%',
    height: '100%',
    backgroundColor: '#F2F8FC',
    opacity: 0.6,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  iconWrapper: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 8,
  },
  itemContainer: {
    width: '45%',
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
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
    color: '#59AFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    marginHorizontal: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
    color: '#333',
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItem: {
    backgroundColor: '#59AFFF20',
    borderRadius: 6,
  },
  selectedText: {
    color: '#59AFFF',
    fontWeight: 'bold',
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#59AFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ProductListScreen;
