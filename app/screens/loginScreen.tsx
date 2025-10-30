import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../../api/auth';
import CustomModal from '@/components/modal';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>(
    'info',
  );

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showModal('Validation Error', 'Please fill in both fields.', 'error');
      return;
    }

    try {
      const data = await loginUser(email, password);

      // ✅ If login succeeds
      showModal('Login Successful', 'Welcome back!', 'success');
      setTimeout(() => {
        setModalVisible(false);
        onLoginSuccess();
      }, 1500);
    } catch (error: any) {
      // ❌ Error modal
      showModal(
        'Login Failed',
        error.message || 'Invalid credentials. Please try again.',
        'error',
      );
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#0060AA', '#0060AA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Sign in to continue.</Text>

          <Text style={styles.label}>USER NAME</Text>
          <TextInput
            placeholder='Enter your Email'
            placeholderTextColor='#ccc'
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <Text style={styles.label}>PASSWORD</Text>
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
      </LinearGradient>

      {/* ✅ Custom Modal integrated */}
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
        confirmText='OK'
      />
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
});
