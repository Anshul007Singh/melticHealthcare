import theme from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/authContext';
import { CartProvider } from '@/context/cartContext';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import MainLayout from './mainLayout';
import LoginScreen from './screens/loginScreen';
import SignUpScreen from './screens/signUpScreen';
import SplashScreen from './screens/splashscreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider style={styles.rootContainer}>
      <PaperProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
function AppContent() {
  const { isLoggedIn } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<'splash' | 'signup' | 'login' | 'home'>(
    'splash',
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setLoading(false);
      setScreen(isLoggedIn ? 'home' : 'login');
    };
    checkAuth();
  }, [isLoggedIn]);

  if (screen === 'splash' && loading && showSplash)
    return <SplashScreen onFinish={() => setShowSplash(false)} />;

  if (!isLoggedIn && screen === 'signup') {
    return (
      <View style={styles.rootContainer}>
        <SignUpScreen
          onRegistered={() => setScreen('login')}
          onGoToLogin={() => setScreen('login')}
        />
      </View>
    );
  }

  if (!isLoggedIn && screen === 'login') {
    return (
      <View style={styles.rootContainer}>
        <LoginScreen
          onLoginSuccess={() => setScreen('home')}
          onGoToRegister={() => setScreen('signup')}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.rootContainer}>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});
