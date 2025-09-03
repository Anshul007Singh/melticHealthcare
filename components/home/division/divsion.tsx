import { fetchProducts } from '@/data/productList';
import { router } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

const LOGO_SIZE = Dimensions.get('window').width * 0.25;

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

const OurDivisions = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      const data = await fetchProducts('brands'); // ✅ Query "brands"
      if (Array.isArray(data)) {
        setBrands(data);
      } else {
        setBrands([]);
      }
      setLoading(false);
    };

    loadBrands();
  }, []);

  const onClickHandler = (item: any) => {
    router.push({
      pathname: '../productlist',
      params: { query: item.slug },
    });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.logoContainer}
      onPress={() => onClickHandler(item)}
    >
      <Image
        source={{ uri: item?.image?.src }}
        style={styles.logo}
        resizeMode='contain'
      />
    </TouchableOpacity>
  );

  const onViewAllHandler = () => {
    router.push({
      pathname: '/divisions',
      params: { query: 'brands' }, // ✅ Pass query for next page
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Our Divisions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll} onPress={onViewAllHandler}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View style={styles.logoContainer}>
              <ShimmerPlaceholder style={styles.logo} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 8 }}
        />
      ) : (
        <FlatList
          horizontal
          data={brands}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 8 }}
        />
      )}

      <Image
        source={require('../../../assets/images/home_offer_image_section.png')}
        style={{
          width: '92%',
          margin: 15,
          borderRadius: 20,
        }}
      />
    </View>
  );
};

export default OurDivisions;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 16,
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
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: '#fff',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: LOGO_SIZE * 0.9,
    height: LOGO_SIZE * 0.8,
    borderRadius: 50,
  },
  shimmerContainer: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
    borderRadius: 50,
  },
  shimmer: {
    width: '50%',
    height: '100%',
    backgroundColor: '#F2F8FC',
    opacity: 0.6,
  },
});
