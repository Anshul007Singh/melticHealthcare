import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

import { Button, Input, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
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
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar('Please enter a valid email address.', 'error');
      return;
    }

    // Validate password length (minimum 6 characters)
    if (password.length < 6) {
      showSnackbar('Password must be at least 6 characters long.', 'error');
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
    <>
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
            <Image source={require('../../assets/images/favicon.png')} style={styles.logoimage}
             />
            <Typography variant="h1" color="primary" center style={styles.title}>
              Welcome to Meltic Group
            </Typography>
            <Typography variant="body" color="secondary" style={styles.label}>
              Email
            </Typography>
            <Input
              placeholder='Enter your Email'
              placeholderTextColor={theme.colors.neutral.gray600}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              returnKeyType='next'
              accessibilityLabel="Email address"
              accessibilityHint="Enter your email address"
            />

            <Typography variant="body" color="secondary" style={styles.label}>
              Password
            </Typography>
            <Input
              placeholder='Enter your password'
              placeholderTextColor={theme.colors.neutral.gray600}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType='done'
              accessibilityLabel="Password"
              accessibilityHint="Enter your password"
            />

            <Button
              variant="primary"
              onPress={handleLogin}
              style={styles.loginButton}
              accessibilityLabel="Login button">
              Login
            </Button>

            <TouchableOpacity
              onPress={onGoToRegister}
              accessibilityRole="button"
              accessibilityLabel="Go to registration"
            >
              <Typography variant="small" color="secondary" center style={styles.registerText}>
                Don't have an account?{' '}
                <Typography variant="smallBold" color="link">
                  Register
                </Typography>
              </Typography>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxxl,
  },
  title: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    opacity: 0.8,
    marginBottom: theme.spacing.xxxl,
  },
  logoimage: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  label: {
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.xl,
  },
  registerText: {
    marginTop: theme.spacing.xxxl,
  },
  snackbar: {
    marginBottom: theme.spacing.xl,
  },
  successSnackbar: {
    backgroundColor: theme.colors.semantic.success,
  },
  errorSnackbar: {
    backgroundColor: theme.colors.semantic.error,
  },
});
