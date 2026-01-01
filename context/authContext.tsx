import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkToken();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userInfo']);
    setIsLoggedIn(false); // 🔥 triggers re-render
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
