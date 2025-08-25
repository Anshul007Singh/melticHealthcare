import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, TextInput, RadioButton, Button } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function KYCForm() {
  const [companyName, setCompanyName] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [drugLicense, setDrugLicense] = useState('Yes');
  const [license20B, setLicense20B] = useState('');
  const [license21B, setLicense21B] = useState('');
  const [license20BFile, setLicense20BFile] = useState<string | null>(null);
  const [license21BFile, setLicense21BFile] = useState<string | null>(null);

  const [gstAvailable, setGstAvailable] = useState('Yes');
  const [gstNumber, setGstNumber] = useState('');
  const [gstFile, setGstFile] = useState<string | null>(null);

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState<string | null>(null);
  const [panNumber, setPanNumber] = useState('');
  const [panFile, setPanFile] = useState<string | null>(null);

  const [dob, setDob] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);

  const pickDocument = async (setter: (value: string) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setter(file.name);
        console.log('Picked file:', file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={styles.heading}>KYC Process</Text>

      <TextInput
        mode='outlined'
        theme={{ roundness: 10 }}
        label='Company / Firm Name*'
        value={companyName}
        onChangeText={setCompanyName}
        style={styles.input}
      />

      <TextInput
        label='Pin Code*'
        value={pinCode}
        onChangeText={setPinCode}
        style={styles.input}
        keyboardType='numeric'
        mode='outlined'
        theme={{ roundness: 10 }}
      />
      <Text style={styles.subHeading}>Do you have a drug license?</Text>
      <RadioButton.Group onValueChange={setDrugLicense} value={drugLicense}>
        <View style={styles.radioRow}>
          <RadioButton value='Yes' />
          <Text style={styles.radioText}>Yes</Text>
          <RadioButton value='No' />
          <Text style={styles.radioText}>No</Text>
        </View>
      </RadioButton.Group>

      {drugLicense === 'Yes' && (
        <>
          <TextInput
            label='20B License No*'
            value={license20B}
            onChangeText={setLicense20B}
            style={styles.input}
            mode='outlined'
            theme={{ roundness: 10 }}
          />
          <Button
            icon='upload'
            mode='outlined'
            onPress={() => pickDocument(setLicense20BFile)}
            style={styles.uploadBtn}
          >
            {license20BFile ? license20BFile : 'Upload 20B License File*'}
          </Button>

          <TextInput
            label='21B License No*'
            value={license21B}
            onChangeText={setLicense21B}
            style={styles.input}
            mode='outlined'
            theme={{ roundness: 10 }}
          />
          <Button
            icon='upload'
            mode='outlined'
            onPress={() => pickDocument(setLicense21BFile)}
            style={styles.uploadBtn}
          >
            {license21BFile ? license21BFile : 'Upload 21B License File*'}
          </Button>
        </>
      )}

      <Text style={styles.subHeading}>Do you have a GST number?</Text>
      <RadioButton.Group onValueChange={setGstAvailable} value={gstAvailable}>
        <View style={styles.radioRow}>
          <RadioButton value='Yes' />
          <Text style={styles.radioText}>Yes</Text>
          <RadioButton value='No' />
          <Text style={styles.radioText}>No</Text>
        </View>
      </RadioButton.Group>

      {gstAvailable === 'Yes' && (
        <>
          <TextInput
            mode='outlined'
            theme={{ roundness: 10 }}
            label='GST No.*'
            value={gstNumber}
            onChangeText={setGstNumber}
            style={styles.input}
          />
          <Button
            icon='upload'
            mode='outlined'
            onPress={() => pickDocument(setGstFile)}
            style={styles.uploadBtn}
          >
            {gstFile ? gstFile : 'Upload GST File*'}
          </Button>
        </>
      )}

      <TextInput
        mode='outlined'
        theme={{ roundness: 10 }}
        label='Aadhaar No.*'
        value={aadhaarNumber}
        onChangeText={setAadhaarNumber}
        style={styles.input}
        keyboardType='numeric'
      />
      <Button
        icon='upload'
        mode='outlined'
        onPress={() => pickDocument(setAadhaarFile)}
        style={styles.uploadBtn}
      >
        {aadhaarFile ? aadhaarFile : 'Upload Aadhaar File*'}
      </Button>

      <TextInput
        label='PAN No*'
        value={panNumber}
        onChangeText={setPanNumber}
        style={styles.input}
        mode='outlined'
        theme={{ roundness: 10 }}
      />
      <Button
        icon='upload'
        mode='outlined'
        onPress={() => pickDocument(setPanFile)}
        style={styles.uploadBtn}
      >
        {panFile ? panFile : 'Upload PAN File*'}
      </Button>

      <TouchableOpacity onPress={() => setShowDobPicker(true)}>
        <TextInput
          label='Date of Birth*'
          value={dob.toDateString()}
          style={styles.input}
          editable={false}
          mode='outlined'
          theme={{ roundness: 10 }}
        />
      </TouchableOpacity>
      {showDobPicker && (
        <DateTimePicker
          value={dob}
          mode='date'
          display='default'
          onChange={(event, selectedDate) => {
            setShowDobPicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      <Button
        mode='contained'
        style={styles.submitBtn}
        onPress={() => alert('Next Clicked')}
        labelStyle={{ color: 'black', fontWeight: 'bold' }}
      >
        Next
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioText: {
    marginRight: 20,
  },
  uploadBtn: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#B5DE00',
    marginTop: 10,
    borderRadius: 55,
    paddingVertical: 5,
  },
});
