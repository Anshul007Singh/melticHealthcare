import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { fetchProducts } from '@/data/productList';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { Typography } from '@/components/ui';

const LOGO_SIZE = Dimensions.get('window').width * 0.25;

const BRAND_ORDER = [
  'meltic',
  'adchem',
  'dalcon',
  'cardiever-pharmaceuticals',
  'melvet-animal-health',
  'mivika-wellness',
];

const OurDivisions = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const { query } = useLocalSearchParams<{ query?: string }>();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(query);

        if (Array.isArray(data)) {
          const sortedProducts = [...data].sort((a, b) => {
            const aIndex = BRAND_ORDER.indexOf(a.slug);
            const bIndex = BRAND_ORDER.indexOf(b.slug);

            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;

            return aIndex - bIndex;
          });

          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    loadProducts();
  }, [query]);

  const onClickHandler = (slug: string) => {
    router.push({
      pathname: '../productlist',
      params: { query: slug },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
      <ScrollView contentContainerStyle={styles.container}>
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => onClickHandler(item.slug)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} division`}
          >
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri:
                    typeof item.image === 'string'
                      ? item.image
                      : item.image?.src ?? '',
                }}
                style={styles.logo}
                resizeMode='contain'
                accessibilityLabel={`${item.name} logo`}
              />
            </View>
            <Typography variant="caption" style={styles.label} center>
              {item.name}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default OurDivisions;

/* ---------------------------------------------------
   STYLES
--------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
  },
  card: {
    width: '30%',
    alignItems: 'center',
  },
  label: {
    marginTop: theme.spacing.sm,
  },
  logoContainer: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
    ...theme.shadows.sm,
  },
  logo: {
    width: LOGO_SIZE * 0.9,
    height: LOGO_SIZE * 0.8,
  },
});
