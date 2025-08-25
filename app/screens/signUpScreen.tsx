import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({
  onRegistered,
}: {
  onRegistered: () => void;
}) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!fullname || !email || !mobile || !password) {
      Alert.alert('Please fill all fields');
      return;
    }

    const user = { fullname, email, mobile, password };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    Alert.alert('Registered successfully');
    onRegistered();
  };

  return (
    <View>
      <TextInput placeholder='Full Name' onChangeText={setFullname} />
      <TextInput
        placeholder='Email'
        onChangeText={setEmail}
        keyboardType='email-address'
      />
      <TextInput
        placeholder='Mobile'
        onChangeText={setMobile}
        keyboardType='phone-pad'
      />
      <TextInput
        placeholder='Password'
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title='Register' onPress={handleSignup} />
    </View>
  );
}
