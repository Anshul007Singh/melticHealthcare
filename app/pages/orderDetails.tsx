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
import { getAuthHeader } from '@/api/auth';
import { ENV } from '@/config/environment';

/* ================= CONFIG ================= */

const API_URL = ENV.API_URL;

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

  /* ================= HELPERS ================= */

  const formatISO = (date: Date, endOfDay = false) => {
    const d = new Date(date);
    endOfDay ? d.setHours(23, 59, 59, 999) : d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };

  /* ================= API ================= */

  /**
   * Fetch orders for the authenticated user
   *
   * SECURITY FIX: Orders are now filtered server-side by the authenticated user.
   * The backend /my-orders endpoint must verify JWT and return only the user's orders.
   *
   * Backend Requirements:
   * - Verify JWT authentication
   * - Filter orders by authenticated user's email server-side
   * - Support date range filtering (after/before params)
   * - Return only the authenticated user's orders (CRITICAL)
   */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const authHeader = await getAuthHeader();

      if (!authHeader.Authorization) {
        setError('Please log in to view your orders');
        return;
      }

      const params: any = {
        per_page: 50,
        orderby: 'date',
        order: 'desc',
      };

      if (fromDate) params.after = formatISO(fromDate);
      if (toDate) params.before = formatISO(toDate, true);

      // Server-side filtering by authenticated user - no client-side filtering needed
      const res = await axios.get<WooOrder[]>(`${API_URL}/my-orders`, {
        params,
        headers: authHeader,
        timeout: 30000, // 30 second timeout
      });

      setOrders(res.data);
    } catch (err: any) {
      console.error('Fetch orders error:', err);

      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Order service is currently unavailable. Please contact support.');
      } else {
        setError(err?.message ?? 'Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
