// components/FeatureProductsCarousel.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const products = [
  {
    id: '1',
    name: 'AZIMEL-500',
    type: 'Tablets',
    price: '₹ 145',
    packing: '5×10',
    image: 'https://www.melticgroup.com//uploads/product/17508421129034.png',
  },
  {
    id: '2',
    name: 'LYCOVIZ A TO Z',
    type: 'Tonic',
    price: '₹ 270',
    packing: '10×100',
    image: 'https://www.melticgroup.com//uploads/product/17508364973412.png',
  },
  {
    id: '3',
    name: 'CEFLIDE-100',
    type: 'Tablets',
    price: '₹ 1100',
    packing: '10×10',
    image: 'https://www.melticgroup.com//uploads/product/17506752679542.png', // <- Use same image or new ones
  },
  {
    id: '4',
    name: 'ZYMEMEL-AC',
    type: 'Tablets',
    price: '₹ 1250',
    packing: '10×50',
    image: 'https://www.melticgroup.com//uploads/product/17460062862936.png', // <- Use same image or new ones
  },
  {
    id: '5',
    name: 'Urimel-Km',
    type: 'Sachets',
    price: '₹ 59',
    packing: '10×10',
    image: 'https://www.melticgroup.com//uploads/product/17460062481211.jpg', // <- Use same image or new ones
  },
  {
    id: '6',
    name: 'URIMEL-D',
    type: 'Tonic',
    price: '₹ 170',
    packing: '10×10',
    image: 'https://www.melticgroup.com//uploads/product/17460061824475.jpg', // <- Use same image or new ones
  },
];

const FeatureProductsCarousel = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image src={item.image} style={styles.image} resizeMode='contain' />
      <View style={styles.cardBody}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productType}>{item.type}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.packing}>Packing {item.packing}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Feature Products</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable product cards */}
      <FlatList
        horizontal
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

export default FeatureProductsCarousel;

const CARD_WIDTH = Dimensions.get('window').width * 0.6;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 8,
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
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: 10,
    backgroundColor: '#F2F9FF',
  },
  productName: {
    color: '#0060AA',
    fontWeight: '700',
    fontSize: 16,
  },
  productType: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    color: '#0060AA',
    fontWeight: '700',
    fontSize: 20,
  },
  packing: {
    fontSize: 12,
    fontWeight: '500',
  },
});
