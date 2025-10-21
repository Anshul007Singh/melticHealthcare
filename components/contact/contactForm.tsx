import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Title, IconButton } from 'react-native-paper';
import { Linking } from 'react-native';

const ContactFormPaper = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
  });

  const [isValid, setIsValid] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        'https://email-contact-q8uvff8t2-anshul-singhs-projects-9282f9cd.vercel.app/api/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your message was sent successfully!');
        setForm({ name: '', email: '', phone: '', city: '', message: '' });
      } else {
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network request failed.');
    }
  };

  useEffect(() => {
    const { name, email, phone, city, message } = form;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = /^\d{10}$/.test(phone);
    const areFieldsFilled =
      name.trim() !== '' && city.trim() !== '' && message.trim() !== '';
    setIsValid(isEmailValid && isPhoneValid && areFieldsFilled);
  }, [form]);

  const fields = ['name', 'email', 'phone', 'city', 'message'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          onPress={async () => {
            const phoneNumber = '+919504600000';
            const message =
              'Hello, I would like to know more about your services.';
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              message,
            )}`;

            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert(
                  'Error',
                  'WhatsApp is not installed on your device.',
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Unable to open WhatsApp.');
            }
          }}
        />
      </View>

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
        onPress={handleSubmit}
        style={[styles.submitButton, !isValid && { backgroundColor: '#ccc' }]}
        disabled={!isValid}
        labelStyle={{ color: 'black', fontWeight: 'bold' }}
      >
        Submit
      </Button>
    </ScrollView>
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

export default ContactFormPaper;
