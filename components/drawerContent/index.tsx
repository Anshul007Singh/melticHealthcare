import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as Updates from 'expo-updates';
import { useNotifications } from '@/context/notificationContext';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import { logoutUser } from '@/api/auth';
import { getStoredUserInfo } from '@/api/auth';
import { useAuth } from '@/context/authContext';
import { theme } from '@/constants/theme';

export default function CustomDrawerContent(props: any) {
  const { unreadCount, markAllAsRead } = useNotifications();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { logout } = useAuth();
  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await getStoredUserInfo();
      setUserInfo(data);
    };
    loadUserInfo();
  }, []);
  const notificationHandler = async () => {
    await markAllAsRead();
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
        <Ionicons
          name='person-circle-outline'
          size={48}
          color={theme.colors.primary.main}
        />
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
        icon='person-outline'
        label='My Account'
        href=''
        onPress={myAccountHandler}
      />
      {userInfo?.kyc === false && (
        <MenuItem
          icon='pricetag-outline'
          label='KYC Details'
          href='/pages/kycDetails'
        />
      )}

      <MenuItem
        icon='notifications-outline'
        label='Notification'
        href='/notifications'
        onPress={notificationHandler}
        badgeCount={unreadCount}
      />
      <MenuItem
        icon='cube-outline'
        label='Order Details'
        href='/pages/orderDetails'
      />

      <MenuItem
        icon='headset-outline'
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
        icon='shield-outline'
        label='Privacy Policy'
        href='/pages/privacyPolicy'
      />
      <MenuItem
        icon='document-text-outline'
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
  badgeCount = 0,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  href: any;
  onPress?: () => void;
  badgeCount?: number;
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
      <Ionicons name={icon} size={22} color={theme.colors.primary.main} />
      <Text style={styles.menuText}>{label}</Text>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
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
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -19,
    minWidth: 18,
    height: 20,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
function reloadApp() {
  throw new Error('Function not implemented.');
}
