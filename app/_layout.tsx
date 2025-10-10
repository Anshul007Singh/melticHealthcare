import React, { useEffect, useState } from 'react';
import SignUpScreen from './screens/signUpScreen';
import LoginScreen from './screens/loginScreen';
import MainLayout from './screens/mainLayout';
import SplashScreen from './screens/splashscreen';
import { CartProvider } from '@/context/cartContext';

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'signup' | 'login' | 'main'>(
    'splash',
  );

  // Simulate splash delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('login'); // start from signup
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (screen === 'splash') {
    return <SplashScreen />;
  }

  if (screen === 'signup') {
    return (
      <SignUpScreen
        // 👇 redirect to login after successful registration
        onRegistered={() => setScreen('login')}
        onGoToLogin={() => setScreen('login')}
      />
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        // 👇 redirect to main layout after successful login
        onLoginSuccess={() => setScreen('main')}
        // 👇 redirect to signup when user taps Register
        onGoToRegister={() => setScreen('signup')}
      />
    );
  }

  // ✅ Main App
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
