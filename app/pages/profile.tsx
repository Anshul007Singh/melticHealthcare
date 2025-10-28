import { getStoredUserInfo } from '@/api/auth';
import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';

const Profile = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await getStoredUserInfo();
      setForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.mobile || '',
      });
    };
    loadUserInfo();
  }, []);
  const mytoken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5tZWx0aWNncm91cC5jb20vb25saW5lIiwiaWF0IjoxNzYxNjczMDg3LCJuYmYiOjE3NjE2NzMwODcsImV4cCI6MTc2MjI3Nzg4NywiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMiJ9fX0.C5E6Ztl5KsGizeYLSzf7yQu4ti2eTtLJuujHi-S-fTg';

  const validateForm = () => {
    const { name, email, phone } = form;
    if (!name || !email || !phone) {
      Alert.alert('Validation Error', 'All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Enter a valid email address');
      return false;
    }

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Validation Error', 'Enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!mytoken) {
        Alert.alert('Error', 'No user token found');
        return;
      }

      const res = await fetch(
        'https://www.melticgroup.com/online/wp-json/custom/v1/update-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mytoken}`,
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            mobile: form.phone,
          }),
        },
      );

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title>Profile</Title>

      <TextInput
        label='Name'
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        style={styles.input}
        disabled={!isEditing}
      />
      <TextInput
        label='Email'
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType='email-address'
        style={styles.input}
        disabled={!isEditing}
      />
      <TextInput
        label='Phone'
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
        keyboardType='phone-pad'
        style={styles.input}
        disabled={!isEditing}
      />

      {!isEditing ? (
        <Button
          mode='contained'
          onPress={() => setIsEditing(true)}
          style={{ marginTop: 10 }}
        >
          Edit Profile
        </Button>
      ) : (
        <Button
          mode='contained'
          onPress={handleUpdate}
          loading={loading}
          style={{ marginTop: 10 }}
        >
          Update Profile
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 15 },
});

export default Profile;
