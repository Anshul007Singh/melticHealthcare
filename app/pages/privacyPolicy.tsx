import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.heading}>Privacy Policy</Title>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        This Privacy Policy explains how we collect, use, and protect your
        information when you use our mobile application. By using the app, you
        agree to the practices described in this policy.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We may collect personal information such as your name, email address,
        phone number, and usage data. This helps us provide and improve app
        functionality.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        We use your information to operate the app, improve user experience,
        provide customer support, and communicate important updates.
      </Text>

      <Text style={styles.sectionTitle}>4. Data Protection</Text>
      <Text style={styles.paragraph}>
        We use reasonable security measures to protect your personal data from
        unauthorized access, alterations, and misuse.
      </Text>

      <Text style={styles.sectionTitle}>5. Sharing of Information</Text>
      <Text style={styles.paragraph}>
        We do not sell or share your personal information with third parties
        unless required by law or with your explicit consent.
      </Text>

      <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        The app may contain third-party integrations (like analytics or ads).
        These services may collect information according to their own policies.
      </Text>

      <Text style={styles.sectionTitle}>7. Children’s Privacy</Text>
      <Text style={styles.paragraph}>
        We do not knowingly collect data from children under the age of 13. If
        such information is discovered, we will take immediate steps to delete
        it.
      </Text>

      <Text style={styles.sectionTitle}>8. Changes to this Policy</Text>
      <Text style={styles.paragraph}>
        We may update this Privacy Policy from time to time. Continued use of
        the app after updates means you accept the revised policy.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions regarding this Privacy Policy, contact us at:
        support@example.com
      </Text>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  paragraph: {
    marginTop: 6,
    lineHeight: 20,
    fontSize: 14,
    color: '#444',
  },
});

export default PrivacyPolicy;
