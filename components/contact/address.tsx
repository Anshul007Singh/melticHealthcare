import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Address() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address</Text>

      <View style={styles.row}>
        <Ionicons
          name='location-outline'
          size={24}
          color='white'
          style={styles.icon}
        />
        <Text style={styles.text}>
          Plot no 344, Industrial Area, Phase 2, HSIIDC, Alipur, Barwala,
          Panchkula, Haryana 134118
        </Text>
      </View>

      <View style={styles.row}>
        <Ionicons
          name='call-outline'
          size={24}
          color='white'
          style={styles.icon}
        />
        <Text style={styles.text}>+91 92162 95095</Text>
      </View>

      <View style={styles.row}>
        <Ionicons
          name='mail-outline'
          size={24}
          color='white'
          style={styles.icon}
        />
        <Text style={styles.text}>hcareindia@gmail.com</Text>
      </View>

      <View style={styles.row}>
        <Ionicons
          name='link-outline'
          size={24}
          color='white'
          style={styles.icon}
        />
        <Text style={styles.text}>hcareindia.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(171, 127, 233, 0.89)',
    padding: 20,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
  },
});
