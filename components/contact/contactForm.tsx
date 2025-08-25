import React, { useState } from 'react';
import { View, Linking, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Title, IconButton } from 'react-native-paper';

const ContactFormPaper = () => {
  const [form, setForm] = useState<any>({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
  });

  const handleChange = (key: any, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    console.log('Form Data:', form);
  };
  const fields = ['name', 'email', 'phone', 'city', 'message'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contactInfo}>
        <Title style={styles.label1}>Phone</Title>
        <Text style={styles.text}>+91 92162 95095</Text>

        <Title style={styles.label1}>Email</Title>
        <Text style={styles.text}>hcareindia@gmail.com</Text>

        <Title style={styles.label1}>Address</Title>
        <Text style={styles.text}>
          Plot no 344, Industrial Area, Phase 2, HSIIDC, Alipur, Barwala,
          Panchkula, Haryana 134118
        </Text>

        <IconButton
          icon='whatsapp'
          iconColor='#25D366'
          size={55}
          style={styles.whatsappButton}
          onPress={() => console.log('WhatsApp icon pressed')}
        />
      </View>

      <Title style={styles.formTitle}>Leave your message</Title>

      {fields.map((field: any) => (
        <View key={field} style={styles.inputContainer}>
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Text>
          <TextInput
            mode='outlined'
            numberOfLines={field === 'message' ? 4 : 1}
            value={form[field]}
            onChangeText={(value) => handleChange(field, value)}
            style={styles.input}
            theme={{ roundness: 10 }}
            placeholder={`Enter your ${
              field.charAt(0).toUpperCase() + field.slice(1)
            }`}
          />
        </View>
      ))}

      <Button
        mode='contained'
        onPress={handleSubmit}
        style={styles.submitButton}
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
    borderRadius: 55,
    paddingVertical: 5,
  },
});

export default ContactFormPaper;
