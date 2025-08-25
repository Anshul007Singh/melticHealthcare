import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const stored = await AsyncStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;

    if (user?.email === email && user?.password === password) {
      await AsyncStorage.setItem('loggedIn', 'true');
      onLogin();
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  return (
    <View>
      <TextInput
        placeholder='Email'
        onChangeText={setEmail}
        keyboardType='email-address'
      />
      <TextInput
        placeholder='Password'
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title='Login' onPress={handleLogin} />
    </View>
  );
}
