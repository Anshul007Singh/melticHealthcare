import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Drawer } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SideDrawer = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnimation = useState(new Animated.Value(screenWidth))[0];

  const toggleDrawer = () => {
    if (drawerVisible) {
      Animated.timing(drawerAnimation, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setDrawerVisible(false));
    } else {
      setDrawerVisible(true);
      Animated.timing(drawerAnimation, {
        toValue: screenWidth * 0.75,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const closeDrawer = () => {
    if (drawerVisible) {
      toggleDrawer();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.hamburger}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </TouchableOpacity>

      {drawerVisible && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.drawer, { left: drawerAnimation }]}>
              <Ionicons name='camera-outline' size={40} />
              <Text>Camera</Text>
              <Ionicons name='trash-outline' size={40} />
              <Text>Delete</Text>
              <Ionicons name='mail-outline' size={40} />
              <Text>Contact</Text>
              <Ionicons name='file-tray-outline' size={40} />
              <Text>Inbox</Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  hamburger: {
    padding: theme.spacing.lg,
    alignSelf: 'flex-end',
    marginRight: theme.spacing.xl,
  },
  line: {
    width: 30,
    height: 3,
    backgroundColor: theme.colors.text.primary,
    marginVertical: theme.spacing.xs,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: theme.colors.background.overlay,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: screenWidth * 0.75,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
    gap: theme.spacing.xl,
  },
  drawerText: {
    ...theme.typography.body,
    marginVertical: theme.spacing.lg,
    color: theme.colors.text.secondary,
  },
});

export default SideDrawer;
