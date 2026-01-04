import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://www.melticgroup.com/online';

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
