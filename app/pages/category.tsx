import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { fetchProducts } from '@/data/productList';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { Card, Typography, Shimmer } from '@/components/ui';

const placeholderImg = 'https://via.placeholder.com/150';
const { width } = Dimensions.get('window');

const DynamicListScreen = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShimmer, setShowShimmer] = useState(true);

  const { query } = useLocalSearchParams<{ query?: string }>();

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
    return (
      <Card variant="light" style={styles.card}>
        <Shimmer width={50} height={50} borderRadius={theme.borderRadius.sm} />
        <View style={{ marginTop: theme.spacing.sm }}>
          <Shimmer width="60%" height={12} borderRadius={theme.borderRadius.sm} />
        </View>
      </Card>
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
      <ScrollView contentContainerStyle={styles.container}>
        {dataList.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onClickItem(item.slug)}
            accessibilityRole="button"
            accessibilityLabel={`Category: ${item.name}`}
          >
            <Card variant="light" style={styles.card}>
              <Image
                source={{ uri: item.image?.src || placeholderImg }}
                style={styles.image}
                resizeMode='contain'
                accessibilityLabel={`${item.name} icon`}
              />
              <Typography variant="caption" style={styles.label} center>
                {item.name}
              </Typography>
            </Card>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: 50,
    height: 50,
  },
  label: {
    marginTop: theme.spacing.sm,
  },
});

export default DynamicListScreen;
