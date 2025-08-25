import React, { useEffect, useState } from 'react';
import SignUpScreen from './screens/signUpScreen';
import LoginScreen from './screens/loginScreen';
import MainLayout from './screens/mainLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/splashscreen';
import { CartProvider } from '@/context/cartContext';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [screen, setScreen] = useState<'splash' | 'signup' | 'login' | 'main'>(
    'splash',
  );

  useEffect(() => {
    setTimeout(async () => {
      const credentials = await AsyncStorage.getItem('user');
      const isLoggedIn = await AsyncStorage.getItem('loggedIn');

      if (!credentials) {
        setScreen('signup');
      } else if (isLoggedIn === 'true') {
        setScreen('main');
      } else {
        setScreen('login');
      }
      setIsAppReady(true);
    }, 2000);
  }, []);

  if (!isAppReady) return <SplashScreen />;

  if (screen === 'signup')
    return <SignUpScreen onRegistered={() => setScreen('login')} />;
  if (screen === 'login')
    return <LoginScreen onLogin={() => setScreen('main')} />;
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}
{
  /* <Button
  title="Logout"
  onPress={async () => {
    await AsyncStorage.setItem('loggedIn', 'false');
    router.replace('/'); // or any navigation to root to reset flow
  }}
/> */
}
