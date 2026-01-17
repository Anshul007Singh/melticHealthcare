import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/cartContext';
import { placeOrder } from '@/api/orders';
import { getStoredUserInfo } from '@/api/auth';
import CustomModal from '@/components/modal';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { Button, Card, Typography, H4, Body } from '@/components/ui';

export default function CartScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const { cartItems, removeFromCart, updateQuantity, emptyCart } = useCart();
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await getStoredUserInfo();
      setUserInfo(data);
    };
    loadUserInfo();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? 0 : 0;
  const discount = promoCode === 'SAVE10' ? 0.1 * subtotal : 0;
  const total = subtotal + deliveryFee - discount;

  // const onPlaceOrder = async () => {
  //   if (cartItems.length === 0) {
  //     setModalData({
  //       title: 'Empty Cart',
  //       message: 'Please add items to your cart before placing an order.',
  //       type: 'error',
  //     });
  //     setModalVisible(true);
  //     return;
  //   }
  //   console.log(userInfo);
  //   return;
  //   const orderData = {
  //     payment_method: 'bacs',
  //     payment_method_title: 'Direct Bank Transfer',
  //     set_paid: true,
  //     billing: {
  //       first_name: userInfo?.name || 'Unknown User',
  //       last_name: userInfo?.name || 'Unknown User',
  //       email: userInfo?.email || 'Unknown Email',
  //       phone: userInfo?.phone || '0000000000',
  //     },
  //     line_items: cartItems.map((item) => ({
  //       product_id: parseInt(item.id),
  //       quantity: item.quantity,
  //     })),
  //     meta_data: [
  //       {
  //         key: 'cart_summary',
  //         value: cartItems.map((item) => ({
  //           name: item.name,
  //           price: item.price,
  //           quantity: item.quantity,
  //         })),
  //       },
  //     ],
  //   };

  //   try {
  //     const data = await placeOrder(orderData);
  //     setModalData({
  //       title: 'Success',
  //       message: `Order placed successfully!\nOrder ID: ${data.id}`,
  //       type: 'success',
  //     });
  //     setModalVisible(true);
  //     emptyCart();
  //   } catch (error: any) {
  //     setModalData({
  //       title: 'Error',
  //       message: error.message || 'Something went wrong while placing order.',
  //       type: 'error',
  //     });
  //     setModalVisible(true);
  //   }
  // };
  const onPlaceOrder = async () => {
    if (cartItems.length === 0) {
      setModalData({
        title: 'Empty Cart',
        message: 'Please add items to your cart before placing an order.',
        type: 'error',
      });
      setModalVisible(true);
      return;
    }

    const storedUser = await getStoredUserInfo();
    if (!storedUser || !storedUser.kyc) {
      setModalData({
        title: 'KYC Required',
        message: 'Please complete your KYC before placing an order.',
        type: 'error',
      });
      setModalVisible(true);

      setTimeout(() => {
        router.push('/pages/kycDetails');
      }, 1200);

      return;
    }
    const orderData = {
      payment_method: 'bacs',
      payment_method_title: 'Direct Bank Transfer',
      set_paid: true,
      billing: {
        first_name: storedUser.name || 'Unknown User',
        last_name: storedUser.name || 'Unknown User',
        email: storedUser.email || 'Unknown Email',
        phone: storedUser.mobile || '0000000000',
      },
      line_items: cartItems.map((item) => ({
        product_id: parseInt(item.id),
        quantity: item.quantity,
      })),
      meta_data: [
        {
          key: 'cart_summary',
          value: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      ],
    };

    try {
      const data = await placeOrder(orderData);

      setModalData({
        title: 'Success',
        message: `Order placed successfully!\nOrder ID: ${data.id}`,
        type: 'success',
      });
      setModalVisible(true);

      emptyCart();
    } catch (error: any) {
      setModalData({
        title: 'Error',
        message: error.message || 'Something went wrong while placing order.',
        type: 'error',
      });
      setModalVisible(true);
    }
  };

  const renderItem = ({ item }: any) => (
    <Card variant="bordered" style={styles.itemCard}>
      <Image
        source={{
          uri:
            item.image || 'https://via.placeholder.com/80x80.png?text=No+Image',
        }}
        style={styles.itemImage}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.itemDetails}>
        <Typography variant="bodyBold" style={styles.itemName}>
          {item.name}
        </Typography>
        <Typography variant="small" color="secondary">
          Price: ₹{item.price}
        </Typography>
        <View style={styles.row}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => {
                if (item.quantity > 1) {
                  updateQuantity(item.id, item.quantity - 1);
                } else {
                  removeFromCart(item.id);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={`Decrease quantity of ${item.name}`}
            >
              <Typography variant="bodyBold">−</Typography>
            </TouchableOpacity>

            <Typography variant="body" style={styles.qtyNumber}>
              {item.quantity}
            </Typography>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              accessibilityRole="button"
              accessibilityLabel={`Increase quantity of ${item.name}`}
            >
              <Typography variant="bodyBold">+</Typography>
            </TouchableOpacity>
          </View>

          <Typography variant="bodyBold" style={styles.itemTotal}>
            ₹{item.price * item.quantity}
          </Typography>

          <TouchableOpacity
            onPress={() => removeFromCart(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name} from cart`}
            style={styles.deleteButton}
          >
            <Ionicons name='trash-outline' size={22} color={theme.colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name='cart-outline' size={150} color={theme.colors.neutral.gray300} />
          <Typography variant="body" color="tertiary" style={styles.emptyText}>
            Your cart is empty
          </Typography>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />

          <Card variant="bordered" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Typography variant="small" color="secondary">
                Subtotals for order
              </Typography>
              <Typography variant="small">₹ {subtotal.toFixed(2)}</Typography>
            </View>
            <View style={styles.summaryRow}>
              <Typography variant="small" color="secondary">
                Delivery fee
              </Typography>
              <Typography variant="small">₹ {deliveryFee.toFixed(2)}</Typography>
            </View>
            <View style={styles.summaryRow}>
              <Typography variant="small" color="secondary">
                Discount
              </Typography>
              <Typography variant="small">-₹ {discount.toFixed(2)}</Typography>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Typography variant="bodyBold">Total</Typography>
              <Typography variant="bodyBold">₹ {total.toFixed(2)}</Typography>
            </View>
          </Card>

          <Button
            variant="success"
            onPress={onPlaceOrder}
            style={styles.checkoutButton}
            fullWidth
            accessibilityLabel="Proceed to checkout"
          >
            Checkout
          </Button>
        </>
      )}

      <CustomModal
        visible={modalVisible}
        title={modalData.title}
        message={modalData.message}
        type={modalData.type}
        onClose={() => setModalVisible(false)}
        confirmText='OK'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg
  },
  itemCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },
  itemDetails: { flex: 1 },
  itemName: {
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
  },
  qtyButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    minWidth: theme.layout.minTouchTarget,
    minHeight: theme.layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNumber: {
    paddingHorizontal: theme.spacing.xs,
  },
  itemTotal: {
    marginHorizontal: theme.spacing.sm,
  },
  deleteButton: {
    minWidth: theme.layout.minTouchTarget,
    minHeight: theme.layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xs,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray300,
    marginVertical: theme.spacing.sm,
  },
  checkoutButton: {
    margin: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    marginTop: theme.spacing.md,
  },
});
