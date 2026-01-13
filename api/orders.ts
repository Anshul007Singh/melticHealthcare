import axios from 'axios';
import { ENV } from '@/config/environment';
import { getAuthHeader } from './auth';
import { PlaceOrderRequest, OrderResponse } from '@/types';

const API_URL = ENV.API_URL;

/**
 * Place an order via the backend API
 *
 * SECURITY NOTE: This endpoint requires backend implementation.
 * The WooCommerce credentials must be stored server-side, not in the client app.
 *
 * Backend Requirements:
 * - Create POST /place-order endpoint
 * - Verify JWT authentication
 * - Store WooCommerce credentials server-side
 * - Proxy order creation to WooCommerce API
 * - Return order details to client
 *
 * @param orderData - Order data to submit
 */
export const placeOrder = async (orderData: PlaceOrderRequest): Promise<OrderResponse> => {
  try {
    const authHeader = await getAuthHeader();

    if (!authHeader.Authorization) {
      throw new Error('User not authenticated. Please log in again.');
    }

    // TODO: Backend team needs to create this endpoint
    // For now, this will fail until backend is updated
    const response = await axios.post(
      `${API_URL}/place-order`,
      orderData,
      {
        headers: authHeader,
        timeout: 30000, // 30 second timeout
      },
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as any; // Type guard for axios error
    console.error('Place Order Error:', axiosError.response?.data || axiosError.message);

    // Provide helpful error messages
    if (axiosError.response?.status === 401) {
      throw new Error('Your session has expired. Please log in again.');
    } else if (axiosError.response?.status === 404) {
      throw new Error('Order service is currently unavailable. Please contact support.');
    }

    throw new Error(axiosError.response?.data?.message || 'Failed to place order. Please try again.');
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
