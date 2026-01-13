import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Image,
  Animated,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const data = [
  {
    title: 'First Slide',
    description: 'This is the first slide description.',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    title: 'Second Slide',
    description: 'This is the second slide description.',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    title: 'Third Slide',
    description: 'This is the third slide description.',
    image: 'https://picsum.photos/600/300?random=3',
  },
];

const Home = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentIndexRef = useRef(0);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(xOffset / screenWidth);
    currentIndexRef.current = slideIndex;
  };

  // Auto-slide effect - Fixed: interval no longer resets every 3 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % data.length;
      currentIndexRef.current = nextIndex;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array - interval runs continuously without resetting

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
});

export default Home;
