import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

export default function SplashScreen({ onFinish }: any) {
  const logos = [
    require('../../assets/images/meltic-ml.png'),
    require('../../assets/images/adchem-ad.png'),
    require('../../assets/images/dalcon-dl.png'),
    require('../../assets/images/cardic-cd.png'),
    require('../../assets/images/melvet-mv.png'),
    require('../../assets/images/mivika-mv.png'),
  ];

  const screenHeight = Dimensions.get('window').height;
  const spacing = screenHeight / (logos.length + 1);

  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);

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
          setIndex(indexRef.current);
          animateLogo();
        } else {
          onFinish?.();
        }
      });
    };

    animateLogo();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={logos[index]}
        style={[
          styles.logo,
          {
            top: spacing * (index + 1) - 100,
            opacity,
          },
        ]}
        resizeMode='contain'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0060AA',
    width: '100%',
  },
  logo: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});
