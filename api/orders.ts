import axios from 'axios';

// Replace these with your WooCommerce REST API credentials
const BASE_URL =
  'https://www.melticgroup.com/online/wp-json/wc/v3/orders?consumer_key';
const API_URL = 'https://www.melticgroup.com/online/wp-json/app/v1';
const CONSUMER_KEY = 'ck_8ed576e4b09fbadb918a2360c252064763a5a1d8';
const CONSUMER_SECRET = 'cs_55439183c9806d1a0ac32052649eeb8d6d387bc0';

export const placeOrder = async (orderData: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/wp-json/wc/v3/orders`,
      orderData,
      {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Place Order Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to place order');
  }
};

export const getMyOrders = async (token: string) => {
  const res = await axios.get(`${API_URL}/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
