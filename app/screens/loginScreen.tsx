import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Snackbar } from 'react-native-paper';
import { loginUser } from '../../api/auth';
import { useAuth } from '@/context/authContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onGoToRegister,
}: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success',
  );

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    if (email.length <= 3 || password.length === 4) {
      showSnackbar('Please enter valid credentials.', 'error');
      return;
    }
    try {
      await loginUser(email, password, login);

      showSnackbar('Login successful!', 'success');

      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } catch (error: any) {
      showSnackbar(
        error.message || 'Invalid credentials. Please try again.',
        'error',
      );
    }
  };

  return (
    <LinearGradient colors={['#0060AA', '#0060AA']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Sign in to continue.</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder='Enter your Email'
              placeholderTextColor='#ccc'
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType='email-address'
              returnKeyType='next'
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder='Enter your password'
              placeholderTextColor='#ccc'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              returnKeyType='done'
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onGoToRegister}>
              <Text style={styles.registerText}>
                Don’t have an account?{' '}
                <Text style={styles.registerLink}>Register</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={[
          styles.snackbar,
          snackbarType === 'success'
            ? styles.successSnackbar
            : styles.errorSnackbar,
        ]}
      >
        {snackbarMessage}
      </Snackbar>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cfcfcf',
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    marginBottom: 15,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    marginTop: 25,
    opacity: 0.8,
  },
  registerLink: {
    textDecorationLine: 'underline',
    color: '#fff',
    fontWeight: '600',
  },

  snackbar: {
    marginBottom: 20,
  },
  successSnackbar: {
    backgroundColor: '#2ecc71',
  },
  errorSnackbar: {
    backgroundColor: '#e74c3c',
  },
});
