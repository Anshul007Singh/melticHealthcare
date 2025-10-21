import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Divider,
  List,
  Icon,
  IconButton,
} from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from '../context/cartContext';
import { WebView } from 'react-native-webview';

export default function ProductDetailScreen() {
  const {
    id,
    title,
    img,
    category,
    sku,
    price,
    description,
    shortDescription,
    sideEffects,
    indications,
  } = useLocalSearchParams();
  const { addToCart } = useCart();

  const [expandedDesc, setExpandedDesc] = useState(false);
  const [expandedSideEffects, setExpandedSideEffects] = useState(false);
  const [expandedIndication, setExpendedIndication] = useState(false);
  const [showRibbon, setShowRibbon] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const pdfLink =
    typeof shortDescription === 'string'
      ? shortDescription.split('href="')[1]?.split('"')[0]
      : undefined;

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
  const descriptionData = parseDescription(shortDescription as string);
  const descriptionText = parseDescription(description as string);
  const sideEffectsText =
    typeof sideEffects === 'string'
      ? sideEffects.replace(/<[^>]+>/g, '')
      : Array.isArray(sideEffects)
      ? sideEffects
          .map((s) => (typeof s === 'string' ? s.replace(/<[^>]+>/g, '') : ''))
          .join(', ')
      : '';
  const indicationsText =
    typeof indications === 'string'
      ? indications.replace(/<[^>]+>/g, '')
      : Array.isArray(indications)
      ? indications
          .map((s) => (typeof s === 'string' ? s.replace(/<[^>]+>/g, '') : ''))
          .join(', ')
      : '';
  const handleAddToCart = () => {
    const item = {
      id: id as string,
      name: title as string,
      price: price as any,
      quantity: 1,
      image: img as string,
    };

    addToCart(item);
    setShowRibbon(true);
    setTimeout(() => setShowRibbon(false), 2000);
  };

  const pdfUrl =
    'https://www.melticgroup.com/img/MELVET%20ANIMAL%20HEALTH%20PRODUCT%20CARD.pdf';

  if (showPDF) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.pdfHeader}>
          <Button
            mode='contained-tonal'
            onPress={() => setShowPDF(false)}
            style={{ margin: 8 }}
          >
            Close PDF
          </Button>
        </View>
        <WebView
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              pdfLink || pdfUrl,
            )}`,
          }}
          style={{ flex: 1 }}
          startInLoadingState
          renderError={() => (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Failed to load PDF.
            </Text>
          )}
        />
      </View>
    );
  }
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
            style={{ resizeMode: 'contain', height: 390 }}
          />
        </Card>

        <View style={styles.infoContainer}>
          <Text style={styles.productTitle}>{title || 'Product Name'}</Text>
          <Text style={styles.productSubTitle}>
            {category ? `Category: ${category}` : 'Category: Not specified'}
          </Text>
          {/* <Text style={styles.packInfo}>{sku}</Text> */}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>MRP - ₹{price}</Text>
        </View>
        <Text style={styles.composition}>
          <Text style={{ fontWeight: 'bold' }}>Composition: </Text>
          {descriptionData.composition}
        </Text>

        <Text style={styles.minOrder}>
          <Text style={{ fontWeight: 'bold' }}>Packaging: </Text>
          {descriptionData.type}
        </Text>
        <Divider style={{ marginVertical: 10 }} />

        <View style={styles.iconsRow}>
          <TouchableOpacity onPress={() => setShowPDF(true)}>
            <Icon source='file-pdf-box' size={60} color='red' />
          </TouchableOpacity>
        </View>

        <List.Section>
          <List.Accordion
            title='Description'
            expanded={expandedDesc}
            onPress={() => setExpandedDesc(!expandedDesc)}
          >
            <ScrollView style={{ maxHeight: 200, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 14 }}>{descriptionText.name}</Text>
            </ScrollView>
          </List.Accordion>
          <List.Accordion
            title='Side Effects'
            expanded={expandedSideEffects}
            onPress={() => setExpandedSideEffects(!expandedSideEffects)}
          >
            <ScrollView style={{ maxHeight: 200, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 14 }}>
                {sideEffectsText === ''
                  ? 'No side effect available.'
                  : sideEffectsText}
              </Text>
            </ScrollView>
          </List.Accordion>
          <List.Accordion
            title='Indications'
            expanded={expandedIndication}
            onPress={() => setExpendedIndication(!expandedIndication)}
          >
            <ScrollView style={{ maxHeight: 200, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 14 }}>
                {indicationsText === ''
                  ? 'No indications available.'
                  : indicationsText}
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
  pdfHeader: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 4,
    alignItems: 'flex-start',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#0060AA',
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
  composition: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  iconsRow: {},
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
