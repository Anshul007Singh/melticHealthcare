import React, { useState, useEffect } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { registerUser } from '@/api/auth';
import { router } from 'expo-router';

interface RegisterScreenProps {
  onRegistered: () => void;
  onGoToLogin?: () => void;
}

export default function RegisterScreen({
  onRegistered,
  onGoToLogin,
}: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [isValid, setIsValid] = useState(false);

  const validateUsername = (text: string) => {
    if (!text) return 'Username is required';
    if (text.length < 10) return 'Username must be at least 10 characters';
    if (text.length > 15) return 'Username cannot exceed 15 characters';
    return '';
  };
  const validateEmail = (text: string) => {
    if (!text) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) return 'Enter a valid email address';
    return '';
  };
  const validatePassword = (text: string) => {
    if (!text) return 'Password is required';
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{10,15}$/;
    if (!passwordRegex.test(text))
      return 'Password must be 10–15 chars, include 1 uppercase, 1 number & 1 special char';
    return '';
  };
  const validateMobile = (text: string) => {
    if (!text) return 'Mobile number is required';
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(text))
      return 'Enter a valid 10-digit Indian mobile number';
    return '';
  };

  const handleRegister = async () => {
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const mobileError = validateMobile(mobile);

    if (usernameError || emailError || passwordError || mobileError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        mobile: mobileError,
      });
      return;
    }

    try {
      await registerUser(username, email, password);
      Alert.alert('Success', 'Registration successful');
      onRegistered(); // ✅ navigate back to login
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    const noErrors = Object.values(errors).every((err) => err === '');
    const allFilled = !!(username && email && password && mobile);
    setIsValid(noErrors && allFilled);
  }, [errors, username, email, password, mobile]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 'bold' }}>
        Register
      </Text>
      <TextInput
        placeholder='Username'
        value={username}
        onChangeText={(t) => {
          setUsername(t);
          setErrors((e) => ({ ...e, username: validateUsername(t) }));
        }}
        style={{
          borderWidth: 1,
          borderColor: errors.username ? 'red' : 'gray',
          marginBottom: 5,
          padding: 8,
          borderRadius: 6,
        }}
      />
      {errors.username ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>
          {errors.username}
        </Text>
      ) : null}

      <TextInput
        placeholder='Email'
        value={email}
        keyboardType='email-address'
        onChangeText={(t) => {
          setEmail(t);
          setErrors((e) => ({ ...e, email: validateEmail(t) }));
        }}
        style={{
          borderWidth: 1,
          borderColor: errors.email ? 'red' : 'gray',
          marginBottom: 5,
          padding: 8,
          borderRadius: 6,
        }}
      />
      {errors.email ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>
      ) : null}

      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setErrors((e) => ({ ...e, password: validatePassword(t) }));
        }}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: errors.password ? 'red' : 'gray',
          marginBottom: 5,
          padding: 8,
          borderRadius: 6,
        }}
      />
      {errors.password ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>
          {errors.password}
        </Text>
      ) : null}

      <TextInput
        placeholder='Mobile Number'
        value={mobile}
        keyboardType='numeric'
        maxLength={10}
        onChangeText={(t) => {
          const numeric = t.replace(/[^0-9]/g, '');
          setMobile(numeric);
          setErrors((e) => ({ ...e, mobile: validateMobile(numeric) }));
        }}
        style={{
          borderWidth: 1,
          borderColor: errors.mobile ? 'red' : 'gray',
          marginBottom: 5,
          padding: 8,
          borderRadius: 6,
        }}
      />
      {errors.mobile ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.mobile}</Text>
      ) : null}

      <Button title='Register' onPress={handleRegister} disabled={!isValid} />
      <Button title='Back to login' onPress={onGoToLogin} />
    </View>
  );
}
