import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';

const TermsAndConditions = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.paragraph}>
        Welcome to the Meltic Group Mobile App (“App”), owned and operated by
        Meltic Group (“Company”, “we”, “us”, or “our”). By downloading,
        installing, or using this App, you agree to be bound by these Terms &
        Conditions (“Terms”). If you do not agree, please do not use the App.
      </Text>

      {/* Section 1 */}
      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By accessing or using the App, you confirm that:
      </Text>
      <Text style={styles.paragraph}>
        ● You have read and understood these Terms.
      </Text>
      <Text style={styles.paragraph}>
        ● You are at least 18 years old or using the App under parental/guardian
        supervision.
      </Text>
      <Text style={styles.paragraph}>
        ● You will comply with all applicable local, state, and national laws.
      </Text>

      {/* Section 2 */}
      <Text style={styles.sectionTitle}>2. About Meltic Group Mobile App</Text>
      <Text style={styles.paragraph}>
        The App helps users connect with our services, products, updates, and
        business information. Features may include:
      </Text>
      <Text style={styles.paragraph}>
        ● Product catalog or service information
      </Text>
      <Text style={styles.paragraph}>● Franchise-related inquiries</Text>
      <Text style={styles.paragraph}>● Contact and support tools</Text>
      <Text style={styles.paragraph}>● Notifications, updates, and offers</Text>
      <Text style={styles.paragraph}>
        We may add or remove features at any time without prior notice.
      </Text>

      {/* Section 3 */}
      <Text style={styles.sectionTitle}>
        3. User Account & Registration (If applicable)
      </Text>
      <Text style={styles.paragraph}>
        When creating an account, you agree to:
      </Text>
      <Text style={styles.paragraph}>
        ● Provide accurate and updated information
      </Text>
      <Text style={styles.paragraph}>● Keep login credentials private</Text>
      <Text style={styles.paragraph}>
        ● Take responsibility for activities under your account
      </Text>
      <Text style={styles.paragraph}>
        We may suspend or terminate accounts that violate these Terms.
      </Text>

      {/* Section 4 */}
      <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
      <Text style={styles.paragraph}>You agree NOT to:</Text>
      <Text style={styles.paragraph}>
        ● Attempt unauthorized access or hacking
      </Text>
      <Text style={styles.paragraph}>
        ● Upload harmful, illegal, or offensive content
      </Text>
      <Text style={styles.paragraph}>
        ● Use the App for fraud or misleading activities
      </Text>
      <Text style={styles.paragraph}>
        ● Copy, resell, or exploit App content
      </Text>
      <Text style={styles.paragraph}>
        ● Interfere with servers or App functionality
      </Text>

      {/* Section 5 */}
      <Text style={styles.sectionTitle}>5. Intellectual Property Rights</Text>
      <Text style={styles.paragraph}>
        All content in the App — text, design, graphics, logos, images, videos,
        trademarks, software — is owned by Meltic Group.
      </Text>
      <Text style={styles.paragraph}>You may NOT:</Text>
      <Text style={styles.paragraph}>● Copy or modify</Text>
      <Text style={styles.paragraph}>● Distribute or reproduce</Text>
      <Text style={styles.paragraph}>● Create derivative works</Text>
      <Text style={styles.paragraph}>● Reverse-engineer the App</Text>
      <Text style={styles.paragraph}>
        Without written permission from Meltic Group.
      </Text>

      {/* Section 6 */}
      <Text style={styles.sectionTitle}>6. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        The App may include links or integrations with third-party platforms. We
        are not responsible for:
      </Text>
      <Text style={styles.paragraph}>● Their content</Text>
      <Text style={styles.paragraph}>● Their privacy practices</Text>
      <Text style={styles.paragraph}>● Their terms and conditions</Text>

      {/* Section 7 */}
      <Text style={styles.sectionTitle}>7. App Updates & Modifications</Text>
      <Text style={styles.paragraph}>
        We may release updates, improvements, or modifications at any time. We
        may also:
      </Text>
      <Text style={styles.paragraph}>● Modify features</Text>
      <Text style={styles.paragraph}>● Discontinue parts of the App</Text>
      <Text style={styles.paragraph}>● Suspend or close the App</Text>
      <Text style={styles.paragraph}>Without prior notice.</Text>

      {/* Section 8 */}
      <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        To the fullest extent permitted by law, Meltic Group is not liable for:
      </Text>
      <Text style={styles.paragraph}>● Indirect or consequential damages</Text>
      <Text style={styles.paragraph}>● Data loss or technical issues</Text>
      <Text style={styles.paragraph}>● Misuse of the App</Text>
      <Text style={styles.paragraph}>● Actions of third-party providers</Text>
      <Text style={styles.paragraph}>
        The App is provided “as is” and “as available”.
      </Text>

      {/* Section 9 */}
      <Text style={styles.sectionTitle}>9. Disclaimer</Text>
      <Text style={styles.paragraph}>We do not guarantee that:</Text>
      <Text style={styles.paragraph}>
        ● The App will be error-free or uninterrupted
      </Text>
      <Text style={styles.paragraph}>● Information is always accurate</Text>
      <Text style={styles.paragraph}>
        ● All features will work on all devices
      </Text>

      {/* Section 10 */}
      <Text style={styles.sectionTitle}>10. Termination</Text>
      <Text style={styles.paragraph}>
        We may suspend or terminate access to the App for:
      </Text>
      <Text style={styles.paragraph}>● Violations of Terms</Text>
      <Text style={styles.paragraph}>● Misuse or illegal activity</Text>
      <Text style={styles.paragraph}>● Security or technical issues</Text>
      <Text style={styles.paragraph}>
        Upon termination, you must uninstall and stop using the App.
      </Text>

      {/* Section 11 */}
      <Text style={styles.sectionTitle}>11. Governing Law</Text>
      <Text style={styles.paragraph}>
        These Terms are governed by the laws of India. Disputes will be handled
        in courts of Chandigarh, Punjab (or your preferred jurisdiction).
      </Text>

      {/* Section 12 */}
      <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
      <Text style={styles.paragraph}>
        We may update these Terms at any time. The “Last Updated” date will
        reflect revisions. Continued use of the App means you accept the updated
        Terms.
      </Text>

      {/* Section 13 */}
      <Text style={styles.sectionTitle}>13. Contact Information</Text>
      <Text style={styles.paragraph}>Meltic Group</Text>
      <Text style={styles.paragraph}>
        Website: https://www.melticgroup.com/
      </Text>
      <Text style={styles.paragraph}>Email: meltichealth.53@gmail.com</Text>
      <Text style={styles.paragraph}>
        Address: Nanhera Road Kuldeep Nagar, Ambala Cantt, India 133004
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
