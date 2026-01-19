import { theme } from '@/constants/theme';
import { fetchProducts } from '@/data/productList';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
                <Text style={styles.fallbackText}>V</Text>
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
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary.lighter,
  },

  imageWrapper: {
    marginRight: theme.spacing.md,
  },

  image: {
    width: theme.layout.bottomTabHeight,
    height: theme.layout.bottomTabHeight,
    borderRadius: theme.borderRadius.md,
  },

  fallbackCircle: {
    width: theme.layout.minTouchTarget,
    height: theme.layout.minTouchTarget,
    borderRadius: theme.layout.minTouchTarget / 2,
    backgroundColor: theme.colors.primary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fallbackText: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
  },

  content: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
  },

  title: {
    ...theme.typography.smallBold,
    color: theme.colors.text.primary,
    maxWidth: '75%',
  },

  date: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },

  message: {
    marginTop: theme.spacing.xs,
    ...theme.typography.small,
    color: theme.colors.text.secondary,
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.semantic.info,
    marginLeft: theme.spacing.sm,
  },

  emptyText: {
    ...theme.typography.body,
    textAlign: 'center',
    marginTop: 120,
    color: theme.colors.text.tertiary,
  },

  missingContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },

  missingText: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
  },

  missingLink: {
    ...theme.typography.smallBold,
    color: theme.colors.text.link,
    marginTop: theme.spacing.xs,
  },
});
