import React, { use, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '@/components/modal';
import { getStoredUserInfo, updateStoredUserKyc } from '@/api/auth';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { Button, Input, H3 } from '@/components/ui';

export default function KYCForm() {
  const [companyName, setCompanyName] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [drugLicense, setDrugLicense] = useState<'Yes' | 'No'>('Yes');
  const [license20B, setLicense20B] = useState('');
  const [license21B, setLicense21B] = useState('');
  const [license20BFile, setLicense20BFile] = useState<any>(null);
  const [license21BFile, setLicense21BFile] = useState<any>(null);

  const [gstAvailable, setGstAvailable] = useState<'Yes' | 'No'>('Yes');
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
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [errors, setErrors] = useState({
    pinCode: '',
    panNumber: '',
    aadhaarNumber: '',
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await getStoredUserInfo();
      setUserToken(data?.token || '');
    };

    loadUserInfo();
  }, []);
  const resetForm = () => {
    setCompanyName('');
    setPinCode('');

    setDrugLicense('Yes');
    setLicense20B('');
    setLicense21B('');
    setLicense20BFile(null);
    setLicense21BFile(null);

    setGstAvailable('Yes');
    setGstNumber('');
    setGstFile(null);

    setAadhaarNumber('');
    setAadhaarFile(null);
    setPanNumber('');
    setPanFile(null);

    setDob(null);
    setAnniversary(null);
    setShowDobPicker(false);
    setShowAnniversaryPicker(false);
  };

  const validatePinCode = (value: string) => {
    if (!/^\d{6}$/.test(value)) {
      return 'Pin code must be exactly 6 digits';
    }
    return '';
  };

  const validateAadhaar = (value: string) => {
    if (!/^\d{12}$/.test(value)) {
      return 'Aadhaar must be exactly 12 digits';
    }
    return '';
  };

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
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg'],
    });

    if (!result.canceled && result.assets?.length) {
      setter(result.assets[0]);
    }
  };

  const submitKYC = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('companyName', companyName);
      formData.append('pinCode', pinCode);
      formData.append('drugLicense', drugLicense);
      formData.append('license20B', license20B);
      formData.append('license21B', license21B);
      formData.append('gstAvailable', gstAvailable);
      formData.append('gstNumber', gstNumber);
      formData.append('aadhaarNumber', aadhaarNumber);
      formData.append('panNumber', panNumber);
      formData.append(
        'anniversary',
        anniversary ? anniversary.toISOString().split('T')[0] : '',
      );

      const addFile = (key: string, file: any) => {
        if (file) {
          formData.append(key, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/octet-stream',
          } as any);
        }
      };

      addFile('license20BFile', license20BFile);
      addFile('license21BFile', license21BFile);
      addFile('gstFile', gstFile);
      addFile('aadhaarFile', aadhaarFile);
      addFile('panFile', panFile);
      const response = await fetch(
        'https://www.melticgroup.com/online/wp-json/app/v1/userinfo',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        },
      );
      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Submission failed');
      }
      updateStoredUserKyc(true);
      resetForm();
      showModal('success', 'Success', 'KYC submitted successfully');
      router.push('/pages/cart');
    } catch (e: any) {
      showModal('error', 'Error', e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const validatePanNumber = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan) ? '' : 'Invalid PAN number';
  };

  // const isFormValid =
  //   companyName &&
  //   !errors.pinCode &&
  //   !errors.panNumber &&
  //   !errors.aadhaarNumber &&
  //   pinCode.length === 6 &&
  //   panNumber.length === 10 &&
  //   aadhaarNumber.length === 12 &&
  //   (drugLicense === 'No' || (license20B && license21B)) &&
  //   (gstAvailable === 'No' || gstNumber);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <ScrollView style={styles.container}>
            <Input
              label='Company / Firm Name'
              placeholder='Company / Firm Name'
              value={companyName}
              onChangeText={setCompanyName}
              accessibilityLabel='Company or firm name'
              accessibilityHint='Enter your registered business name'
            />
            <Input
              label='Pin Code'
              placeholder='Pin Code'
              value={pinCode}
              keyboardType='numeric'
              maxLength={6}
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9]/g, '');
                setPinCode(numeric);
                setErrors((e) => ({ ...e, pinCode: validatePinCode(numeric) }));
              }}
              error={errors.pinCode}
              accessibilityLabel='Pin code'
              accessibilityHint='Enter 6-digit pin code'
            />

            <Text style={styles.subHeading}>Do you have a drug license?</Text>
            <View style={styles.radioRow}>
              {['Yes', 'No'].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={styles.radioOption}
                  onPress={() => setDrugLicense(v as any)}
                  accessibilityRole='radio'
                  accessibilityLabel={`Drug license required - ${v}`}
                  accessibilityState={{ checked: drugLicense === v }}
                  accessibilityHint={`Double tap to select ${v}`}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      drugLicense === v && styles.radioSelected,
                    ]}
                  />
                  <Text>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {drugLicense === 'Yes' && (
              <>
                <Input
                  label='20B License Number'
                  placeholder='20B License No'
                  value={license20B}
                  onChangeText={setLicense20B}
                  accessibilityLabel='License 20B number'
                  accessibilityHint='Enter your 20B license number'
                />
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => pickDocument(setLicense20BFile)}
                  accessibilityRole='button'
                  accessibilityLabel='Upload License 20B document'
                  accessibilityHint='Double tap to select a PDF or image file'
                >
                  <Ionicons name='cloud-upload-outline' size={18} />
                  <Text style={styles.uploadText}>
                    {license20BFile?.name || 'Upload 20B License File'}
                  </Text>
                </TouchableOpacity>

                <Input
                  label='21B License Number'
                  placeholder='21B License No'
                  value={license21B}
                  onChangeText={setLicense21B}
                  accessibilityLabel='License 21B number'
                  accessibilityHint='Enter your 21B license number'
                />
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => pickDocument(setLicense21BFile)}
                  accessibilityRole='button'
                  accessibilityLabel='Upload License 21B document'
                  accessibilityHint='Double tap to select a PDF or image file'
                >
                  <Ionicons name='cloud-upload-outline' size={18} />
                  <Text style={styles.uploadText}>
                    {license21BFile?.name || 'Upload 21B License File'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <Text style={styles.subHeading}>Do you have GST?</Text>
            <View style={styles.radioRow}>
              {['Yes', 'No'].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={styles.radioOption}
                  onPress={() => setGstAvailable(v as any)}
                  accessibilityRole='radio'
                  accessibilityLabel={`GST available - ${v}`}
                  accessibilityState={{ checked: gstAvailable === v }}
                  accessibilityHint={`Double tap to select ${v}`}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      gstAvailable === v && styles.radioSelected,
                    ]}
                  />
                  <Text>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {gstAvailable === 'Yes' && (
              <>
                <Input
                  label='GST Number'
                  placeholder='GST Number'
                  value={gstNumber}
                  onChangeText={setGstNumber}
                  accessibilityLabel='GST number'
                  accessibilityHint='Enter your GST registration number'
                />
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => pickDocument(setGstFile)}
                  accessibilityRole='button'
                  accessibilityLabel='Upload GST document'
                  accessibilityHint='Double tap to select a PDF or image file'
                >
                  <Ionicons name='cloud-upload-outline' size={18} />
                  <Text style={styles.uploadText}>
                    {gstFile?.name || 'Upload GST File'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <Input
              label='Aadhaar Number'
              placeholder='Aadhaar Number'
              value={aadhaarNumber}
              keyboardType='numeric'
              maxLength={12}
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9]/g, '');
                setAadhaarNumber(numeric);
                setErrors((e) => ({
                  ...e,
                  aadhaarNumber: validateAadhaar(numeric),
                }));
              }}
              error={errors.aadhaarNumber}
              accessibilityLabel='Aadhaar number'
              accessibilityHint='Enter your 12-digit Aadhaar number'
            />

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => pickDocument(setAadhaarFile)}
              accessibilityRole='button'
              accessibilityLabel='Upload Aadhaar document'
              accessibilityHint='Double tap to select a PDF or image file'
            >
              <Ionicons name='cloud-upload-outline' size={18} />
              <Text style={styles.uploadText}>
                {aadhaarFile?.name || 'Upload Aadhaar File'}
              </Text>
            </TouchableOpacity>
            <Input
              label='PAN Number'
              placeholder='PAN Number'
              value={panNumber}
              autoCapitalize='characters'
              maxLength={10}
              onChangeText={(text) => {
                // Remove special characters & force uppercase
                let formatted = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

                // Enforce PAN structure while typing
                if (formatted.length <= 5) {
                  // First 5 must be alphabets
                  formatted = formatted.replace(/[^A-Z]/g, '');
                } else if (formatted.length <= 9) {
                  // Next 4 must be numbers
                  const firstFive = formatted
                    .slice(0, 5)
                    .replace(/[^A-Z]/g, '');
                  const nextFour = formatted.slice(5).replace(/[^0-9]/g, '');
                  formatted = firstFive + nextFour;
                } else {
                  // Last character must be alphabet
                  const firstNine = formatted.slice(0, 9);
                  const lastChar = formatted.slice(9).replace(/[^A-Z]/g, '');
                  formatted = firstNine + lastChar;
                }

                setPanNumber(formatted);
                setErrors((e) => ({
                  ...e,
                  panNumber:
                    formatted.length === 10 ? validatePanNumber(formatted) : '',
                }));
              }}
              error={errors.panNumber}
              accessibilityLabel='PAN card number'
              accessibilityHint='Enter your 10-character PAN number'
            />

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => pickDocument(setPanFile)}
              accessibilityRole='button'
              accessibilityLabel='Upload PAN card document'
              accessibilityHint='Double tap to select a PDF or image file'
            >
              <Ionicons name='cloud-upload-outline' size={18} />
              <Text style={styles.uploadText}>
                {panFile?.name || 'Upload PAN File'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAnniversaryPicker(true)}>
              <Input
                label='Date of Anniversary'
                placeholder='Date of Anniversary'
                value={anniversary ? anniversary.toDateString() : ''}
                editable={false}
                accessibilityLabel='Date of Anniversary'
                accessibilityHint='Double tap to select date'
                style={{
                  backgroundColor: theme.colors.neutral.gray50,
                  padding: 20,
                }}
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
            <Button
              variant='success'
              size='large'
              onPress={submitKYC}
              // disabled={!isFormValid}
              loading={loading}
              accessibilityLabel='Submit KYC details'
              fullWidth
              style={{
                marginTop: theme.spacing.xl,
                marginBottom: theme.spacing.huge + theme.spacing.xxxl,
              }}
            >
              Submit
            </Button>
          </ScrollView>

          <CustomModal
            visible={modalVisible}
            title={modalTitle}
            message={modalMessage}
            type={modalType}
            onClose={() => setModalVisible(false)}
            confirmText='OK'
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  heading: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.lg,
  },
  subHeading: {
    ...theme.typography.bodyBold,
    marginTop: theme.spacing.xl,
  },
  radioRow: {
    flexDirection: 'row',
    marginVertical: theme.spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xl,
    paddingVertical: 13, // Adds padding to achieve 44px touch target (44-18)/2
    paddingHorizontal: 13,
    minHeight: 44, // WCAG/iOS HIG minimum touch target size
    minWidth: 44,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    marginRight: theme.spacing.xs,
  },
  radioSelected: {
    backgroundColor: theme.colors.primary.main,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary.lighter,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  uploadText: {
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
});
