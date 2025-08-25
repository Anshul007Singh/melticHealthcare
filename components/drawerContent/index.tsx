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

export default function CustomDrawerContent(props: any) {
  const notificationHandler = () => {
    router.push('/notifications');
  };

  const kycHandler = () => {
    router.push('/kycDetails');
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
          <Text style={styles.profileName}>Anshul</Text>
          <Text style={styles.profilePhone}>8219663876</Text>
        </View>
        <TouchableOpacity style={styles.editIcon}>
          <Feather name='edit-2' size={16} color='#0060AA' />
        </TouchableOpacity>
      </View>

      <Divider style={styles.divider} />

      <MenuItem icon='home-outline' label='Home' href='/home' />
      <MenuItem icon='account-outline' label='My Account' href='/account' />
      <MenuItem
        icon='cube-outline'
        label='View / Manage Orders'
        href='/orders'
      />
      <MenuItem
        icon='monitor-screenshot'
        label='My Digital Visual Aid'
        href='/visual-aid'
      />
      <MenuItem icon='percent' label='Offers' href='/offers' />
      <MenuItem
        icon='calculator-variant-outline'
        label='PTR & PTS Calculator'
        href='/calculator'
      />
      <MenuItem icon='chart-bar' label='My Incentive' href='/incentive' />

      <MenuItem
        icon='bell-outline'
        label='Notification'
        href='/notifications'
        onPress={notificationHandler}
      />

      <MenuItem icon='headset' label='Customer Support' href='/kycDetails' />
      <MenuItem icon='power' label='Logout' href='/logout' />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => Linking.openURL('#')}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.footerSeparator}>|</Text>
        <TouchableOpacity onPress={() => Linking.openURL('#')}>
          <Text style={styles.footerLink}>Terms and Condition</Text>
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
