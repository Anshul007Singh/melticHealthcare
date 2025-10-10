import axios from 'axios';

const BASE_URL = 'https://www.melticgroup.com/online';

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/wp-json/jwt-auth/v1/token`, {
    username,
    password,
  });
  return response.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await axios.post(
    'https://www.melticgroup.com/online/wp-json/custom/v1/register',
    {
      username,
      email,
      password,
    },
  );
  return response.data;
};
