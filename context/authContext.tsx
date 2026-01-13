import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User, WithChildren } from '@/types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: WithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userInfo = await AsyncStorage.getItem('userInfo');

        if (token) {
          setIsLoggedIn(true);
          if (userInfo) {
            setUser(JSON.parse(userInfo));
          }
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };
    checkToken();
  }, []);

  const login = async (token: string, userData?: User) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      if (userData) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
      }
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userInfo']);
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
