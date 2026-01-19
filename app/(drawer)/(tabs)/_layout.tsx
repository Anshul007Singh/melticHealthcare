import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const handleProductListPress = () => {
    router.push({
      pathname: '/[productlist]',
      params: { query: 'productlist', productlist: 'productlist' },
    });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.neutral.gray600,

        tabBarStyle: {
          backgroundColor: theme.colors.primary.light,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 12), // 🔥 KEY FIX
          height: 56 + Math.max(insets.bottom, 12), // 🔥 AUTO HEIGHT
        },

        tabBarLabelStyle: {
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
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
              <Ionicons name='bookmarks' size={size} color={color} />
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
            <Ionicons name='id-card-sharp' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
