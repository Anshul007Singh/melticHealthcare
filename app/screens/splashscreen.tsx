import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Image } from 'react-native';

export default function SplashScreen({ onFinish }: any) {
  // Add your 5 logos here
  const logos = [
    require('../../assets/images/logo.png'),
    require('../../assets/images/logo.png'),
    require('../../assets/images/logo.png'),
    require('../../assets/images/logo.png'),
    require('../../assets/images/logo.png'),
  ];

  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let current = 0;

    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300, // fade in
          useNativeDriver: true,
        }),
        Animated.delay(400), // stay visible for 0.4 sec
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300, // fade out
          useNativeDriver: true,
        }),
      ]).start(() => {
        current++;

        if (current < logos.length) {
          setIndex(current);
          animate(); // next logo
        } else {
          if (onFinish) onFinish(); // finish splash
        }
      });
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={logos[index]}
        style={[styles.logo, { opacity }]}
        resizeMode='contain'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0060AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
