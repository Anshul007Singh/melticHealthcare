import React, { useEffect, useState } from 'react';
import SignUpScreen from './screens/signUpScreen';
import LoginScreen from './screens/loginScreen';
import ForgotPasswordScreen from './screens/forgotPasswordScreen';
import MainLayout from './mainLayout';
import SplashScreen from './screens/splashscreen';
import { CartProvider } from '@/context/cartContext';
import { getStoredToken } from '@/api/auth';
import { AuthProvider, useAuth } from '@/context/authContext';
import { PaperProvider } from 'react-native-paper';
import ErrorBoundary from '@/components/ErrorBoundary';
import { logError } from '@/utils/errorHandler';

export default function App() {
  return (
    <ErrorBoundary onError={(error, errorInfo) => logError(error, 'App Root')}>
      <PaperProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}
function AppContent() {
  const { isLoggedIn } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<
    'splash' | 'signup' | 'login' | 'forgotPassword' | 'home'
  >('splash');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
        setScreen(isLoggedIn ? 'home' : 'login');
      }
    }, 2000); // Reduced from 4s to 2s for better UX

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isLoggedIn]);

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
        onGoToForgotPassword={() => setScreen('forgotPassword')}
      />
    );
  }

  if (!isLoggedIn && screen === 'forgotPassword') {
    return (
      <ForgotPasswordScreen onBackToLogin={() => setScreen('login')} />
    );
  }

  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
