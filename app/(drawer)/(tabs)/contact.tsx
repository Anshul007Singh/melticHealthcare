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
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

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
    setForm({ ...form, [key]: value });
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
    } catch (err) {
      console.error(err);
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
    } catch (error) {
      showModal('Error', 'Unable to open WhatsApp.');
    }
  };

  const fields = ['name', 'email', 'phone', 'message'];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
        >
          {/* Contact Info */}
          <Card variant="light" style={styles.contactInfo}>
            <H4 style={styles.label1}>Phone</H4>
            <Typography variant="small" style={styles.text}>
              +91 9504600000
            </Typography>

            <H4 style={styles.label1}>Email</H4>
            <Typography variant="small" style={styles.text}>
              info@meltichealth.com
            </Typography>

            <H4 style={styles.label1}>Address</H4>
            <Typography variant="small" style={styles.text}>
              Nanhera Road Kuldeep Nagar, Ambala Cantt, India 133004
            </Typography>

            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsApp}
            >
              <Ionicons
                name='logo-whatsapp'
                color={theme.colors.semantic.success}
                size={55}
              />
            </TouchableOpacity>
          </Card>

          {/* Form */}
          <H3 style={styles.formTitle}>Leave your message</H3>

          <Input
            label="Name"
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Enter your Name"
            required
          />

          <Input
            label="Email"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="Enter your Email"
            keyboardType="email-address"
            required
          />

          <Input
            label="Phone"
            value={form.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="Enter your Phone"
            keyboardType="numeric"
            maxLength={10}
            required
          />

          <Input
            label="Message"
            value={form.message}
            onChangeText={(value) => handleChange('message', value)}
            placeholder="Enter your Message"
            multiline
            numberOfLines={4}
            required
          />

          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={!isValid || loading}
            loading={loading}
            style={styles.submitButton}
            fullWidth
          >
            Submit
          </Button>
        </ScrollView>
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
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.primary,
  },
  contactInfo: {
    marginBottom: theme.spacing.xxxl,
    position: 'relative',
  },
  label1: {
    marginTop: theme.spacing.md,
  },
  text: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
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
    marginBottom: theme.spacing.xl,
  },
});

export default Contact;
