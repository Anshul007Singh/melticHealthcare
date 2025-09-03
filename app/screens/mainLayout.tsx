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
  Image,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import CustomDrawerContent from '@/components/drawerContent';
import { router } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import type { DrawerNavigationOptions } from '@react-navigation/drawer';
import { useCart } from '@/context/cartContext';

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const screenWidth = Dimensions.get('window').width;

  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  const checkUser = async () => {
    router.push('/cart');
  };

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
        <Ionicons name='menu' size={34} color={'white'} />
      </Pressable>
    ),
    headerTitle: () => (
      <View
        style={{
          alignItems: 'center',
          marginLeft: 80,
        }}
      >
        <Text style={styles.brandName}>Meltic Group</Text>
      </View>
    ),
    headerRight: () => (
      <Pressable onPress={checkUser} style={{ marginRight: 15, marginTop: 10 }}>
        <View style={{ position: 'relative' }}>
          <Ionicons name='cart-outline' size={34} color='white' />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </Pressable>
    ),
  });

  const renderHeaderWithBack = () => ({
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: 'black',
    headerTitleAlign: 'center',
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name='arrow-back' size={24} color='black' />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <Pressable onPress={checkUser} style={{ marginRight: 15, marginTop: 10 }}>
        <View style={{ position: 'relative' }}>
          <Ionicons name='cart-outline' size={34} />
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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer
          drawerContent={(props: any) => <CustomDrawerContent {...props} />}
          screenOptions={{
            drawerStyle: {
              width: screenWidth * 0.7,
            },
          }}
        >
          <Drawer.Screen
            name='(drawer)'
            options={({ navigation }) => ({
              drawerLabel: 'Home',
              title: 'Home',
              ...(renderHeaderWithDrawer(navigation) as any),
            })}
          />
          {[
            { name: 'cart', title: 'Cart' },
            { name: 'category', title: 'Category' },
            { name: 'productDetail', title: 'PCD Products' },
            { name: 'divisions', title: 'Our Divisions' },
            { name: 'notifications', title: 'Notifications' },
            { name: 'kycDetails', title: 'KYC Details' },
          ].map((screen) => (
            <Drawer.Screen
              key={screen.name}
              name={screen.name}
              options={{
                title: screen.title,
                ...(renderHeaderWithBack() as DrawerNavigationOptions),
                headerRight: () =>
                  screen.name === 'cart' ||
                  screen.name === 'kycDetails' ||
                  screen.name === 'notifications' ? null : (
                    <Pressable
                      onPress={checkUser}
                      style={{ marginRight: 15, marginTop: 10 }}
                    >
                      <View style={{ position: 'relative' }}>
                        <Ionicons name='cart-outline' size={34} />
                        {cartCount > 0 && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cartCount}</Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  ),
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
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
