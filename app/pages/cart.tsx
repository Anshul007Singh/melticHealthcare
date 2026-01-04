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
    <View style={styles.itemCard}>
      <Image
        source={{
          uri:
            item.image || 'https://via.placeholder.com/80x80.png?text=No+Image',
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
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
            >
              <Text style={styles.qtyText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>

          <TouchableOpacity onPress={() => removeFromCart(item.id)}>
            <Ionicons name='trash-outline' size={22} color='#FF4C4C' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name='cart-outline' size={150} color='#ccc' />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotals for order</Text>
              <Text style={styles.summaryValue}>₹ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery fee</Text>
              <Text style={styles.summaryValue}>
                ₹ {deliveryFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>-₹ {discount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹ {total.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={onPlaceOrder}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#fff' },
  listContainer: { paddingHorizontal: 16, paddingTop: 15 },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { color: '#333', marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qtyButton: { paddingHorizontal: 10, paddingVertical: 4 },
  qtyText: { fontSize: 16, fontWeight: '600' },
  qtyNumber: { fontSize: 16, fontWeight: '500', paddingHorizontal: 6 },
  itemTotal: { fontSize: 15, fontWeight: '600' },
  summaryCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  summaryLabel: { color: '#555' },
  summaryValue: { color: '#111', fontWeight: '500' },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 6,
  },
  totalLabel: { fontSize: 16, fontWeight: '600' },
  totalValue: { fontSize: 16, fontWeight: '700' },
  checkoutButton: {
    backgroundColor: '#28a745',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 50,
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, color: '#999' },
});
