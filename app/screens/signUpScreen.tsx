import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '@/api/auth';
import CustomModal from '@/components/modal';

interface RegisterScreenProps {
  onRegistered: () => void;
  onGoToLogin?: () => void;
}

export default function RegisterScreen({
  onRegistered,
  onGoToLogin,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [isValid, setIsValid] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
  });

  const validateName = (text: string) => {
    if (!text) return 'Name is required';
    if (text.length < 6) return 'Name must be at least 6 characters';
    if (text.length > 15) return 'Name cannot exceed 15 characters';
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
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,12}$/;
    if (!passwordRegex.test(text))
      return 'Password must be 6–12 chars, include 1 uppercase, 1 number & 1 special char';
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
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const mobileError = validateMobile(mobile);

    if (nameError || emailError || passwordError || mobileError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        mobile: mobileError,
      });
      return;
    }

    try {
      await registerUser(name, email, password, mobile);
      setModalData({
        title: 'Success',
        message: 'Registration successful!',
        type: 'success',
      });
      setModalVisible(true);
    } catch (error: any) {
      setModalData({
        title: 'Error',
        message: error.message || 'Something went wrong!',
        type: 'error',
      });
      setModalVisible(true);
    }
  };

  useEffect(() => {
    const noErrors = Object.values(errors).every((err) => err === '');
    const allFilled = !!(name && email && password && mobile);
    setIsValid(noErrors && allFilled);
  }, [errors, name, email, password, mobile]);

  return (
    <LinearGradient
      colors={['#001F60', '#0060AA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Already Registered?{' '}
              <Text style={styles.link} onPress={onGoToLogin}>
                Log in here.
              </Text>
            </Text>

            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              placeholder='Enter full name'
              placeholderTextColor='#ccc'
              value={name}
              onChangeText={(t) => {
                setName(t);
                setErrors((e) => ({ ...e, name: validateName(t) }));
              }}
              style={[styles.input, errors.name && styles.inputError]}
              returnKeyType='next'
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              placeholder='Enter your Email'
              placeholderTextColor='#ccc'
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErrors((e) => ({ ...e, email: validateEmail(t) }));
              }}
              keyboardType='email-address'
              style={[styles.input, errors.email && styles.inputError]}
              returnKeyType='next'
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              placeholder='Enter your password'
              placeholderTextColor='#ccc'
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setErrors((e) => ({ ...e, password: validatePassword(t) }));
              }}
              secureTextEntry
              style={[styles.input, errors.password && styles.inputError]}
              returnKeyType='next'
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <Text style={styles.label}>MOBILE</Text>
            <TextInput
              placeholder='Enter mobile number'
              placeholderTextColor='#ccc'
              value={mobile}
              onChangeText={(t) => {
                const numeric = t.replace(/[^0-9]/g, '');
                setMobile(numeric);
                setErrors((e) => ({
                  ...e,
                  mobile: validateMobile(numeric),
                }));
              }}
              keyboardType='numeric'
              maxLength={10}
              style={[styles.input, errors.mobile && styles.inputError]}
              returnKeyType='done'
            />
            {errors.mobile ? (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.signupButton, !isValid && { opacity: 0.5 }]}
              onPress={handleRegister}
              disabled={!isValid}
            >
              <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <CustomModal
        visible={modalVisible}
        title={modalData.title}
        message={modalData.message}
        type={modalData.type}
        onClose={() => {
          setModalVisible(false);
          if (modalData.type === 'success') onRegistered();
        }}
        confirmText='OK'
      />
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#cfcfcf',
    textAlign: 'center',
    marginBottom: 40,
  },
  link: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: '600',
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
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 25,
  },
  signupButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
