import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as Updates from 'expo-updates';

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import { logoutUser } from '@/api/auth';
import { getStoredUserInfo } from '@/api/auth';
import { useAuth } from '@/context/authContext';

export default function CustomDrawerContent(props: any) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const { logout } = useAuth();
  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await getStoredUserInfo();
      setUserInfo(data);
    };
    loadUserInfo();
  }, []);
  const notificationHandler = () => {
    router.push('/pages/notifications');
  };

  const kycHandler = () => {
    router.push('/contact');
  };

  const myAccountHandler = () => {
    router.push('/pages/profile');
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err),
    );
  };
  const handleLogout = async () => {
    router.push('/screens/login');
    // Alert.alert(
    //   'Logout',
    //   'Are you sure you want to logout?',
    //   [
    //     { text: 'Cancel', style: 'cancel' },
    //     {
    //       text: 'Logout',
    //       style: 'destructive',
    //       onPress: async () => {
    //         await logout();
    //         await logoutUser();
    //         await Updates.reloadAsync();
    //       },
    //     },
    //   ],
    //   { cancelable: true },
    // );
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileSection}>
        <Ionicons name='person-circle-outline' size={48} color='#0060AA' />
        <View style={styles.profileText}>
          <Text style={styles.profileName}>
            {userInfo?.name ?? 'Unknown User'}
          </Text>
          <Text style={styles.profilePhone}>
            {userInfo?.email ?? 'Unknown Email'}
          </Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      <MenuItem icon='home-outline' label='Home' href='/home' />
      <MenuItem
        icon='account-outline'
        label='My Account'
        href=''
        onPress={myAccountHandler}
      />
      <MenuItem icon='percent' label='KYC Details' href='/pages/kycDetails' />

      <MenuItem
        icon='bell-outline'
        label='Notification'
        href='/notifications'
        onPress={notificationHandler}
      />

      <MenuItem
        icon='headset'
        label='Customer Support'
        href='/contact'
        onPress={kycHandler}
      />
      <MenuItem
        icon='power'
        label='Logout'
        onPress={handleLogout}
        href={undefined}
      />
      <MenuItem
        icon='shield-account'
        label='Privacy Policy'
        href='/pages/privacyPolicy'
      />
      <MenuItem
        icon='file-document-outline'
        label='Terms and Conditions'
        href='/pages/termsAndConditions'
      />
    </DrawerContentScrollView>
  );
}

function MenuItem({
  icon,
  label,
  href,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  href: any;
  onPress?: () => void;
}) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(href);
    }
  };

  return (
    <TouchableOpacity style={styles.menuItem} onPress={handlePress}>
      <MaterialCommunityIcons name={icon} size={22} color='#0060AA' />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profilePhone: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  footerLink: {
    color: '#0060AA',
    fontSize: 14,
  },
  footerSeparator: {
    color: '#0060AA',
    fontSize: 14,
  },
});
function reloadApp() {
  throw new Error('Function not implemented.');
}
