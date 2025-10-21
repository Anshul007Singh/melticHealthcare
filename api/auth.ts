import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://www.melticgroup.com/online';

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/wp-json/jwt-auth/v1/token`, {
    username: email,
    password,
  });

  const data = response.data;

  await AsyncStorage.setItem('userToken', data.token);

  const userInfo = {
    name: data.user_display_name,
    email: data.user_email,
    mobile: data.mobile,
  };

  await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

  return data;
};

// 🔹 REGISTER USER
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

// 🔹 CHECK LOGIN STATUS
export const getStoredToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

// 🔹 GET STORED USER INFO
export const getStoredUserInfo = async () => {
  const json = await AsyncStorage.getItem('userInfo');
  return json ? JSON.parse(json) : null;
};

// 🔹 LOGOUT
export const logoutUser = async () => {
  await AsyncStorage.multiRemove(['userToken', 'userInfo']);
};
