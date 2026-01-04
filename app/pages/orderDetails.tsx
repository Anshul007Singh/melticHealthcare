import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredUserInfo } from '@/api/auth';

/* ================= CONFIG ================= */

const BASE_URL = 'https://www.melticgroup.com/online/wp-json/wc/v3/orders';
const CONSUMER_KEY = 'ck_8ed576e4b09fbadb918a2360c252064763a5a1d8';
const CONSUMER_SECRET = 'cs_55439183c9806d1a0ac32052649eeb8d6d387bc0';

type WooOrder = {
  id: number;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  billing?: {
    email?: string;
  };
};

/* ================= STATUS CONFIG ================= */

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'Pending Payment', bg: '#FFF7ED', text: '#C2410C' },
  'on-hold': { label: 'On Hold', bg: '#FEF3C7', text: '#92400E' },
  processing: { label: 'Processing', bg: '#E0F2FE', text: '#0369A1' },
  completed: { label: 'Completed', bg: '#DCFCE7', text: '#166534' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B' },
  failed: { label: 'Failed', bg: '#FCA5A5', text: '#7F1D1D' },
  refunded: { label: 'Refunded', bg: '#EDE9FE', text: '#5B21B6' },
};

const OrderStatusScreen: React.FC = () => {
  const [orders, setOrders] = useState<WooOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  /* ================= HELPERS ================= */

  const formatISO = (date: Date, endOfDay = false) => {
    const d = new Date(date);
    endOfDay ? d.setHours(23, 59, 59, 999) : d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };

  /* ================= API ================= */

  const fetchOrders = useCallback(async () => {
    if (!userEmail) return;

    try {
      setLoading(true);
      setError(null);

      const params: any = {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        per_page: 50,
        orderby: 'date',
        order: 'desc',
      };

      if (fromDate) params.after = formatISO(fromDate);
      if (toDate) params.before = formatISO(toDate, true);

      const res = await axios.get<WooOrder[]>(BASE_URL, { params });

      // 🔥 EMAIL FILTER (CLIENT SIDE)
      const filteredOrders = res.data.filter(
        (order) =>
          order.billing?.email?.toLowerCase() === userEmail.toLowerCase(),
      );

      setOrders(filteredOrders);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, userEmail]);

  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await getStoredUserInfo();

      setUserEmail(data?.email || null);
    };
    loadUserInfo();
  }, []);

  useEffect(() => {
    if (userEmail) fetchOrders();
  }, [userEmail, fetchOrders]);

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] ?? {
      label: status,
      bg: '#E5E7EB',
      text: '#374151',
    };

    return (
      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: WooOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <Text>{new Date(item.date_created).toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.amount}>
          {item.currency} {item.total}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <TouchableOpacity onPress={fetchOrders}>
          <Text style={styles.refresh}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* DATE FILTER */}
      <View style={styles.filterBox}>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowFromPicker(true)}
        >
          <Text>{fromDate ? fromDate.toDateString() : 'From Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowToPicker(true)}
        >
          <Text>{toDate ? toDate.toDateString() : 'To Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyBtn} onPress={fetchOrders}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate ?? new Date()}
          mode='date'
          onChange={(_, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate ?? new Date()}
          mode='date'
          onChange={(_, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrderItem}
          ListEmptyComponent={
            <Text style={styles.center}>No orders found</Text>
          }
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </SafeAreaView>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  title: { fontSize: 18, fontWeight: '700' },
  filterBox: { flexDirection: 'row', gap: 8, padding: 12 },
  dateBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  applyBtn: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#0060AA',
  },
  applyText: { color: '#fff', fontWeight: '600' },
  orderCard: {
    margin: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: { fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  label: { color: '#6B7280' },
  amount: { fontWeight: '700' },
  refresh: { color: '#2563EB', fontWeight: '600' },
  center: { textAlign: 'center', marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default OrderStatusScreen;
