import CustomDrawerContent from '@/components/drawerContent';
import { Badge } from '@/components/ui';
import { theme } from '@/constants/theme';
import { useCart } from '@/context/cartContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import type { DrawerNavigationOptions } from '@react-navigation/drawer';
import {
  DefaultTheme,
  DrawerActions,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

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
      backgroundColor: theme.colors.primary.main,
      borderWidth: 0,
    },
    headerTintColor: theme.colors.text.inverse,
    headerLeft: () => (
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={{ marginLeft: theme.spacing.lg }}
        accessibilityRole='button'
        accessibilityLabel='Open menu'
      >
        <Ionicons name='menu' size={30} color={theme.colors.primary.contrast} />
      </Pressable>
    ),
    headerTitleAlign: 'center',
    headerTitle: () => <Text style={styles.brandName}>Meltic Group</Text>,
    headerRight: () => (
      <Pressable
        onPress={goToCart}
        style={styles.cartButton}
        accessibilityRole='button'
        accessibilityLabel={`Shopping cart, ${cartCount} items`}
      >
        <View style={styles.cartIconContainer}>
          <Ionicons
            name='cart-outline'
            size={28}
            color={theme.colors.primary.contrast}
          />
          {cartCount > 0 && (
            <View style={styles.badgePosition}>
              <Badge count={cartCount} variant='error' />
            </View>
          )}
        </View>
      </Pressable>
    ),
  });
  // ✅ Header style with back button
  const renderHeaderWithBack = () => ({
    headerStyle: {
      backgroundColor: theme.colors.primary.main,
    },
    headerTintColor: theme.colors.primary.contrast,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      color: theme.colors.text.inverse,
      ...theme.typography.h4,
    },
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginLeft: theme.spacing.lg }}
        accessibilityRole='button'
        accessibilityLabel='Go back'
      >
        <Ionicons
          name='arrow-back'
          size={24}
          color={theme.colors.primary.contrast}
        />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <Pressable
        onPress={goToCart}
        style={styles.cartButton}
        accessibilityRole='button'
        accessibilityLabel={`Shopping cart, ${cartCount} items`}
      >
        <View style={styles.cartIconContainer}>
          <Ionicons
            name='cart-outline'
            size={28}
            color={theme.colors.primary.contrast}
          />
          {cartCount > 0 && (
            <View style={styles.badgePosition}>
              <Badge count={cartCount} variant='error' />
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
          {[
            { name: 'pages/cart', title: 'Cart' },
            { name: 'pages/category', title: 'Category' },
            { name: 'pages/productDetail', title: 'Product Details' },
            { name: 'pages/divisions', title: 'Our Divisions' },
            { name: 'pages/notifications', title: 'Notifications' },
            { name: 'pages/kycDetails', title: 'KYC Details' },
            { name: 'pages/profile', title: 'Profile' },
            { name: 'pages/termsAndConditions', title: 'Terms & Conditions' },
            { name: 'pages/privacyPolicy', title: 'Privacy Policy' },
            { name: 'pages/orderDetails', title: 'Order Details' },
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
  cartButton: {
    marginRight: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    minWidth: theme.layout.minTouchTarget,
    minHeight: theme.layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIconContainer: {
    // position: 'relative',
  },
  badgePosition: {
    position: 'absolute',
    right: -6,
    top: -4,
  },
  brandName: {
    color: theme.colors.text.inverse,
    ...theme.typography.h2,
    fontStyle: 'italic',
  },
});
