import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { List } from 'react-native-paper';

const AccordionDetails = () => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
      <List.Accordion
        expanded={expanded}
        onPress={handlePress}
        titleStyle={{
          fontWeight: 700,
          fontSize: 15,
          color: '#00368B',
        }}
        style={{ backgroundColor: '#E8F1FF' }}
        title={`What Makes Us Best Pcd Pharma Franchise Company In India`}
      >
        <View>
          <Text style={{ marginLeft: 18 }}>
            <Text style={{ fontSize: 15, fontWeight: 700 }}>
              900+ WHO-DCGI Molecules 600+ Franchise Associates across India.
            </Text>
            {'\n'}
            <Text>
              We are an ISO 9001:2015 certified pharma company working with 600+
              associates and all products are CGMP/WHO-certified, excellent
              packaging with latest molecules and combinations. We provide
              high-quality products with monopoly rights, which means the
              freedom to operate with no competition and significant
              decision-making authority.
            </Text>
            {'\n'}
            <Text style={{ fontSize: 15, fontWeight: 700 }}>
              5 Marketing Divisions for PCD Pharma Franchise Business.
            </Text>
            {'\n'}
            <Text>
              5 Marketing Divisions for PCD Pharma Franchise Business H & Care
              Incorp, a name known for affordable and best quality medicines, is
              a best PCD pharma company in India. We have divided our operations
              into 5 distinct divisions, each dedicated to specific segments of
              the PCD business. With 5 dedicated marketing divisions, we are
              successfull in this highly competitive market. H & CARE INCORP is
              the best PCD Pharma Franchise Company in India. Today our company
              is widely a well reputed pharma company. We deliver across PAN
              India. Ask us for PCD Pharma Price List.
            </Text>
          </Text>
        </View>
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    margin: 8,
    backgroundColor: '#E8F1FF',
  },
  heading: {
    fontWeight: 500,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default AccordionDetails;
