import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  Easing,
  ViewProps,
} from 'react-native';
import { theme } from '@/constants/theme';

export interface ShimmerProps extends ViewProps {
  /** Width of the shimmer placeholder */
  width?: number | string;
  /** Height of the shimmer placeholder */
  height?: number | string;
  /** Border radius */
  borderRadius?: number;
  /** Custom container style */
  style?: ViewStyle;
  /** Animation duration in ms */
  duration?: number;
}

/**
 * Shimmer Component
 *
 * A loading skeleton placeholder with shimmer animation.
 *
 * @example
 * ```tsx
 * <Shimmer width={100} height={20} borderRadius={4} />
 * <Shimmer width="100%" height={50} />
 * ```
 */
export const Shimmer: React.FC<ShimmerProps> = ({
  width = 100,
  height = 20,
  borderRadius = theme.borderRadius.sm,
  style,
  duration = 1200,
  ...viewProps
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim, duration]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  const containerStyle = [
    styles.container,
    {
      width,
      height,
      borderRadius,
    },
    style,
  ];

  return (
    <View
      style={containerStyle}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      {...viewProps}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

/**
 * ShimmerGroup Component
 *
 * Renders multiple shimmer placeholders (useful for lists).
 *
 * @example
 * ```tsx
 * <ShimmerGroup count={3} width={200} height={30} />
 * ```
 */
export const ShimmerGroup: React.FC<ShimmerProps & { count?: number; spacing?: number }> = ({
  count = 3,
  spacing = theme.spacing.md,
  ...shimmerProps
}) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <View key={index} style={{ marginBottom: index < count - 1 ? spacing : 0 }}>
            <Shimmer {...shimmerProps} />
          </View>
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.components.shimmer.container,
  },
  shimmer: {
    width: '50%',
    height: '100%',
    ...theme.components.shimmer.effect,
  },
});

export default Shimmer;
