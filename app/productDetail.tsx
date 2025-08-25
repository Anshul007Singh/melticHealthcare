import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Card, Divider, List } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from '../context/cartContext';

export default function ProductDetailScreen() {
  const {
    id,
    title,
    img,
    category,
    salePrice,
    sku,
    price,
    description,
    shortDescription,
  } = useLocalSearchParams();
  const { addToCart } = useCart();

  const [expandedDesc, setExpandedDesc] = useState(false);
  const [expandedSideEffects, setExpandedSideEffects] = useState(false);
  const [showRibbon, setShowRibbon] = useState(false);

  function parseDescription(description: string) {
    let decoded = description.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>');

    let plainText = decoded
      .replace(/<[^>]*>/g, '\n')
      .replace(/\n+/g, '\n')
      .trim();

    let lines = plainText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    let data = {
      name: lines[0] || '',
      composition: lines[1] || '',
      company: lines[2] || '',
      type: lines[3] || '',
      packaging: lines[5] || '',
      mrp: lines[7]?.replace('MRP :', '').trim() || '',
      description: '',
      sideEffects: '',
      indication: '',
    };

    let descIndex = lines.findIndex((l) => l.toLowerCase() === 'description');
    if (descIndex !== -1) {
      data.description = lines[descIndex + 1] || '';
    }

    let sideIndex = lines.findIndex((l) => l.toLowerCase() === 'side effects');
    if (sideIndex !== -1) {
      data.sideEffects = lines[sideIndex + 1] || '';
    }

    let indIndex = lines.findIndex((l) => l.toLowerCase() === 'indication');
    if (indIndex !== -1) {
      data.indication = lines[indIndex + 1] || '';
    }

    return data;
  }
  const descriptionData = parseDescription(description as string);

  const handleAddToCart = () => {
    const numericPrice =
      parseFloat(descriptionData.mrp.replace(/[^\d.]/g, '')) || 0;
    const item = {
      id: id as string,
      name: title as string,
      price: numericPrice,
      quantity: 1,
      image: img as string,
    };

    addToCart(item);
    setShowRibbon(true);
    setTimeout(() => setShowRibbon(false), 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Card style={styles.imageCard}>
          <Card.Cover
            source={{
              uri:
                typeof img === 'string'
                  ? img
                  : 'https://via.placeholder.com/300x200.png?text=Product+Image',
            }}
            style={{ resizeMode: 'contain' }}
          />
        </Card>

        <View style={styles.infoContainer}>
          <Text style={styles.productTitle}>{title || 'Product Name'}</Text>
          <Text style={styles.productSubTitle}>
            {category
              ? `Category: ${category}`
              : 'LEVOSALBUTAMOL 1.25mg + IPRATROPIUM BROMIDE 500mcg'}
          </Text>
          <Text style={styles.packInfo}>{sku}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>MRP - {descriptionData.mrp}</Text>
          <Text style={styles.priceText}>PTR ₹{salePrice}</Text>
        </View>

        <Text style={styles.minOrder}>
          Packaging: {descriptionData.packaging}
        </Text>

        <Text style={styles.sectionTitle}>Bulk Order</Text>
        <View style={styles.bulkOrderRow}>
          <Button mode='outlined' style={styles.bulkBtn}>
            1 Unit {descriptionData.mrp}
          </Button>
          <Button mode='outlined' style={styles.bulkBtn}>
            5 Units ₹1900
          </Button>
        </View>
        <View style={styles.bulkOrderRow}>
          <Button mode='outlined' style={styles.bulkBtn}>
            10 Units ₹3800
          </Button>
          <Button mode='outlined' style={styles.bulkBtn}>
            15 Units ₹5700
          </Button>
        </View>

        <Divider style={{ marginVertical: 10 }} />

        <Text style={styles.sectionTitle}>Composition</Text>
        <Text style={styles.composition}>{descriptionData.composition}</Text>

        <View style={styles.iconsRow}>
          <Text>✅ 100% genuine products</Text>
          <Text>📞 24x7 Support</Text>
        </View>

        <List.Section>
          <List.Accordion
            title='Description'
            expanded={expandedDesc}
            onPress={() => setExpandedDesc(!expandedDesc)}
          >
            <ScrollView style={{ maxHeight: 200, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 14 }}>
                {descriptionData.description}
              </Text>
            </ScrollView>
          </List.Accordion>
          <List.Accordion
            title='Side Effects'
            expanded={expandedSideEffects}
            onPress={() => setExpandedSideEffects(!expandedSideEffects)}
          >
            <ScrollView style={{ maxHeight: 200, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 14 }}>
                {descriptionData.sideEffects}
              </Text>
            </ScrollView>
          </List.Accordion>
        </List.Section>
      </ScrollView>

      <View style={styles.floatingBtnContainer}>
        <Button
          mode='contained'
          style={styles.floatingBtn}
          onPress={() => handleAddToCart()}
        >
          Add to Cart
        </Button>
      </View>
      {showRibbon && (
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>Item added to cart</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  imageCard: {
    marginBottom: 10,
    elevation: 2,
  },
  infoContainer: {
    marginVertical: 10,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productSubTitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  packInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  minOrder: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  bulkOrderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  bulkBtn: {
    flex: 1,
    marginHorizontal: 5,
  },
  composition: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  iconsRow: {
    marginVertical: 15,
  },
  floatingBtnContainer: {
    position: 'absolute',
    bottom: 20,
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
  },
  floatingBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    backgroundColor: '#0060AA',
  },
  ribbon: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    backgroundColor: '#93f3a7ff',
    padding: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 15,
  },
  ribbonText: {
    color: '#fff',
    fontWeight: 500,
    fontSize: 16,
  },
});
