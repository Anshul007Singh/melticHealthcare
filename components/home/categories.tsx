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
import { theme } from '@/constants/theme';
import { Shimmer, H3, Typography } from '@/components/ui';

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
        <H3>Categories</H3>
        <TouchableOpacity
          onPress={viewAllHandle}
          accessibilityRole="button"
          accessibilityLabel="View all categories"
        >
          <Typography variant="small" color="link" style={styles.viewAll}>
            View All
          </Typography>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <View key={index} style={styles.shimmerCard}>
                <Shimmer width={50} height={50} borderRadius={theme.borderRadius.sm} />
                <View style={{ height: theme.spacing.sm }} />
                <Shimmer width={70} height={14} borderRadius={theme.borderRadius.sm} />
              </View>
            ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: theme.spacing.lg }}
        >
          {categories.map((item, index) => (
            <Pressable
              key={index}
              style={styles.card}
              onPress={() => onClickItem(item.slug)}
              accessibilityRole="button"
              accessibilityLabel={`Category: ${item.name}`}
            >
              <Image
                source={{ uri: item.image?.src || placeholderImg }}
                style={styles.image}
                resizeMode='contain'
                accessibilityIgnoresInvertColors
              />
              <Typography variant="caption" style={styles.label}>
                {item.name}
              </Typography>
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
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  viewAll: {
    fontWeight: '600',
  },
  card: {
    backgroundColor: theme.colors.primary.light,
    width: CARD_WIDTH,
    height: 120,
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.primary.lighter,
    borderWidth: 1,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: theme.layout.minTouchTarget,
    minHeight: theme.layout.minTouchTarget,
  },
  image: {
    width: 50,
    height: 50,
  },
  label: {
    marginTop: theme.spacing.sm,
    textTransform: 'capitalize',
    fontWeight: '600',
    textAlign: 'center',
  },
  shimmerCard: {
    backgroundColor: theme.colors.primary.light,
    width: CARD_WIDTH,
    height: 120,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
    paddingVertical: theme.spacing.lg,
  },
});
