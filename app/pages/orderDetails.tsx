import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getStoredUserInfo } from '@/api/auth';
import { theme } from '@/constants/theme';
import { Button, Typography, H3, EmptyState, ErrorCard, Shimmer } from '@/components/ui';

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
  pending: { label: 'Pending Payment', bg: theme.colors.semantic.warningBackground, text: theme.colors.semantic.warning },
  'on-hold': { label: 'On Hold', bg: theme.colors.semantic.warningBackground, text: theme.colors.semantic.warning },
  processing: { label: 'Processing', bg: theme.colors.semantic.infoBackground, text: theme.colors.semantic.info },
  completed: { label: 'Completed', bg: theme.colors.semantic.successBackground, text: theme.colors.semantic.success },
  cancelled: { label: 'Cancelled', bg: theme.colors.semantic.errorBackground, text: theme.colors.semantic.error },
  failed: { label: 'Failed', bg: theme.colors.semantic.errorBackground, text: theme.colors.semantic.error },
  refunded: { label: 'Refunded', bg: theme.colors.neutral.gray100, text: theme.colors.text.secondary },
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
      bg: theme.colors.neutral.gray200,
      text: theme.colors.text.secondary,
    };

    return (
      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
        <Typography variant="caption" style={{ color: cfg.text, fontWeight: '600' }}>
          {cfg.label}
        </Typography>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: WooOrder }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Typography variant="bodyBold" style={styles.orderId}>
          Order #{item.id}
        </Typography>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.row}>
        <Typography variant="small" style={styles.label}>
          Date
        </Typography>
        <Typography variant="small">
          {new Date(item.date_created).toLocaleString()}
        </Typography>
      </View>

      <View style={styles.row}>
        <Typography variant="small" style={styles.label}>
          Total
        </Typography>
        <Typography variant="bodyBold" style={styles.amount}>
          {item.currency} {item.total}
        </Typography>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <H3>My Orders</H3>
        <TouchableOpacity
          onPress={fetchOrders}
          accessibilityRole="button"
          accessibilityLabel="Refresh orders"
          accessibilityHint="Double tap to reload order list"
        >
          <Typography variant="bodyBold" style={styles.refresh}>
            Refresh
          </Typography>
        </TouchableOpacity>
      </View>

      {/* DATE FILTER */}
      <View style={styles.filterBox}>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowFromPicker(true)}
          accessibilityRole="button"
          accessibilityLabel={fromDate ? `From date: ${fromDate.toDateString()}` : 'Select from date'}
          accessibilityHint="Double tap to select start date for filtering"
        >
          <Typography variant="small">
            {fromDate ? fromDate.toDateString() : 'From Date'}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowToPicker(true)}
          accessibilityRole="button"
          accessibilityLabel={toDate ? `To date: ${toDate.toDateString()}` : 'Select to date'}
          accessibilityHint="Double tap to select end date for filtering"
        >
          <Typography variant="small">
            {toDate ? toDate.toDateString() : 'To Date'}
          </Typography>
        </TouchableOpacity>

        <Button
          variant="primary"
          size="small"
          onPress={fetchOrders}
          style={styles.applyBtn}
          accessibilityLabel="Apply date filter"
          accessibilityHint="Double tap to filter orders by selected date range"
        >
          Apply
        </Button>
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

      {error && (
        <ErrorCard
          message={error}
          onRetry={fetchOrders}
        />
      )}

      {loading ? (
        <View style={styles.shimmerContainer}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.shimmerCard}>
              <Shimmer width="100%" height={120} borderRadius={theme.borderRadius.lg} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrderItem}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="No Orders Yet"
              message="You haven't placed any orders. Start shopping to see your orders here."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  filterBox: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  dateBtn: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    minHeight: 44,
  },
  applyBtn: {
    paddingHorizontal: theme.spacing.md,
  },
  orderCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  orderId: {},
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text.secondary,
  },
  amount: {},
  refresh: {
    color: theme.colors.primary.main,
  },
  shimmerContainer: {
    padding: theme.spacing.md,
  },
  shimmerCard: {
    marginBottom: theme.spacing.md,
  },
});

export default OrderStatusScreen;
