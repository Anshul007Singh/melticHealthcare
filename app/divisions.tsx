import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { fetchProducts } from '@/data/productList';
import { useLocalSearchParams } from 'expo-router';
const OurDivisions = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const { query } = useLocalSearchParams<{ query?: string }>();
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(query);
        if (data && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };
    loadProducts();
  }, [query]);
  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {products.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: item.image?.src }}
                style={styles.logo}
                resizeMode='contain'
              />
            </View>
            <Text style={styles.label}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default OurDivisions;

const LOGO_SIZE = Dimensions.get('window').width * 0.25;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
    backgroundColor: '#f9f9f9',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: '#1A1A1A',
  },
  card: {
    width: '30%',
    backgroundColor: '#F5FAFD',
    borderRadius: 10,
    borderColor: '#C4E0F5',
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  },
});
