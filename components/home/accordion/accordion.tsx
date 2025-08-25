import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, List, Text } from 'react-native-paper'; // Using Text from react-native-paper

const AccordionComponent = () => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
      <List.Accordion
        expanded={expanded}
        onPress={handlePress}
        title='H & Care Incorp - PCD Pharma Company'
        titleStyle={styles.title}
        style={styles.accordion}
      >
        <View>
          <Text style={styles.description}>
            H & Care Incorp is one of the best PCD pharma franchise company with
            pharmaceutical segments covering cardiovascular, diabetes,
            orthopedics, dermatology and general medicines range. Start your
            pharma franchise with our franchise opportunity in India. Benefit
            from a complete range of product categories to enter new markets
            with our PCD pharma franchise. We are supplying and marketing a
            complete range of GMP-certified Pharmaceutical Formulations, Herbal
            Products and Supplements.
          </Text>
          <View style={styles.buttons}>
            <Button
              mode='contained'
              onPress={() => console.log('Pressed')}
              style={styles.readMoreButton}
            >
              Read More..
            </Button>
            <Button
              mode='outlined'
              onPress={() => console.log('Pressed')}
              style={styles.requestButton}
              labelStyle={{ color: '#00368B' }}
            >
              Request For Quote
            </Button>
          </View>
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
  accordion: {
    backgroundColor: '#E8F1FF',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#00368B',
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
    color: '#00368B',
  },
  description: {
    marginLeft: 18,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  readMoreButton: {
    width: 130,
    backgroundColor: '#00368B',
  },
  requestButton: {
    width: 170,
    borderColor: '#00368B',
    borderWidth: 1,
  },
});

export default AccordionComponent;
