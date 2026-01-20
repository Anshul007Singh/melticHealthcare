import CustomModal from '@/components/modal';
import { Button, Card, H3, H4, Input, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const { name, email, phone, message } = form;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = /^\d{10}$/.test(phone);
    const areFieldsFilled = name.trim() !== '' && message.trim() !== '';
    setIsValid(isEmailValid && isPhoneValid && areFieldsFilled);
  }, [form]);

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!isValid) {
      showModal('Invalid Form', 'Please fill all fields correctly.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        'https://www.melticgroup.com/online/wp-json/app/v1/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (response.ok) {
        showModal('Success', 'Contact form submitted successfully!');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        showModal('Error', data.message || 'Submission failed.');
      }
    } catch (error) {
      showModal('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    const phoneNumber = '+919504600000';
    const message = 'Hello, I would like to know more about your services.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showModal('Error', 'WhatsApp is not installed on your device.');
      }
    } catch {
      showModal('Error', 'Unable to open WhatsApp.');
    }
  };
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : theme.spacing.lg,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
          enableOnAndroid
          extraScrollHeight={140}
        >
          {/* Contact Info */}
          <Card variant='light' style={styles.contactInfo}>
            <H4 style={styles.label}>Phone</H4>
            <Typography variant='small'>+91 9504600000</Typography>

            <H4 style={styles.label}>Email</H4>
            <Typography variant='small'>info@meltichealth.com</Typography>

            <H4 style={styles.label}>Address</H4>
            <Typography variant='small'>
              Nanhera Road Kuldeep Nagar, Ambala Cantt, India 133004
            </Typography>

            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsApp}
            >
              <Ionicons
                name='logo-whatsapp'
                size={55}
                color={theme.colors.semantic.success}
              />
            </TouchableOpacity>
          </Card>

          {/* Form */}
          <H3 style={styles.formTitle}>Leave your message</H3>

          <Input
            label='Name'
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder='Enter your Name'
            required
          />

          <Input
            label='Email'
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder='Enter your Email'
            keyboardType='email-address'
            required
          />

          <Input
            label='Phone'
            value={form.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder='Enter your Phone'
            keyboardType='numeric'
            maxLength={10}
            required
          />

          <Input
            label='Message'
            value={form.message}
            onChangeText={(value) => handleChange('message', value)}
            placeholder='Enter your Message'
            multiline
            numberOfLines={4}
            blurOnSubmit={false}
            required
          />

          <Button
            variant='primary'
            onPress={handleSubmit}
            disabled={!isValid || loading}
            loading={loading}
            fullWidth
            style={styles.submitButton}
          >
            Submit
          </Button>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        confirmText='OK'
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
  },
  contactInfo: {
    marginBottom: theme.spacing.xxxl,
    position: 'relative',
  },
  label: {
    marginTop: theme.spacing.md,
  },
  whatsappButton: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: 0,
    width: 100,
  },
  formTitle: {
    marginBottom: theme.spacing.xl,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
});

export default Contact;
