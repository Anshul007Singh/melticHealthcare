import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchProducts } from '@/data/productList';

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

      // Only new products created in the last 7 days
      if (createdAt >= oneWeekAgo && !previousProducts.current.has(prod.id)) {
        newNotifs.push({
          id: `${prod.id}-new`,
          title: 'New product added',
          description: prod.name,
          date: new Date(prod.date_created).toLocaleString(),
          timestamp: createdAt,
          icon: 'plus-box',
          color: '#4CAF50',
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
        <MaterialCommunityIcons name={item.icon} size={22} color='#fff' />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#999' }}>
          No new products in the last 7 days
        </Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default NotificationScreen;
