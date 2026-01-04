import { getStoredUserInfo } from '@/api/auth';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CustomModal from '@/components/modal';

type StoredUserInfo = {
  id: number;
  token: string;
};

const Profile = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    token: '',
  });

  const [originalForm, setOriginalForm] = useState({
    name: '',
    email: '',
    phone: '',
    token: '',
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>(
    'info',
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await getStoredUserInfo();

      const userData = {
        name: data?.name || '',
        email: data?.email || '',
        phone: data?.mobile || '',
        token: data?.token || '',
      };

      setForm(userData);
      setOriginalForm(userData); // store original data
    };

    loadUserInfo();
  }, []);

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
      const userInfo = await getStoredUserInfo();

      // ✅ NULL SAFETY CHECK
      if (!userInfo || !userInfo.userId || !userInfo.token) {
        setLoading(false);
        showModal(
          'Session Error',
          'User not logged in. Please login again.',
          'error',
        );
        return;
      }

      const res = await fetch(
        `https://www.melticgroup.com/online/wp-json/custom/v1/user/${userInfo.userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
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

      if (res.ok && data.success) {
        showModal('Success', 'Profile updated successfully!', 'success');
        setIsEditing(false);
        setOriginalForm(form);
      } else {
        showModal(
          'Error',
          data?.message || 'Failed to update profile',
          'error',
        );
      }
    } catch (error) {
      setLoading(false);
      showModal('Error', 'Something went wrong. Please try again.', 'error');
    }
  };

  const handleCancel = () => {
    setForm(originalForm); // reset form
    setIsEditing(false); // back to view mode
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <TextInput
          placeholder='Name'
          value={form.name}
          editable={isEditing}
          onChangeText={(text) => setForm({ ...form, name: text })}
          style={[styles.input, !isEditing && styles.disabled]}
        />

        <TextInput
          placeholder='Email'
          value={form.email}
          editable={isEditing}
          keyboardType='email-address'
          onChangeText={(text) => setForm({ ...form, email: text })}
          style={[styles.input, !isEditing && styles.disabled]}
        />

        <TextInput
          placeholder='Phone'
          value={form.phone}
          editable={isEditing}
          keyboardType='phone-pad'
          onChangeText={(text) => setForm({ ...form, phone: text })}
          style={[styles.input, !isEditing && styles.disabled]}
        />

        {!isEditing ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text style={styles.buttonText}>Update Profile</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

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
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabled: {
    backgroundColor: '#ebe8e8ff',
  },
  button: {
    backgroundColor: '#0060AA',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fd6868ff',
    color: '#fff',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;
