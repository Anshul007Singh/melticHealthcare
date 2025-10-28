import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  DrawerActions,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import {
  Dimensions,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomDrawerContent from '@/components/drawerContent';
import { router } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import type { DrawerNavigationOptions } from '@react-navigation/drawer';
import { useCart } from '@/context/cartContext';
import Home from './(drawer)/(tabs)/home';

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const screenWidth = Dimensions.get('window').width;
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  const goToCart = async () => {
    router.push('/pages/cart');
  };

  // ✅ Header style when Drawer menu is available
  const renderHeaderWithDrawer = (navigation: any) => ({
    headerStyle: {
      backgroundColor: '#0060AA',
    },
    headerTintColor: 'white',
    headerLeft: () => (
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name='menu' size={30} color='white' />
      </Pressable>
    ),
    headerTitle: () => (
      <View style={{ alignItems: 'center', marginLeft: 60 }}>
        <Text style={styles.brandName}>Meltic Group</Text>
      </View>
    ),
    headerRight: () => (
      <Pressable onPress={goToCart} style={{ marginRight: 15, marginTop: 6 }}>
        <View style={{ position: 'relative' }}>
          <Ionicons name='cart-outline' size={28} color='white' />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </Pressable>
    ),
  });

  // ✅ Header style with back button
  const renderHeaderWithBack = () => ({
    headerStyle: {
      backgroundColor: '#0060AA',
    },
    headerTintColor: '#fff',
    headerTitleAlign: 'center',
    headerTitleStyle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <Pressable onPress={goToCart} style={{ marginRight: 15, marginTop: 6 }}>
        <View style={{ position: 'relative' }}>
          <Ionicons name='cart-outline' size={28} color='white' />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </Pressable>
    ),
  });

  if (!loaded) return null;

  return (
    <PaperProvider>
      <ThemeProvider value={DefaultTheme}>
        <Drawer
          // ✅ Custom Drawer (Your existing styled drawer)
          drawerContent={(props: any) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerStyle: {
              width: screenWidth * 0.75,
            },
            headerShown: true,
          }}
        >
          {/* ✅ Main app drawer content */}
          <Drawer.Screen
            name='(drawer)' // 👈 this loads your /app/(drawer)/_layout.tsx and tabs
            options={({ navigation }) => ({
              drawerLabel: 'Home',
              title: 'Home',
              ...(renderHeaderWithDrawer(navigation) as any),
            })}
          />

          {/* ✅ Additional drawer-accessible routes */}
          {[
            { name: 'pages/cart', title: 'Cart' },
            { name: 'pages/category', title: 'Category' },
            { name: 'pages/productDetail', title: 'Product Details' },
            { name: 'pages/divisions', title: 'Our Divisions' },
            { name: 'pages/notifications', title: 'Notifications' },
            { name: 'pages/kycDetails', title: 'KYC Details' },
            { name: 'pages/profile', title: 'Profile' },
          ].map((screen) => (
            <Drawer.Screen
              key={screen.name}
              name={screen.name}
              options={{
                title: screen.title,
                ...(renderHeaderWithBack() as DrawerNavigationOptions),
              }}
            />
          ))}
        </Drawer>
      </ThemeProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  brandName: {
    color: 'white',
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
