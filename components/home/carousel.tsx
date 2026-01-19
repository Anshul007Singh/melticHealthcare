import { theme } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const data = [
  {
    title: 'First Slide',
    description: 'This is the first slide description.',
    image: '../../assets/images/banner.png',
  },
  {
    title: 'Second Slide',
    description: 'This is the second slide description.',
    image: '../../assets/images/banner1.png',
  },
  {
    title: 'Third Slide',
    description: 'This is the third slide description.',
    image: '../../assets/images/banner2.png',
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / screenWidth);
    setActiveIndex(index);
  };

  const handleTouchStart = () => {
    setIsPaused(true);
    // Clear existing timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
  };

  const handleTouchEnd = () => {
    // Resume auto-scroll after 3 seconds of inactivity
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };
  const TOTAL_SLIDES = 3;
  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % TOTAL_SLIDES;

        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner 1 */}
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/banner.png')}
            style={styles.image}
            accessibilityLabel='Banner 1'
          />
        </View>

        {/* Banner 2 */}
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/banner1.png')}
            style={styles.image}
            accessibilityLabel='Banner 2'
          />
        </View>

        {/* Banner 3 */}
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/banner2.png')}
            style={styles.image}
            accessibilityLabel='Banner 3'
          />
        </View>
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
  },
  slide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral.gray300,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: theme.colors.primary.main,
  },
});

export default Home;
