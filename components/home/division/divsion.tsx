import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const divisions = [
  {
    id: '1',
    name: 'Meltic Healthcare Pvt. Ltd.',
    logo: 'https://www.melticgroup.com/assets/images/about/meltic-slide1.png',
  },
  {
    id: '2',
    name: 'Dalcon Drugs Pvt. Ltd.',
    logo: 'https://www.melticgroup.com/assets/images/about/dalcon-slide3.png',
  },
  {
    id: '3',
    name: 'Adchem Biotech',
    logo: 'https://www.melticgroup.com/assets/images/about/adchem-slide2.png',
  },
  {
    id: '4',
    name: 'Melvet Animal Health.',
    logo: 'https://www.melticgroup.com/assets/images/about/melvet-slide5.png',
  },
  {
    id: '5',
    name: 'Cardiever Pharmaceuticals.',
    logo: 'https://www.melticgroup.com/assets/images/about/cardic-slide4.png',
  },
];

const OurDivisions = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.logoContainer}>
      <Image src={item.logo} style={styles.logo} resizeMode='contain' />
    </View>
  );

  const onViewAllHandler = () => {
    router.push({
      pathname: '/divisions',
      params: { query: 'brands' },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Our Divisions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll} onPress={onViewAllHandler}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={divisions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 8 }}
      />
      <Image
        source={require('../../../assets/images/home_offer_image_section.png')}
        style={{
          width: '92%',
          margin: 15,
          borderRadius: 20,
        }}
      />
    </View>
  );
};

export default OurDivisions;

const LOGO_SIZE = Dimensions.get('window').width * 0.25;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
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
    marginRight: 16,
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
