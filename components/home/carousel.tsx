import { theme } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(xOffset / screenWidth);
    setActiveIndex(slideIndex);
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

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

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
        accessibilityRole="image"
        accessibilityLabel={`Banner carousel, slide ${activeIndex + 1} of ${data.length}`}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={require('../../assets/images/banner.png')}
              style={styles.image}
              accessibilityLabel={item.title}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
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
