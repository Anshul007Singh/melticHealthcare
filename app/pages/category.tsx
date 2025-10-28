import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { fetchProducts } from '@/data/productList';
import { router, useLocalSearchParams } from 'expo-router';

const placeholderImg = 'https://via.placeholder.com/150';
const { width } = Dimensions.get('window');

const DynamicListScreen = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShimmer, setShowShimmer] = useState(true);

  const { query } = useLocalSearchParams<{ query?: string }>();

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Shimmer animation setup
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerAnim]);

  // Simulate 2-second delay before loading data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setShowShimmer(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // ⏳ 2 sec delay
        const data = await fetchProducts(query);
        if (data && Array.isArray(data)) {
          setDataList(data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
        setShowShimmer(false);
      }
    };
    loadData();
  }, [query]);

  const onClickItem = (item: string) => {
    router.push({
      pathname: '../productlist',
      params: { query: item },
    });
  };

  // Shimmer placeholder component
  const ShimmerCard = () => {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    return (
      <View style={styles.card}>
        <View style={styles.shimmerBox}>
          <Animated.View
            style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
          />
        </View>
        <View style={[styles.shimmerLine, { width: '60%' }]}>
          <Animated.View
            style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
          />
        </View>
      </View>
    );
  };

  if (showShimmer) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {Array.from({ length: 9 }).map((_, i) => (
          <ShimmerCard key={i} />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {dataList.map((item, index) => (
          <Pressable
            key={index}
            style={styles.card}
            onPress={() => onClickItem(item.slug)}
          >
            <Image
              source={{ uri: item.image?.src || placeholderImg }}
              style={styles.image}
              resizeMode='contain'
            />
            <Text style={styles.label}>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F5FAFD',
    borderRadius: 10,
    borderColor: '#C4E0F5',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    overflow: 'hidden',
  },
  image: {
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  shimmerBox: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    borderRadius: 8,
  },
  shimmerLine: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 10,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    width: '50%',
    opacity: 0.6,
  },
});

export default DynamicListScreen;
