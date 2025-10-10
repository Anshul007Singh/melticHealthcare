import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { loginUser } from '../../api/auth'; // adjust path if needed

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onGoToRegister,
}: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      Alert.alert('Success', `Welcome ${data.user_display_name}`);
      onLoginSuccess(); // ✅ Navigate to main layout
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder='Username'
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title='Login' onPress={handleLogin} />
      <Button title='Register' onPress={onGoToRegister} />
    </View>
  );
}
