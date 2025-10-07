import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { fetchProducts } from '@/data/productList';
import { router, useLocalSearchParams } from 'expo-router';

const placeholderImg = 'https://via.placeholder.com/150';

const DynamicListScreen = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { query } = useLocalSearchParams<{ query?: string }>();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(query);
        if (data && Array.isArray(data)) {
          setDataList(data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
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
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#0060AA' />
      </View>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 50,
    height: 50,
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
});

export default DynamicListScreen;
