import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';

const CARD_WIDTH = Dimensions.get('window').width * 0.28;

const visualAidItems = [
  {
    id: 1,
    name: 'Immunity',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl: 'https://www.melticgroup.com/img/immunity.pdf',
  },
  {
    id: 2,
    name: 'Digestive Health',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl: 'https://www.melticgroup.com/img/digestive-health.pdf',
  },
  {
    id: 3,
    name: 'Heart Care',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl: 'https://www.melticgroup.com/img/heart-care.pdf',
  },
  {
    id: 4,
    name: 'Joint Relief',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl: 'https://www.melticgroup.com/img/joint-relief.pdf',
  },
  {
    id: 5,
    name: 'Skin & Hair',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl: 'https://www.melticgroup.com/img/skin-hair.pdf',
  },
  {
    id: 6,
    name: 'Respiratory',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl: 'https://www.melticgroup.com/img/respiratory.pdf',
  },
];

const VisualAid = () => {
  const onClickItem = async (item: any) => {
    console.log(item);
    try {
      const supported = await Linking.canOpenURL(item.pdfUrl);
      if (supported) {
        await Linking.openURL(item.pdfUrl); // 👉 opens in default browser
      } else {
        Alert.alert('Error', 'Unable to open PDF link');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while opening the link');
      console.error('Linking Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Visual Aid</Text>
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
            onPress={() => onClickItem(item)}
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
