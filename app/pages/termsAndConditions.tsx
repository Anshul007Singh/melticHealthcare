import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';

const TermsAndConditions = () => {
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.heading}>Terms & Conditions</Title>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By using this app, you agree to these Terms & Conditions. If you do not
        agree, please stop using the application immediately.
      </Text>

      <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
      <Text style={styles.paragraph}>
        You agree to use the app responsibly and not engage in any malicious or
        harmful activities.
      </Text>

      <Text style={styles.sectionTitle}>3. Account & Security</Text>
      <Text style={styles.paragraph}>
        You are responsible for maintaining the confidentiality of your login
        credentials and all activities under your account.
      </Text>

      <Text style={styles.sectionTitle}>4. Data & Privacy</Text>
      <Text style={styles.paragraph}>
        We do not share your personal information with third parties without
        your consent. Your data is handled according to our Privacy Policy.
      </Text>

      <Text style={styles.sectionTitle}>5. App Usage</Text>
      <Text style={styles.paragraph}>
        We may update, modify, or discontinue features at any time without
        notice.
      </Text>

      <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        We are not responsible for any loss or damage caused by using the app.
        You use it at your own risk.
      </Text>

      <Text style={styles.sectionTitle}>7. Updates to Terms</Text>
      <Text style={styles.paragraph}>
        We may update these Terms from time to time. Continued use of the app
        means you accept the updated Terms.
      </Text>

      <Text style={styles.sectionTitle}>8. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have questions regarding these Terms, contact us at:
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

export default TermsAndConditions;
