import Card from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { useNotifications } from '@/context/notificationContext';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const DAYS_7 = 7;
const DAYS_30 = 30;

const NotificationScreen = () => {
  const [days, setDays] = useState(DAYS_7);

  const { notifications, markAllAsRead, markAsRead, loadNotifications } =
    useNotifications();

  // Refresh notifications whenever this screen becomes active
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await loadNotifications();
        await markAllAsRead();
      };

      init();
    }, []),
  );
  // Filter notifications by selected range (7 or 30 days)
  const filteredNotifications = useMemo(() => {
    const fromDate = Date.now() - days * 24 * 60 * 60 * 1000;

    return notifications.filter((item) => item.timestamp >= fromDate);
  }, [notifications, days]);

  const onPressNotification = (item: any) => {
    const p = item.product;
    markAsRead(item.id);
    router.replace({
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

  const renderItem = ({ item }: { item: any }) => {
    const image = item.product?.images?.[0]?.src;

    return (
      <Pressable onPress={() => onPressNotification(item)}>
        <Card variant='default' style={styles.card}>
          <View style={styles.imageWrapper}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.fallbackCircle}>
                <Text style={styles.fallbackText}>V</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={1}>
                {item.product?.name || 'New Product'}
              </Text>
              <Text style={styles.date}>
                {new Date(item.timestamp).toDateString()}
              </Text>
            </View>

            <Text style={styles.message} numberOfLines={2}>
              A new product has been added to the catalog.
            </Text>
          </View>
          {!item.isRead && <View style={styles.unreadDot} />}
        </Card>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNotifications}
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
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.semantic.info,
    marginLeft: theme.spacing.sm,
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
    marginTop: theme.spacing.xs,
  },

  message: {
    marginTop: theme.spacing.xs,
    ...theme.typography.small,
    color: theme.colors.text.secondary,
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
