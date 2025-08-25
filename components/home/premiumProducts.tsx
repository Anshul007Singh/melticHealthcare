import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { router } from 'expo-router';

const categories = [
  {
    id: '1',
    label: 'Tablets',
    icon: <Ionicons name='medkit' size={40} color='#0060AA' />,
  },
  {
    id: '2',
    label: 'Tonic',
    icon: <FontAwesome5 name='prescription-bottle' size={40} color='#0060AA' />,
  },
  {
    id: '3',
    label: 'Injection',
    icon: <MaterialCommunityIcons name='needle' size={40} color='#0060AA' />,
  },
  {
    id: '4',
    label: 'Drops',
    icon: (
      <MaterialCommunityIcons name='eyedropper' size={40} color='#0060AA' />
    ),
  },
];

const viewAllHandle = () => {
  router.push({
    pathname: '/category',
    params: { query: 'categories' },
  });
};
const CategoryCarousel = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {item.icon}
      <Text style={styles.cardLabel}>{item.label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll} onPress={() => viewAllHandle()}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CategoryCarousel;

const CARD_WIDTH = Dimensions.get('window').width * 0.28;

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
  },
  viewAll: {
    fontSize: 14,
    color: '#0060AA',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#F5FAFD',
    width: CARD_WIDTH,
    height: 120,
    borderRadius: 10,
    borderColor: '#C4E0F5',
    borderWidth: 1,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
