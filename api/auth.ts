import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { ENV } from '@/config/environment';

const BASE_URL = ENV.WC_BASE_URL;

type JwtPayload = {
  data?: {
    user?: {
      id: number;
    };
  };
};

export type StoredUserInfo = {
  userId: number | null;
  name: string;
  email: string;
  mobile?: string;
  token: string;
  kyc: boolean;
};

export const loginUser = async (
  email: string,
  password: string,
  onAuthUpdate?: (token: string) => void,
) => {
  const response = await axios.post(`${BASE_URL}/wp-json/jwt-auth/v1/token`, {
    username: email,
    password,
  });

  const data = response.data;
  const decoded = jwtDecode<any>(data.token);
  const userId =
    decoded?.data?.user?.id ||
    decoded?.data?.id ||
    decoded?.user_id ||
    decoded?.id ||
    decoded?.sub ||
    null;

  const userInfo = {
    userId,
    name: data.user_display_name,
    email: data.user_email,
    mobile: data.mobile,
    token: data.token,
    kyc: Boolean(data.user_info_completed),
  };

  await AsyncStorage.setItem('userToken', data.token);
  await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

  if (onAuthUpdate) onAuthUpdate(data.token);

  return userInfo;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  mobile: string,
) => {
  const response = await axios.post(`${BASE_URL}/wp-json/custom/v1/register`, {
    name,
    email,
    password,
    mobile,
  });

  return response.data;
};

export const getStoredToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('userToken');
};

export const getStoredUserInfo = async (): Promise<StoredUserInfo | null> => {
  const json = await AsyncStorage.getItem('userInfo');
  return json ? JSON.parse(json) : null;
};

export const getStoredUserId = async (): Promise<number | null> => {
  const user = await getStoredUserInfo();
  return user?.userId ?? null;
};

export const updateStoredUserKyc = async (kycStatus: boolean) => {
  const json = await AsyncStorage.getItem('userInfo');
  if (!json) return;

  const userInfo: StoredUserInfo = JSON.parse(json);

  const updatedUserInfo = {
    ...userInfo,
    kyc: kycStatus,
  };

  await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
};

export const logoutUser = async () => {
  await AsyncStorage.multiRemove(['userToken', 'userInfo']);
};

export const getAuthHeader = async () => {
  const token = await getStoredToken();
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Request password reset for a user
 *
 * BACKEND REQUIRED: This endpoint needs to be implemented on the server.
 * The backend should:
 * 1. Verify the email exists in the database
 * 2. Generate a secure password reset token (with expiration)
 * 3. Send an email with the reset link
 * 4. Return success response
 *
 * @param email - User's email address
 * @returns Promise that resolves when reset email is sent
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/wp-json/custom/v1/forgot-password`,
      { email },
      {
        timeout: 30000, // 30 second timeout
      }
    );

    if (response.data.success === false) {
      throw new Error(
        response.data.message || 'Failed to send password reset email.'
      );
    }

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as any;
    console.error('Password reset error:', axiosError.response?.data || axiosError.message);

    if (axiosError.response?.status === 404) {
      throw new Error('No account found with that email address.');
    } else if (axiosError.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }

    throw new Error(
      axiosError.response?.data?.message ||
        'Failed to send password reset email. Please try again.'
    );
  }
};
