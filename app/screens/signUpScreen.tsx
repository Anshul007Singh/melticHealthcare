import { registerUser } from '@/api/auth';
import CustomModal from '@/components/modal';
import { Button, Input, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';

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
    <ScrollView>
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
              Create Account
            </Typography>
            <Typography variant="small" color="secondary" center>
              Already Registered?{' '}
              <Typography
                variant="smallBold"
                color="link"
                onPress={onGoToLogin}
              >
                Log in here
              </Typography>
            </Typography>

            <View style={styles.formgroup}>
              <Typography variant="body" color="secondary" style={styles.label}>
                Full Name
              </Typography>
              <Input
                placeholder='Enter full name'
                placeholderTextColor={theme.colors.neutral.gray300}
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setErrors((e) => ({ ...e, name: validateName(t) }));
                }}
                returnKeyType='next'
                accessibilityLabel="Full name"
              />
              {errors.name ? (
                <Typography variant="caption" color="error">
                  {errors.name}
                </Typography>
              ) : null}
            
              <Typography variant="body" color="secondary" style={styles.label}>
                Email
              </Typography>
              <Input
                placeholder='Enter your Email'
                placeholderTextColor={theme.colors.neutral.gray300}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErrors((e) => ({ ...e, email: validateEmail(t) }));
                }}
                keyboardType='email-address'
                returnKeyType='next'
                accessibilityLabel="Email address"
              />
              {errors.email ? (
                <Typography variant="caption" color="error">
                  {errors.email}
                </Typography>
              ) : null}
            
              <Typography variant="body" color="secondary" style={styles.label}>
                Password
              </Typography>
              <Input
                placeholder='Enter your password'
                placeholderTextColor={theme.colors.neutral.gray300}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setErrors((e) => ({ ...e, password: validatePassword(t) }));
                }}
                secureTextEntry
                returnKeyType='next'
                accessibilityLabel="Password"
              />
              {errors.password ? (
                <Typography variant="caption" color="error">
                  {errors.password}
                </Typography>
              ) : null}
           
              <Typography variant="body" color="secondary" style={styles.label}>
                Mobile
              </Typography>
              <Input
                placeholder='Enter mobile number'
                placeholderTextColor={theme.colors.neutral.gray300}
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
                returnKeyType='done'
                accessibilityLabel="Mobile number"
              />
              {errors.mobile ? (
                <Typography variant="caption" color="error">
                  {errors.mobile}
                </Typography>
              ) : null}
            </View>

            <Button
              variant="primary"
              onPress={handleRegister}
              disabled={!isValid}
              style={styles.signupButton}
              accessibilityLabel="Sign up button"
            >
              Sign up
            </Button>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxxl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  logoimage: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.xxxl,
    marginBottom: theme.spacing.lg,
  },
  formgroup: {
    marginTop: theme.spacing.xxl,
  },
  label: {
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  inputError: {
    borderWidth: 2,
    borderColor: theme.colors.semantic.error,
  },
  signupButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
});
