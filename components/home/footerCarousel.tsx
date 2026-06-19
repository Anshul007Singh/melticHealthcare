import { theme } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

const imageMap: { [key: string]: any } = {
  banner1: require('../../assets/images/footerimage1.png'),
  banner2: require('../../assets/images/footerimage2.png'),
};

const data = [
  {
    title: 'First Slide',
    description: 'This is the first slide',
    image: 'banner1',
  },
  {
    title: 'Second Slide',
    description: 'This is the second slide',
    image: 'banner2',
  },
  {
    title: 'Third Slide',
    description: 'This is the third slide',
    image: 'banner3',
  },
];

const FooterCarousel = () => {
  const { width: screenWidth } = useWindowDimensions();
  const imageHeight = (screenWidth * 9) / 16; // 16:9 ratio

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / screenWidth);
    setActiveIndex(index);
  };

  const handleTouchStart = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 3000);
  };

  // Auto-slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, screenWidth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              width: screenWidth,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={imageMap[item.image]}
              style={{ width: screenWidth, height: imageHeight }}
              resizeMode='cover'
              accessibilityLabel={item.title}
            />
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
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
    backgroundColor: theme.colors.background.primary,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  paginationDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral.gray300,
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: theme.colors.primary.main,
  },
});

export default FooterCarousel;
