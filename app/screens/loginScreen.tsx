import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Snackbar } from 'react-native-paper';
import { loginUser } from '../../api/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onGoToRegister,
}: LoginScreenProps) {
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
    try {
      await loginUser(email, password);

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
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Sign in to continue.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder='Enter your Email'
          placeholderTextColor='#ccc'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder='Enter your password'
          placeholderTextColor='#ccc'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
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
      </View>

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
