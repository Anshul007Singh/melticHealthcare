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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Snackbar } from 'react-native-paper';
import { loginUser } from '../../api/auth';
import { useAuth } from '@/context/authContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onGoToForgotPassword?: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onGoToRegister,
  onGoToForgotPassword,
}: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showSnackbar('Please enter a valid email address.', 'error');
      return;
    }

    // Validate password length (minimum 6 characters for reasonable security)
    if (password.length < 6) {
      showSnackbar('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      await loginUser(email.trim(), password, login);

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
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder='Enter your password (min 6 characters)'
                placeholderTextColor='#ccc'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.input, styles.passwordInput]}
                returnKeyType='done'
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color='#ccc'
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            {onGoToForgotPassword && (
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={onGoToForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    color: '#fff',
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  eyeIcon: {
    padding: 14,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
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
