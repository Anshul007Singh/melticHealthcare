import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Card, Shimmer, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { fetchProducts } from '@/data/productList';

const placeholderImg = '@/assets/images/img-box.svg';

const DynamicListScreen = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [showShimmer, setShowShimmer] = useState(true);

  const { query } = useLocalSearchParams<{ query?: string }>();
  const { width } = useWindowDimensions();

  // 📱 Mobile → 2 | 📲 Tablet → 4
  const numColumns = width >= 768 ? 4 : 3;

  useEffect(() => {
    const loadData = async () => {
      setShowShimmer(true);
      try {
        await new Promise((r) => setTimeout(r, 2000));
        const data = await fetchProducts(query);
        if (Array.isArray(data)) setDataList(data);
      } catch (e) {
        console.error(e);
      } finally {
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

  const ShimmerCard = () => (
    <Card variant="light" style={styles.card}>
      <Shimmer width={50} height={50} borderRadius={theme.borderRadius.sm} />
      <View style={{ marginTop: theme.spacing.sm }}>
        <Shimmer width="60%" height={12} />
      </View>
    </Card>
  );

  if (showShimmer) {
    return (
      <FlatList
        data={Array.from({ length: 8 })}
        numColumns={numColumns}
        key={numColumns} // 🔥 important
        keyExtractor={(_, i) => i.toString()}
        renderItem={() => <ShimmerCard />}
        contentContainerStyle={styles.container}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
      <FlatList
        data={dataList}
        numColumns={numColumns}
        key={numColumns} // 🔥 important
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Pressable
            style={{ flex: 1 }}
            onPress={() => onClickItem(item.slug)}
            accessibilityRole="button"
            accessibilityLabel={`Category ${item.name}`}
          >
            <Card variant="light" style={styles.card}>
              <Image
                source={{ uri: item.image?.src || placeholderImg }}
                style={styles.image}
                resizeMode="contain"
              />
              <Typography variant="caption" style={styles.label} center>
                {item.name}
              </Typography>
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background.secondary,
  },
  card: {
    flex: 1, // 🔑 required for grid
    margin: theme.spacing.sm,
    height: 120,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
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
