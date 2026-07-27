import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchProducts } from '@/data/productList';

type NotificationItem = {
  id: string;
  product: any;
  timestamp: number;
};

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
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

  const loadNotifications = async () => {
    const products = await fetchProducts();

    const fromDate = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const list = products
      .filter((p: any) => new Date(p.date_created).getTime() >= fromDate)
      .map((p: any) => ({
        id: `product-${p.id}`,
        product: p,
        timestamp: new Date(p.date_created).getTime(),
      }))
      .sort((a: any, b: any) => b.timestamp - a.timestamp);

    setNotifications(list);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
        unreadCount: notifications.length,
        loadNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
