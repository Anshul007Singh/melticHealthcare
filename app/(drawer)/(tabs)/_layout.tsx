import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const handleProductListPress = () => {
    router.push({
      pathname: '/[productlist]',
      params: { query: 'productlist', productlist: 'productlist' },
    });
  };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary.main,  // Changed from #fff for theme consistency
        tabBarInactiveTintColor: theme.colors.neutral.gray600,  // Improved contrast ratio (4.6:1)
        tabBarStyle: {
          backgroundColor: theme.colors.primary.light,  // Changed from #0060AA for theme consistency
          height: 75,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='home' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='[productlist]'
        options={{
          title: 'Products',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TouchableOpacity onPress={handleProductListPress}>
              <FontAwesome name='archive' size={size} color={color} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name='contact'
        options={{
          title: 'Contact',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='address-book' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
