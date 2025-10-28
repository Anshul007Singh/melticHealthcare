import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const placeholderImg = 'https://via.placeholder.com/150';

const viewAllHandle = () => {
  router.push({
    pathname: '/pages/category',
    params: { query: 'categories' }, // This sets query param
  });
};

const CategoryCarousel = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { query } = useLocalSearchParams<{ query?: string }>(); // get query param

  // Shimmer Animation
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
    outputRange: [-100, 100], // shimmer slide
  });

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          'https://www.melticgroup.com/online/wp-json/wc/v3/products/categories?consumer_key=ck_8ed576e4b09fbadb918a2360c252064763a5a1d8&consumer_secret=cs_55439183c9806d1a0ac32052649eeb8d6d387bc0',
        );
        const data = await response.json();

        if (data && Array.isArray(data)) {
          const limitedCategories = data.slice(0, 7);
          setCategories(limitedCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }

      setLoading(false);
    };

    loadCategories();
  }, [query]); // run again if query changes

  const onClickItem = (item: any) => {
    router.push({
      pathname: '../productlist',
      params: { query: item },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity onPress={viewAllHandle}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <View key={index} style={styles.shimmerCard}>
                <View style={styles.shimmerImageWrapper}>
                  <Animated.View
                    style={[
                      styles.shimmerEffect,
                      { transform: [{ translateX }] },
                    ]}
                  />
                </View>
                <View style={styles.shimmerLabelWrapper}>
                  <Animated.View
                    style={[
                      styles.shimmerEffect,
                      { transform: [{ translateX }] },
                    ]}
                  />
                </View>
              </View>
            ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map((item, index) => (
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
      )}
    </View>
  );
};

export default CategoryCarousel;

const CARD_WIDTH = Dimensions.get('window').width * 0.28;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  image: {
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    textTransform: 'capitalize',
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    color: '#0060AA',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#F5FAFD',
    width: CARD_WIDTH,
    height: 120,
    borderRadius: 10,
    borderColor: '#C4E0F5',
    borderWidth: 1,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Shimmer Styles
  shimmerCard: {
    backgroundColor: '#F5FAFD',
    width: CARD_WIDTH,
    height: 120,
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  shimmerImageWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
    overflow: 'hidden',
  },
  shimmerLabelWrapper: {
    width: 70,
    height: 14,
    marginTop: 8,
    backgroundColor: '#E1E9EE',
    borderRadius: 6,
    overflow: 'hidden',
  },
  shimmerEffect: {
    width: '50%',
    height: '100%',
    backgroundColor: '#F2F8FC',
    opacity: 0.6,
  },
});
