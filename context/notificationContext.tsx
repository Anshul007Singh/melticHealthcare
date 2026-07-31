import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchProducts } from '@/data/productList';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LAST_READ_KEY = 'lastNotificationReadTime';
const READ_NOTIFICATION_IDS_KEY = 'readNotificationIds';

type NotificationItem = {
  id: string;
  product: any;
  timestamp: number;
  isRead: boolean;
};

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // const markAllAsRead = async () => {
  //   await AsyncStorage.setItem(LAST_READ_KEY, Date.now().toString());

  //   setUnreadCount(0);
  // };
  const markAllAsRead = async () => {
    if (notifications.length > 0) {
      await AsyncStorage.setItem(
        LAST_READ_KEY,
        notifications[0].timestamp.toString(),
      );
    }

    setUnreadCount(0);
  };

  const loadNotifications = async () => {
    const value = await AsyncStorage.getItem(READ_NOTIFICATION_IDS_KEY);

    const readIds = value ? JSON.parse(value) : [];
    const products = await fetchProducts();

    const fromDate = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const list = products
      .filter((p: any) => new Date(p.date_created).getTime() >= fromDate)
      .map((p: any) => {
        const timestamp = new Date(p.date_created).getTime();

        return {
          id: `product-${p.id}`,
          product: p,
          timestamp,
          isRead: readIds.includes(`product-${p.id}`),
        };
      })
      .sort((a: any, b: any) => b.timestamp - a.timestamp);

    const lastRead = await AsyncStorage.getItem(LAST_READ_KEY);

    const lastReadTime = lastRead ? Number(lastRead) : 0;
    const unread = list.filter(
      (item: { timestamp: number }) => item.timestamp > lastReadTime,
    );

    setUnreadCount(unread.length);
    setNotifications(list);
    setUnreadCount(list.filter((item: { isRead: any }) => !item.isRead).length);
  };

  const markAsRead = async (id: string) => {
    const value = await AsyncStorage.getItem(READ_NOTIFICATION_IDS_KEY);

    const readIds = value ? JSON.parse(value) : [];

    if (!readIds.includes(id)) {
      readIds.push(id);

      await AsyncStorage.setItem(
        READ_NOTIFICATION_IDS_KEY,
        JSON.stringify(readIds),
      );
    }

    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loadNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
