import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
// zhwq lahx kmlp zqcz  jmha rsfu fszz bkvl
export default function CustomDrawerContent(props: any) {
  const notificationHandler = () => {
    router.push('/notifications');
  };

  const kycHandler = () => {
    router.push('/contact');
  };

  // ✅ Function to open links safely
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err),
    );
  };

  //   service_id: 'service_9ir9p9q', // e.g. service_abcd123
  // template_id: 'template_drxjfm1', // e.g. template_xyz789
  // user_id: 'KYUex9lC2KtfXI9WC', // Public Key from EmailJS

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Ionicons name='person-circle-outline' size={48} color='#0060AA' />
        <View style={styles.profileText}>
          <Text style={styles.profileName}>Anshul</Text>
          <Text style={styles.profilePhone}>8219663876</Text>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Feather name='edit-2' size={16} color='#0060AA' />
        </TouchableOpacity>
      </View>

      <Divider style={styles.divider} />

      {/* Menu Items */}
      <MenuItem icon='home-outline' label='Home' href='/home' />
      <MenuItem icon='account-outline' label='My Account' href='/account' />
      <MenuItem icon='percent' label='Kyc Details' href='/kycDetails' />

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
      <MenuItem icon='power' label='Logout' href='/logout' />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => openLink('https://www.melticgroup.com/online')}
        >
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.footerSeparator}>|</Text>
        <TouchableOpacity
          onPress={() => openLink('https://www.melticgroup.com/about')}
        >
          <Text style={styles.footerLink}>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
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
  editIcon: {
    padding: 4,
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
