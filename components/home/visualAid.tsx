import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';

const CARD_WIDTH = Dimensions.get('window').width * 0.28;

// 👉 static visual aid items
const visualAidItems = [
  {
    id: 1,
    name: 'Immunity',
    image: require('../../assets/images/offers.jpg'),
  },
  {
    id: 2,
    name: 'Digestive Health',
    image: require('../../assets/images/offers.jpg'),
  },
  {
    id: 3,
    name: 'Heart Care',
    image: require('../../assets/images/offers.jpg'),
  },
  {
    id: 4,
    name: 'Joint Relief',
    image: require('../../assets/images/offers.jpg'),
  },
  {
    id: 5,
    name: 'Skin & Hair',
    image: require('../../assets/images/offers.jpg'),
  },
  {
    id: 6,
    name: 'Respiratory',
    image: require('../../assets/images/offers.jpg'),
  },
];

const viewAllHandle = () => {
  router.push({
    pathname: '/category',
    params: { query: 'categories' },
  });
};

const VisualAid = () => {
  const onClickItem = (item: string) => {
    router.push({
      pathname: '../productlist',
      params: { query: item },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Visual Aid</Text>
        <TouchableOpacity onPress={viewAllHandle}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {visualAidItems.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => onClickItem(item.name)}
          >
            <Image
              source={item.image}
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

export default VisualAid;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
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
    color: '#1A1A1A',
  },
  viewAll: {
    fontSize: 14,
    color: '#0060AA',
    fontWeight: '600',
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 10,
    width: '100%',
    height: 65,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
});
