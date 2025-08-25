import React from 'react';
import { Divider, Text } from 'react-native-paper';
import { StyleSheet, View, Dimensions, Image, ScrollView } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const data = [
  {
    id: 1,
    image: 'https://hcareindia.com/wp-content/uploads/2024/08/certificaton.jpg',
  },
  {
    id: 2,
    image:
      'https://hcareindia.com/wp-content/uploads/2024/08/certification-2.jpg',
  },
];

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <Text variant='headlineSmall'>Our Certificates</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {data.map((item) => (
          <View key={item.id} style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        ))}
      </ScrollView>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: screenWidth / 2,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  arrowLeft: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  arrowRight: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
});

export default AboutUs;
