import { ErrorBoundary } from '@/components/ErrorBoundary';
import Carousel from '@/components/home/carousel';
import PremiumProducts from '@/components/home/categories';
import Divsions from '@/components/home/division/divsion';
import HighQualityProducts from '@/components/home/featureProducts';
import FooterCarousel from '@/components/home/footerCarousel';
import VisualAid from '@/components/home/visualAid';
import { SearchBar, SearchModal } from '@/components/search';
import { theme } from '@/constants/theme';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotifications } from '@/context/notificationContext';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { getBadgeCount, saveBadgeCount } from '@/utils/notificationStorage';

const Home = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const { unreadCount, markAllAsRead } = useNotifications();
  useEffect(() => {
    const loadBadge = async () => {
      const count = await getBadgeCount();
      setBadgeCount(count);
    };

    loadBadge();
  }, []);
  const handleSearchFocus = () => {
    setSearchModalVisible(true);
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Pressable onPress={handleSearchFocus} style={styles.search}>
          <SearchBar
            value=''
            onChangeText={() => {}}
            editable={false}
            placeholder='Search products, categories, brands...'
          />
        </Pressable>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Carousel />

          <VisualAid />

          <PremiumProducts />

          <HighQualityProducts />

          <Divsions />
          <FooterCarousel />
        </ScrollView>
        {badgeCount > 0 && (
          <Pressable
            style={styles.notificationButton}
            onPress={() => {
              markAllAsRead();
              router.push('/pages/notifications');
            }}
          >
            <MaterialCommunityIcons name='bell' size={28} color='#fff' />

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            </View>
          </Pressable>
        )}
        <SearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
        />
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  search: {
    backgroundColor: theme.colors.primary.light,
  },
  scrollContent: {
    paddingBottom: theme.spacing.huge,
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default Home;
