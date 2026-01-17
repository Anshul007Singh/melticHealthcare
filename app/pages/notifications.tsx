import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { fetchProducts } from '@/data/productList';
import { theme } from '@/constants/theme';

type NotificationType = {
  id: string;
  product: any;
  title: string;
  message: string;
  date: string;
  timestamp: number;
};

const DAYS_7 = 7;
const DAYS_30 = 30;

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [days, setDays] = useState(DAYS_7);

  useEffect(() => {
    loadNotifications(days);
  }, [days]);

  const loadNotifications = async (range: number) => {
    const products = await fetchProducts();
    const fromDate = Date.now() - range * 24 * 60 * 60 * 1000;
    const list: NotificationType[] = products
      .filter((p: any) => new Date(p.date_created).getTime() >= fromDate)
      .map((p: any) => ({
        id: `product-${p.id}`,
        product: p,
        title: p.name,
        date: new Date(p.date_created).toDateString(),
        timestamp: new Date(p.date_created).getTime(),
      }))
      .sort(
        (a: NotificationType, b: NotificationType) => b.timestamp - a.timestamp,
      );
    setNotifications(list);
  };

  const onPressNotification = (item: NotificationType) => {
    setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    const p = item.product;

    router.push({
      pathname: '/pages/productDetail',
      params: {
        id: p.id,
        title: p.name,
        img: p.images?.[0]?.src || '',
        category: p.categories?.[0]?.name || '',
        description: p.description,
        price: p.price,
        sku: p.sku,
        shortDescription: p.short_description,
        sideEffects: p.side_effects,
        indications: p.indications,
      },
    });
  };

  const renderItem = ({ item }: { item: NotificationType }) => {
    const image = item.product?.images?.[0]?.src;

    return (
      <Pressable onPress={() => onPressNotification(item)}>
        <View style={styles.card}>
          <View style={styles.imageWrapper}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.fallbackCircle}>
                <Text style={styles.fallbackText}>V.</Text>
              </View>
            )}
          </View>

          {/* Text */}
          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>

            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>
          </View>

          {/* Unread Dot */}
          <View style={styles.unreadDot} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications available</Text>
        }
      />

      {days === DAYS_7 && (
        <Pressable
          style={styles.missingContainer}
          onPress={() => setDays(DAYS_30)}
        >
          <Text style={styles.missingText}>Missing notifications?</Text>
          <Text style={styles.missingLink}>
            Go to historical notifications.
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 14,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  imageWrapper: {
    marginRight: 12,
  },

  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  fallbackCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f4b6c2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fallbackText: {
    fontWeight: '700',
  },

  content: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    fontWeight: '700',
    fontSize: 14,
    maxWidth: '75%',
  },

  date: {
    fontSize: 12,
    color: '#666',
  },

  message: {
    marginTop: 4,
    fontSize: 13,
    color: '#444',
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1da1f2',
    marginLeft: 8,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 120,
    color: '#999',
  },

  missingContainer: {
    paddingVertical: 18,
    alignItems: 'center',
  },

  missingText: {
    color: '#666',
    fontSize: 13,
  },

  missingLink: {
    color: '#1da1f2',
    fontWeight: '600',
    marginTop: 4,
  },
});
