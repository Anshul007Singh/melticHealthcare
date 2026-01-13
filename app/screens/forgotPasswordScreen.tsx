import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Snackbar } from 'react-native-paper';
import { requestPasswordReset } from '@/api/auth';
import { isValidEmail } from '@/utils/errorHandler';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

export default function ForgotPasswordScreen({
  onBackToLogin,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    // Validate email
    if (!email.trim()) {
      showSnackbar('Please enter your email address.', 'error');
      return;
    }

    if (!isValidEmail(email.trim())) {
      showSnackbar('Please enter a valid email address.', 'error');
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(email.trim());

      setSubmitted(true);
      showSnackbar(
        'Password reset instructions sent! Check your email.',
        'success'
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      showSnackbar(
        error.message || 'Failed to send reset email. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
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
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackToLogin}
            >
              <Ionicons name='arrow-back' size={24} color='#fff' />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Ionicons
                name='lock-closed-outline'
                size={60}
                color='#fff'
                style={styles.icon}
              />
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                {submitted
                  ? 'Check your email for password reset instructions.'
                  : "Don't worry! Enter your email address and we'll send you instructions to reset your password."}
              </Text>
            </View>

            {!submitted ? (
              <>
                {/* Email Input */}
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name='mail-outline'
                    size={20}
                    color='#ccc'
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder='Enter your email'
                    placeholderTextColor='#ccc'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    returnKeyType='send'
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Success State */}
                <View style={styles.successContainer}>
                  <Ionicons
                    name='checkmark-circle'
                    size={80}
                    color='#2ecc71'
                    style={styles.successIcon}
                  />
                  <Text style={styles.successText}>Email Sent!</Text>
                  <Text style={styles.successSubtext}>
                    We've sent password reset instructions to:
                  </Text>
                  <Text style={styles.emailText}>{email}</Text>
                  <Text style={styles.instructionText}>
                    Please check your inbox and follow the link to reset your
                    password. If you don't see the email, check your spam folder.
                  </Text>
                </View>

                {/* Resend Button */}
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={() => {
                    setSubmitted(false);
                    handleSubmit();
                  }}
                >
                  <Ionicons name='reload' size={18} color='#fff' />
                  <Text style={styles.resendText}>Resend Email</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Back to Login Link */}
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={onBackToLogin}
            >
              <Ionicons name='arrow-back' size={16} color='#fff' />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Need help? Contact support at:
              </Text>
              <Text style={styles.helpEmail}>info@meltichealth.com</Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
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
    paddingVertical: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#cfcfcf',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#0060AA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  successSubtext: {
    fontSize: 14,
    color: '#cfcfcf',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#cfcfcf',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
  },
  resendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backToLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 10,
  },
  backToLoginText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  helpText: {
    fontSize: 13,
    color: '#cfcfcf',
    marginBottom: 5,
  },
  helpEmail: {
    fontSize: 14,
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
