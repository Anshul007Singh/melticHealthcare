import { H3, Shimmer, Typography } from '@/components/ui';
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

const LOGO_SIZE = Dimensions.get('window').width * 0.25;

/* ---------------------------------------------------
   BRAND ORDER (based on API slug)
--------------------------------------------------- */
const BRAND_ORDER = [
  'meltic',
  'adchem',
  'dalcon',
  'cardiever-pharmaceuticals',
  'melvet-animal-health',
  'mivika-wellness', // optional (future brand)
];


/* ---------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */
const OurDivisions = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);

      const data = await fetchProducts('brands');

      if (Array.isArray(data)) {
        const sortedBrands = [...data].sort((a, b) => {
          const aIndex = BRAND_ORDER.indexOf(a.slug);
          const bIndex = BRAND_ORDER.indexOf(b.slug);

          // Push unknown brands to the end
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;

          return aIndex - bIndex;
        });

        setBrands(sortedBrands);
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
      accessibilityRole="button"
      accessibilityLabel={`${item.name} division`}
    >
      <Image
        source={{ uri: item?.image?.src }}
        style={styles.logo}
        resizeMode='contain'
        accessibilityLabel={`${item.name} logo`}
      />
    </TouchableOpacity>
  );

  const onViewAllHandler = () => {
    router.push({
      pathname: '/pages/divisions',
      params: { query: 'brands' },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <H3>Our Divisions</H3>
        <TouchableOpacity
          onPress={onViewAllHandler}
          accessibilityRole="button"
          accessibilityLabel="View all divisions"
        >
          <Typography variant="smallBold" color="link">
            View All
          </Typography>
        </TouchableOpacity>
      </View>

      {loading ? (
        <FlatList
          horizontal
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View style={styles.logoContainer}>
              <Shimmer
                width={LOGO_SIZE * 0.9}
                height={LOGO_SIZE * 0.9}
                borderRadius={LOGO_SIZE / 2}
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: theme.spacing.sm }}
        />
      ) : (
        <FlatList
          horizontal
          data={brands}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: theme.spacing.sm }}
        />
      )}

      <Image
        source={require('../../../assets/images/home_offer_image_section.png')}
        style={{
          width: '92%',
          margin: theme.spacing.lg,
          borderRadius: theme.borderRadius.xl,
        }}
        accessibilityLabel="Promotional offer banner"
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
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: theme.colors.background.primary,
    marginRight: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
    ...theme.shadows.sm,
  },
  logo: {
    width: LOGO_SIZE * 0.9,
    height: LOGO_SIZE * 0.9,
    borderRadius: 50,
  },
});
