import React, { useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Image } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const data = [
  {
    title: 'First Slide',
    description: 'This is the first slide description.',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    title: 'Second Slide',
    description: 'This is the second slide description.',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    title: 'Third Slide',
    description: 'This is the third slide description.',
    image: 'https://picsum.photos/600/400?random=3',
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(xOffset / screenWidth);
    setActiveIndex(slideIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={require('../../assets/images/banner.png')}
              style={styles.image}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  slide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '92%',
    height: 200,
    resizeMode: 'cover',
    margin: 15,
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default Home;
