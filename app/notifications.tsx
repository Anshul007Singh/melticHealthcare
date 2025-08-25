import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NotificationType = {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

const notifications: NotificationType[] = [
  {
    id: '1',
    title: 'Prescription reminder',
    description: 'It’s time to take your medication',
    date: '10:30 AM',
    icon: 'bell-alert',
    color: '#F44336', // red
  },
  {
    id: '2',
    title: 'Prescription ready',
    description: 'Your prescription is ready for pickup',
    date: 'Yesterday',
    icon: 'pill',
    color: '#2196F3', // blue
  },
  {
    id: '3',
    title: 'New prescription benefit',
    description: 'Check your new prescription benefits',
    date: 'July 20',
    icon: 'cash',
    color: '#4CAF50', // green
  },
  {
    id: '4',
    title: 'Medication update',
    description: 'Read about the latest updates for your medication',
    date: 'July 18',
    icon: 'information',
    color: '#FFC107', // yellow
  },
];

const NotificationScreen = () => {
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
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000',
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
