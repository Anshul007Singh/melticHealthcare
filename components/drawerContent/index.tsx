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
import { theme } from '@/constants/theme';

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
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            await logoutUser();
            await Updates.reloadAsync();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileSection}>
        <Ionicons name='person-circle-outline' size={48} color={theme.colors.primary.main} />
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
      {userInfo?.kyc === false && (
        <MenuItem icon='percent' label='KYC Details' href='/pages/kycDetails' />
      )}

      <MenuItem
        icon='bell-outline'
        label='Notification'
        href='/notifications'
        onPress={notificationHandler}
      />
      <MenuItem
        icon='truck-delivery'
        label='Order Details'
        href='/pages/orderDetails'
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
      <MaterialCommunityIcons name={icon} size={22} color={theme.colors.primary.main} />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
  },
  profilePhone: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  menuText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  footer: {
    marginTop: theme.spacing.huge,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xxxl,
  },
  footerLink: {
    color: theme.colors.primary.main,
    ...theme.typography.small,
  },
  footerSeparator: {
    color: theme.colors.primary.main,
    ...theme.typography.small,
  },
});
function reloadApp() {
  throw new Error('Function not implemented.');
}
