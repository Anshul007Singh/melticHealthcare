import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomModal from '@/components/modal';

export default function KYCForm() {
  const [companyName, setCompanyName] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [drugLicense, setDrugLicense] = useState('Yes');
  const [license20B, setLicense20B] = useState('');
  const [license21B, setLicense21B] = useState('');
  const [license20BFile, setLicense20BFile] = useState<any>(null);
  const [license21BFile, setLicense21BFile] = useState<any>(null);

  const [gstAvailable, setGstAvailable] = useState('Yes');
  const [gstNumber, setGstNumber] = useState('');
  const [gstFile, setGstFile] = useState<any>(null);

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState<any>(null);
  const [panNumber, setPanNumber] = useState('');
  const [panFile, setPanFile] = useState<any>(null);

  const [dob, setDob] = useState<Date | null>(null);
  const [anniversary, setAnniversary] = useState<Date | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>(
    'info',
  );
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (
    type: 'success' | 'error' | 'info',
    title: string,
    message: string,
  ) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const pickDocument = async (setter: (file: any) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg'],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const allowedTypes = ['application/pdf', 'image/jpeg'];

        if (!allowedTypes.includes(file.mimeType || '')) {
          showModal(
            'error',
            'Invalid File',
            'Please select a PDF or JPG/PNG image.',
          );
          // Alert.alert('Invalid File', 'Please select a PDF or JPEG file only.');
          return;
        }

        if (file.size && file.size > 200 * 1024) {
          showModal('error', 'File Too Large', 'File must be less than 200KB.');
          // Alert.alert('File Too Large', 'File must be less than 200KB.');
          return;
        }

        setter(file);
        showModal('success', 'Upload Successful', `${file.name} selected`);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      showModal('error', 'Upload Error', 'Could not pick file. Try again.');
    }
  };

  const handleNext = () => {
    const formData = {
      companyName,
      pinCode,
      drugLicense,
      license20B,
      license20BFile,
      license21B,
      license21BFile,
      gstAvailable,
      gstNumber,
      gstFile,
      aadhaarNumber,
      aadhaarFile,
      panNumber,
      panFile,
      dob: dob ? dob.toDateString() : '',
    };

    showModal('success', 'Submitted', 'KYC details submitted successfully.');
  };

  const isFormValid =
    companyName.trim() !== '' &&
    pinCode.trim() !== '' &&
    (drugLicense === 'No' ||
      (license20B.trim() !== '' && license21B.trim() !== '')) &&
    (gstAvailable === 'No' || gstNumber.trim() !== '') &&
    aadhaarNumber.trim() !== '' &&
    panNumber.trim() !== '';

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Text style={styles.heading}>Enter your Details</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name='business-outline' size={20} style={styles.icon} />
          <TextInput
            placeholder='Company / Firm Name*'
            value={companyName}
            onChangeText={setCompanyName}
            style={styles.input}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name='location-outline' size={20} style={styles.icon} />
          <TextInput
            placeholder='Pin Code*'
            value={pinCode}
            onChangeText={setPinCode}
            style={styles.input}
            keyboardType='numeric'
          />
        </View>

        <Text style={styles.subHeading}>Do you have a drug license?</Text>
        <View style={styles.radioRow}>
          <TouchableOpacity
            onPress={() => setDrugLicense('Yes')}
            style={styles.radioOption}
          >
            <View
              style={[
                styles.radioCircle,
                drugLicense === 'Yes' && styles.radioSelected,
              ]}
            />
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDrugLicense('No')}
            style={styles.radioOption}
          >
            <View
              style={[
                styles.radioCircle,
                drugLicense === 'No' && styles.radioSelected,
              ]}
            />
            <Text>No</Text>
          </TouchableOpacity>
        </View>

        {drugLicense === 'Yes' && (
          <>
            <TextInput
              placeholder='20B License No*'
              value={license20B}
              onChangeText={setLicense20B}
              style={styles.plainInput}
            />
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => pickDocument(setLicense20BFile)}
            >
              <Ionicons name='cloud-upload-outline' size={18} />
              <Text style={styles.uploadText}>
                {license20BFile
                  ? license20BFile.name
                  : 'Upload 20B License File (Optional)'}
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder='21B License No*'
              value={license21B}
              onChangeText={setLicense21B}
              style={styles.plainInput}
            />
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => pickDocument(setLicense21BFile)}
            >
              <Ionicons name='cloud-upload-outline' size={18} />
              <Text style={styles.uploadText}>
                {license21BFile
                  ? license21BFile.name
                  : 'Upload 21B License File (Optional)'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.subHeading}>Do you have a GST number?</Text>
        <View style={styles.radioRow}>
          <TouchableOpacity
            onPress={() => setGstAvailable('Yes')}
            style={styles.radioOption}
          >
            <View
              style={[
                styles.radioCircle,
                gstAvailable === 'Yes' && styles.radioSelected,
              ]}
            />
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGstAvailable('No')}
            style={styles.radioOption}
          >
            <View
              style={[
                styles.radioCircle,
                gstAvailable === 'No' && styles.radioSelected,
              ]}
            />
            <Text>No</Text>
          </TouchableOpacity>
        </View>

        {gstAvailable === 'Yes' && (
          <>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name='file-document-outline'
                size={20}
                style={styles.icon}
              />
              <TextInput
                placeholder='GST No.*'
                value={gstNumber}
                onChangeText={setGstNumber}
                style={styles.input}
              />
            </View>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => pickDocument(setGstFile)}
            >
              <Ionicons name='cloud-upload-outline' size={18} />
              <Text style={styles.uploadText}>
                {gstFile ? gstFile.name : 'Upload GST File (Optional)'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TextInput
          placeholder='Aadhaar No.*'
          value={aadhaarNumber}
          onChangeText={setAadhaarNumber}
          style={styles.plainInput}
          keyboardType='numeric'
        />
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => pickDocument(setAadhaarFile)}
        >
          <Ionicons name='cloud-upload-outline' size={18} />
          <Text style={styles.uploadText}>
            {aadhaarFile ? aadhaarFile.name : 'Upload Aadhaar File (Optional)'}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder='PAN No*'
          value={panNumber}
          onChangeText={setPanNumber}
          style={styles.plainInput}
        />
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => pickDocument(setPanFile)}
        >
          <Ionicons name='cloud-upload-outline' size={18} />
          <Text style={styles.uploadText}>
            {panFile ? panFile.name : 'Upload PAN File (Optional)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowDobPicker(true)}>
          <TextInput
            placeholder='Date of Birth'
            value={dob ? dob.toDateString() : ''}
            style={styles.plainInput}
            editable={false}
          />
        </TouchableOpacity>
        {showDobPicker && (
          <DateTimePicker
            value={dob || new Date()}
            mode='date'
            display='default'
            onChange={(event, selectedDate) => {
              setShowDobPicker(false);
              if (selectedDate) setDob(selectedDate);
            }}
          />
        )}

        <TouchableOpacity onPress={() => setShowAnniversaryPicker(true)}>
          <TextInput
            placeholder='Date of Anniversary'
            value={anniversary ? anniversary.toDateString() : ''}
            style={styles.plainInput}
            editable={false}
          />
        </TouchableOpacity>
        {showAnniversaryPicker && (
          <DateTimePicker
            value={anniversary || new Date()}
            mode='date'
            display='default'
            onChange={(event, selectedDate) => {
              setShowAnniversaryPicker(false);
              if (selectedDate) setAnniversary(selectedDate);
            }}
          />
        )}

        <TouchableOpacity
          style={[
            styles.submitBtn,
            { backgroundColor: isFormValid ? '#B5DE00' : '#ccc' },
          ]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={{ color: 'black', fontWeight: 'bold' }}>
            Place Order
          </Text>
        </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  subHeading: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, paddingVertical: 8 },
  plainInput: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  radioRow: { flexDirection: 'row', marginVertical: 10 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#0060AA',
    marginRight: 6,
  },
  radioSelected: { backgroundColor: '#0060AA' },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#accff0ff',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  uploadText: { marginLeft: 8, color: '#080808ff', fontWeight: '500' },
  submitBtn: {
    marginTop: 20,
    borderRadius: 55,
    alignItems: 'center',
    paddingVertical: 12,
  },
});
