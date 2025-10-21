import { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import Home from '@/container/home';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Drawer from 'expo-router/drawer';

export default function Index() {
  const goToCart = async () => {
    router.push('/cart');
  };
  const cartCount = 0;
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
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name='(drawer)' // 👈 this loads your /app/(drawer)/_layout.tsx and tabs
        options={({ navigation }: any) => ({
          drawerLabel: 'Home',
          title: 'Home',
          ...(renderHeaderWithDrawer(navigation) as any),
        })}
      />
      <Home />
    </Stack>
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
