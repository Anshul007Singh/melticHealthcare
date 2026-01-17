import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchProducts } from '@/data/productList';
import { theme } from '@/constants/theme';
import { Typography, EmptyState } from '@/components/ui';

type NotificationType = {
  id: string;
  title: string;
  description: string;
  date: string; // formatted
  timestamp: number; // for filtering
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const previousProducts = useRef<Set<number>>(new Set()); // track seen product IDs

  const detectNewProducts = (newProducts: any[]) => {
    const newNotifs: NotificationType[] = [];
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    newProducts.forEach((prod) => {
      const createdAt = new Date(prod.date_created).getTime();

      if (createdAt >= oneWeekAgo && !previousProducts.current.has(prod.id)) {
        newNotifs.push({
          id: `${prod.id}-new`,
          title: 'New product added',
          description: prod.name,
          date: new Date(prod.date_created).toLocaleString(),
          timestamp: createdAt,
          icon: 'plus-box',
          color: theme.colors.semantic.success,
        });

        previousProducts.current.add(prod.id);
      }
    });

    if (newNotifs.length > 0) {
      setNotifications((prev) => {
        const merged = [...newNotifs, ...prev];
        return merged.slice(0, 10); // ✅ keep only the latest 10
      });
    }
  };

  useEffect(() => {
    const fetchAndCheck = async () => {
      const products = await fetchProducts();
      if (products) {
        detectNewProducts(products);
      }
    };

    fetchAndCheck();
    const interval = setInterval(fetchAndCheck, 300000); // every 5 mins
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }: { item: NotificationType }) => (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <MaterialCommunityIcons name={item.icon} size={22} color={theme.colors.background.primary} />
      </View>
      <View style={styles.textContainer}>
        <Typography variant="bodyBold" style={styles.title}>
          {item.title}
        </Typography>
        <Typography variant="small" style={styles.description}>
          {item.description}
        </Typography>
        <Typography variant="caption" style={styles.date}>
          {item.date}
        </Typography>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="No Notifications"
          message="No new products have been added in the last 7 days. Check back later for updates!"
        />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  date: {
    color: theme.colors.text.tertiary,
  },
});

export default NotificationScreen;
