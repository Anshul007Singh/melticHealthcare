import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text, TextInput, Button, Title, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '@/components/modal';

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
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;
    const webUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(
      message,
    )}`;

    try {
      // Try to open WhatsApp app first
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else if (Platform.OS === 'ios') {
        // iOS fallback: Open WhatsApp Web in Safari
        const webSupported = await Linking.canOpenURL(webUrl);
        if (webSupported) {
          await Linking.openURL(webUrl);
        } else {
          showModal(
            'Error',
            'Unable to open WhatsApp. Please install the app or enable Safari.',
          );
        }
      } else {
        // Android: Show error if app not installed
        showModal(
          'WhatsApp Not Installed',
          'Please install WhatsApp from the Play Store to continue.',
        );
      }
    } catch (error) {
      console.error('WhatsApp error:', error);
      // Final fallback: Try web URL
      try {
        await Linking.openURL(webUrl);
      } catch (webError) {
        showModal('Error', 'Unable to open WhatsApp. Please try again later.');
      }
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
          <View style={styles.contactInfo}>
            <Title style={styles.label1}>Phone</Title>
            <Text style={styles.text}>+91 9504600000</Text>

            <Title style={styles.label1}>Email</Title>
            <Text style={styles.text}>info@meltichealth.com</Text>

            <Title style={styles.label1}>Address</Title>
            <Text style={styles.text}>
              Nanhera Road Kuldeep Nagar, Ambala Cantt, India 133004
            </Text>

            <IconButton
              icon='whatsapp'
              iconColor='#25D366'
              size={55}
              style={styles.whatsappButton}
              onPress={handleWhatsApp}
            />
          </View>

          {/* Form */}
          <Title style={styles.formTitle}>Leave your message</Title>

          {fields.map((field) => (
            <View key={field} style={styles.inputContainer}>
              <Text style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <TextInput
                mode='outlined'
                numberOfLines={field === 'message' ? 4 : 1}
                value={form[field as keyof typeof form]}
                onChangeText={(value) => handleChange(field, value)}
                style={styles.input}
                theme={{ roundness: 10 }}
                placeholder={`Enter your ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
                keyboardType={field === 'phone' ? 'numeric' : 'default'}
              />
            </View>
          ))}

          <Button
            mode='contained'
            style={[
              styles.submitButton,
              !isValid && { backgroundColor: '#ccc' },
            ]}
            disabled={!isValid || loading}
            labelStyle={{ color: 'black', fontWeight: 'bold' }}
            onPress={handleSubmit}
            loading={loading}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 25,
    position: 'relative',
  },
  contactInfo: {
    marginBottom: 30,
  },
  label1: {
    marginTop: 5,
    color: '#222222',
    fontWeight: '700',
  },
  text: {
    fontSize: 13,
    marginTop: 5,
    color: '#333',
  },
  whatsappButton: {
    borderColor: 'green',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
  },
  formTitle: {
    fontSize: 22,
    marginBottom: 20,
    color: '#222222',
    fontWeight: '700',
  },
  input: {
    marginBottom: 15,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333333',
    zIndex: 1,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#B5DE00',
    marginTop: 10,
    fontSize: 18,
    borderRadius: 55,
    paddingVertical: 5,
  },
});

export default Contact;
