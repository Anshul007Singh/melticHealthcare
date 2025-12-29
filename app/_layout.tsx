import React, { useEffect, useState } from 'react';
import SignUpScreen from './screens/signUpScreen';
import LoginScreen from './screens/loginScreen';
import MainLayout from './mainLayout';
import SplashScreen from './screens/splashscreen';
import { CartProvider } from '@/context/cartContext';
import { getStoredToken } from '@/api/auth';
import { AuthProvider, useAuth } from '@/context/authContext';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
}
function AppContent() {
  const { isLoggedIn } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<'splash' | 'signup' | 'login' | 'home'>(
    'splash',
  );
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const token = await getStoredToken();
      setHasToken(!!token);
      setLoading(false);
      setScreen(token ? 'home' : 'login');
    };
    checkAuth();
  }, []);

  if (screen === 'splash' && loading && showSplash)
    return <SplashScreen onFinish={() => setShowSplash(false)} />;

  if (!isLoggedIn && screen === 'signup') {
    return (
      <SignUpScreen
        onRegistered={() => setScreen('login')}
        onGoToLogin={() => setScreen('login')}
      />
    );
  }

  if (!isLoggedIn && screen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={() => setScreen('home')}
        onGoToRegister={() => setScreen('signup')}
      />
    );
  }

  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
