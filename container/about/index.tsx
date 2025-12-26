import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function SplashScreen({ onFinish }: any) {
  const logos = [
    require('../../assets/images/meltic-ml.png'),
    require('../../assets/images/adchem-ad.png'),
    require('../../assets/images/cardic-cd.png'),
    require('../../assets/images/dalcon-dl.png'),
    require('../../assets/images/melvet-mv.png'),
  ];

  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0); // internal counter

  useEffect(() => {
    const animateLogo = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        indexRef.current++;

        if (indexRef.current < logos.length) {
          setIndex(indexRef.current); // safe, no loop
          animateLogo();
        } else {
          onFinish?.();
        }
      });
    };

    animateLogo();
  }, []); // 👈 RUN ONLY ONCE (THIS FIXES THE ERROR)

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
