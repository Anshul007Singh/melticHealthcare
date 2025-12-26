import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        Welcome to the Meltic Group mobile application (the “App”), owned and
        operated by Meltic Group (“we”, “us”, or “our”). Your privacy is
        important to us. This Privacy Policy explains how we collect, use,
        store, and share information when you use our App, and describes your
        rights regarding that information. By using the App, you consent to the
        practices described in this policy.
      </Text>

      <Text style={styles.sectionTitle}>2. Who We Are & How to Contact Us</Text>
      <Text style={styles.paragraph}>● Company name: Meltic Group</Text>
      <Text style={styles.paragraph}>
        ● Website: https://www.melticgroup.com/
      </Text>
      <Text style={styles.paragraph}>
        ● Contact email: meltichealth.53@gmail.com
      </Text>
      <Text style={styles.paragraph}>
        ● Registered Address: Nanhera Road Kuldeep Nagar, Ambala Cantt, India
        133004
      </Text>
      <Text style={styles.paragraph}>
        If you have questions, concerns, or requests related to your personal
        data, you may contact us at the email above.
      </Text>

      <Text style={styles.sectionTitle}>3. Information We May Collect</Text>

      <Text style={styles.paragraph}>a. Information you provide directly</Text>
      <Text style={styles.paragraph}>
        ● Name, email, phone number when you register or create an account.
      </Text>
      <Text style={styles.paragraph}>
        ● When you contact support or send feedback.
      </Text>
      <Text style={styles.paragraph}>
        ● Any additional information you choose to provide.
      </Text>

      <Text style={styles.paragraph}>
        b. Automatically collected / device data
      </Text>
      <Text style={styles.paragraph}>
        ● Device model, OS version, IP address, unique identifiers.
      </Text>
      <Text style={styles.paragraph}>
        ● App usage data (screens visited, time spent, actions performed).
      </Text>
      <Text style={styles.paragraph}>
        ● Location data (only if granted permission).
      </Text>

      <Text style={styles.paragraph}>c. Third-party and analytics data</Text>
      <Text style={styles.paragraph}>
        ● Data collected by third-party services such as analytics, crash
        reporting, or ads, following their policies.
      </Text>

      <Text style={styles.sectionTitle}>4. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        ● To provide, operate, and maintain the App.
      </Text>
      <Text style={styles.paragraph}>
        ● To manage user accounts and authenticate users.
      </Text>
      <Text style={styles.paragraph}>
        ● For customer support and communication.
      </Text>
      <Text style={styles.paragraph}>
        ● To improve and personalize the App.
      </Text>
      <Text style={styles.paragraph}>● To comply with legal obligations.</Text>
      <Text style={styles.paragraph}>
        ● With your consent, for marketing or updates.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Storage & Security</Text>
      <Text style={styles.paragraph}>
        ● We store your data on secure servers and choose third-party providers
        carefully.
      </Text>
      <Text style={styles.paragraph}>
        ● We use technical and organizational measures to protect your data.
      </Text>
      <Text style={styles.paragraph}>
        ● We retain data only as long as necessary for stated purposes.
      </Text>

      <Text style={styles.sectionTitle}>6. Sharing & Disclosure of Data</Text>
      <Text style={styles.paragraph}>We do NOT sell your data.</Text>
      <Text style={styles.paragraph}>We may share data:</Text>
      <Text style={styles.paragraph}>
        ● With service providers helping operate the App.
      </Text>
      <Text style={styles.paragraph}>
        ● If required by law or legal process.
      </Text>
      <Text style={styles.paragraph}>
        ● To protect rights, property, or safety.
      </Text>
      <Text style={styles.paragraph}>
        ● During mergers/acquisitions with notice to users.
      </Text>

      <Text style={styles.sectionTitle}>7. User Rights & Control</Text>
      <Text style={styles.paragraph}>You may have the right to:</Text>
      <Text style={styles.paragraph}>● Access your data.</Text>
      <Text style={styles.paragraph}>● Request correction or deletion.</Text>
      <Text style={styles.paragraph}>● Restrict or object to processing.</Text>
      <Text style={styles.paragraph}>● Withdraw consent at any time.</Text>
      <Text style={styles.paragraph}>
        To exercise these rights, contact us at meltichealth.53@gmail.com.
      </Text>

      <Text style={styles.sectionTitle}>8. Children’s Privacy</Text>
      <Text style={styles.paragraph}>
        Our App is not intended for children under 14. We do not knowingly
        collect data from children. If we discover such data was collected, we
        will delete it.
      </Text>

      <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
      <Text style={styles.paragraph}>
        We may update this Privacy Policy. When material changes occur, we will
        notify you through the App or email. Continued use after updates means
        you accept the revised policy.
      </Text>

      <Text style={styles.sectionTitle}>10. Third-Party Links & Services</Text>
      <Text style={styles.paragraph}>
        The App may include external links or third-party services. Their own
        privacy policies apply, and we encourage you to review them.
      </Text>

      <Text style={styles.sectionTitle}>11. International Data Transfers</Text>
      <Text style={styles.paragraph}>
        If your data is stored or processed outside your country, we ensure
        proper legal safeguards.
      </Text>

      <Text style={styles.sectionTitle}>12. Consent & Acceptance</Text>
      <Text style={styles.paragraph}>
        By using the App, you confirm that you have read this Privacy Policy and
        agree to the collection, use, and processing of your information.
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
