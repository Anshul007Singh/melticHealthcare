import React, { useEffect, useState } from 'react';
import SignUpScreen from './screens/signUpScreen';
import LoginScreen from './screens/loginScreen';
import MainLayout from './mainLayout'; // ✅ not ./index
import SplashScreen from './screens/splashscreen';
import { CartProvider } from '@/context/cartContext';
import { getStoredToken } from '@/api/auth';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'signup' | 'login' | 'main'>(
    'splash',
  );

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const token = await getStoredToken();
      setScreen(token ? 'main' : 'login');
    };
    checkAuth();
  }, []);

  if (screen === 'splash') return <SplashScreen />;

  if (screen === 'signup')
    return (
      <SignUpScreen
        onRegistered={() => setScreen('login')}
        onGoToLogin={() => setScreen('login')}
      />
    );

  if (screen === 'login')
    return (
      <LoginScreen
        onLoginSuccess={() => setScreen('main')}
        onGoToRegister={() => setScreen('signup')}
      />
    );

  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
