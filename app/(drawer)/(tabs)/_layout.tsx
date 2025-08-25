import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Tabs, useNavigation } from 'expo-router';
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
        tabBarActiveTintColor: '#B5DE00',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#0060AA',
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
              <FontAwesome name='th-large' size={size} color={color} />
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
