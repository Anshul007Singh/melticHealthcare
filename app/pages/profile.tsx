import { getStoredUserInfo } from '@/api/auth';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
// import CustomModal from '@/components/CustomModal';
import CustomModal from '@/components/modal';

const Profile = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>(
    'info',
  );

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
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5tZWx0aWNncm91cC5jb20vb25saW5lIiwiaWF0IjoxNzYxODQxNTk2LCJuYmYiOjE3NjE4NDE1OTYsImV4cCI6MTc2MjQ0NjM5NiwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjUifX19.kp7H0LV2I9nwQPbL_i_VUNFacO6bA-Ry-BpBd_Slvg0';

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

  const validateForm = () => {
    const { name, email, phone } = form;
    if (!name || !email || !phone) {
      showModal('Validation Error', 'All fields are required', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showModal('Validation Error', 'Enter a valid email address', 'error');
      return false;
    }

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      showModal('Validation Error', 'Enter a valid phone number', 'error');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!mytoken) {
        showModal('Error', 'No user token found', 'error');
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
        showModal('Success', 'Profile updated successfully!', 'success');
        setIsEditing(false);
      } else {
        showModal('Error', data.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      setLoading(false);
      showModal('Error', 'Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <>
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

      {/* ✅ Modern Custom Modal */}
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
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 15 },
});

export default Profile;
