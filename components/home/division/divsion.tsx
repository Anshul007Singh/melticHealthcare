import { H3, Shimmer, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { fetchProducts } from '@/data/productList';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

/* ---------------------------------------------------
   BRAND ORDER
--------------------------------------------------- */
const BRAND_ORDER = [
  'meltic',
  'adchem',
  'dalcon',
  'cardiever-pharmaceuticals',
  'melvet-animal-health',
  'mivika-wellness',
];

const OurDivisions = () => {
  const { width: screenWidth } = useWindowDimensions();
  const LOGO_SIZE = screenWidth * 0.25;

  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      const data = await fetchProducts('brands');

      if (Array.isArray(data)) {
        setBrands(
          [...data].sort(
            (a, b) =>
              BRAND_ORDER.indexOf(a.slug) - BRAND_ORDER.indexOf(b.slug)
          )
        );
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
      style={[
        styles.logoContainer,
        {
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          borderRadius: LOGO_SIZE / 2,
        },
      ]}
      onPress={() => onClickHandler(item)}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: item?.image?.src }}
        resizeMode="contain"
        style={{
          width: LOGO_SIZE * 0.9,
          height: LOGO_SIZE * 0.9,
          borderRadius: LOGO_SIZE / 2,
        }}
      />
    </TouchableOpacity>
  );

  const renderShimmer = () => (
    <View
      style={[
        styles.logoContainer,
        {
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          borderRadius: LOGO_SIZE / 2,
        },
      ]}
    >
      <Shimmer
        width={LOGO_SIZE * 0.9}
        height={LOGO_SIZE * 0.9}
        borderRadius={LOGO_SIZE / 2}
      />
    </View>
  );

  const bannerWidth = screenWidth - 2 * theme.spacing.lg;
  const bannerHeight = (bannerWidth * 9) / 21;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <H3>Our Divisions</H3>
        <TouchableOpacity onPress={() => router.push('/pages/divisions')}>
          <Typography variant="smallBold" color="link">
            View All
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Brand List */}
      <FlatList
        horizontal
        data={loading ? [1, 2, 3, 4, 5] : brands}
        keyExtractor={(item, index) => index.toString()}
        renderItem={loading ? renderShimmer : renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
        }}
      />

      {/* Banner */}
      <Image
        source={require('../../../assets/images/home_offer_image_section.png')}
        resizeMode="cover"
        style={{
          width: bannerWidth,
          height: bannerHeight,
          borderRadius: theme.borderRadius.xl,
          marginHorizontal: theme.spacing.lg,
          marginTop: theme.spacing.xl,
        }}
      />
    </View>
  );
};

export default OurDivisions;

/* ---------------------------------------------------
   STYLES
--------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    backgroundColor: theme.colors.background.primary,
    marginRight: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
});
