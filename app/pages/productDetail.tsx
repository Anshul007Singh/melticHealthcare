import { Accordion, Button, H3, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { useCart } from '@/context/cartContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

export default function ProductDetailScreen() {
  const {
    id,
    title,
    img,
    category,
    price,
    description,
    shortDescription,
    sideEffects,
    indications,
  } = useLocalSearchParams();
  const { addToCart } = useCart();
  const router = useRouter();

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

  if (showPDF) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.pdfHeader}>
          <Button
            variant="secondary"
            onPress={() => setShowPDF(false)}
            style={{ margin: theme.spacing.sm }}
            accessibilityLabel="Close PDF viewer"
            accessibilityHint="Double tap to return to product details"
          >
            Close PDF
          </Button>
        </View>
        <WebView
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              pdfLink || 'NOT-AVAILABLE.pdf',
            )}`,
          }}
          style={{ flex: 1 }}
          startInLoadingState
          renderError={() => (
            <Typography
              variant="body"
              style={{ textAlign: 'center', marginTop: theme.spacing.xl }}
            >
              Failed to load PDF.
            </Typography>
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
        <View style={styles.imageCard}>
          <Image
            source={{
              uri:
                typeof img === 'string'
                  ? img
                  : 'https://via.placeholder.com/300x200.png?text=Product+Image',
            }}
            style={styles.productImage}
            accessibilityLabel={`${title} product image`}
            accessibilityRole="image"
          />
        </View>

        <View style={styles.infoContainer}>
          <H3 style={styles.productTitle}>{title || 'Product Name'}</H3>
          <Typography variant="small" style={styles.productSubTitle}>
            {category ? `Category: ${category}` : 'Category: Not specified'}
          </Typography>
        </View>
        <View style={styles.priceRow}>
          <Typography variant="h4" style={styles.priceText}>
            MRP - ₹{price}
          </Typography>
        </View>
        <Typography variant="small" style={styles.composition}>
          <Typography variant="smallBold">Composition: </Typography>
          {descriptionData.composition}
        </Typography>

        <Typography variant="small" style={styles.minOrder}>
          <Typography variant="smallBold">Packaging: </Typography>
          {descriptionData.type}
        </Typography>
        <View style={styles.divider} />

        <View style={styles.iconsRow}>
          <TouchableOpacity
            onPress={() => setShowPDF(true)}
            accessibilityRole="button"
            accessibilityLabel="View product composition PDF"
            accessibilityHint="Double tap to open PDF in full screen"
          >
            <Image
              source={require('../../assets/images/adobe.png')}
              style={{
                width: 70,
                height: 70,
                marginRight: theme.spacing.lg,
                marginBottom: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.xl,
              }}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Accordion
            title="Description"
            accessibilityLabel="Product description"
            accessibilityHint="Double tap to expand or collapse product description"
          >
            <ScrollView style={styles.accordionContent}>
              <Typography variant="small">{descriptionText.name}</Typography>
            </ScrollView>
          </Accordion>
          <Accordion
            title="Side Effects"
            accessibilityLabel="Product side effects"
            accessibilityHint="Double tap to expand or collapse side effects information"
          >
            <ScrollView style={styles.accordionContent}>
              <Typography variant="small">
                {sideEffectsText === ''
                  ? 'No side effect available.'
                  : sideEffectsText}
              </Typography>
            </ScrollView>
          </Accordion>
          <Accordion
            title="Indications"
            accessibilityLabel="Product indications"
            accessibilityHint="Double tap to expand or collapse indications information"
          >
            <ScrollView style={styles.accordionContentLast}>
              <Typography variant="small">
                {indicationsText === ''
                  ? 'No indications available.'
                  : indicationsText}
              </Typography>
            </ScrollView>
          </Accordion>
        </View>
      </ScrollView>

      <View style={styles.floatingBtnContainer}>
        <Button
          variant="primary"
          size="large"
          style={styles.floatingBtn}
          onPress={() => handleAddToCart()}
          accessibilityLabel={`Add ${title} to cart for ${price} rupees`}
          accessibilityHint="Double tap to add this product to your shopping cart"
        >
          Add to Cart
        </Button>
      </View>
      {showRibbon && (
        <View style={styles.ribbon}>
          <Typography variant="body" style={styles.ribbonText}>
            Item added to cart
          </Typography>
        </View>
      )}
    </View>
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
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  imageCard: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 390,
    resizeMode: 'contain',
  },
  infoContainer: {
    marginVertical: theme.spacing.sm,
  },
  productTitle: {
    ...theme.typography.h3,
  },
  pdfHeader: {
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.xs,
    alignItems: 'flex-start',
  },
  productSubTitle: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  packInfo: {
    ...theme.typography.small,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.sm,
  },
  priceText: {
    ...theme.typography.h4,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  minOrder: {
    ...theme.typography.small,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    ...theme.typography.bodyBold,
    marginVertical: theme.spacing.sm,
  },
  composition: {
    ...theme.typography.small,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  iconsRow: {},
  floatingBtnContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    width: Dimensions.get('window').width,
    paddingHorizontal: theme.spacing.xl,
  },
  floatingBtn: {
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary.main,
    marginVertical: theme.spacing.xxl,
  },
  ribbon: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.semantic.success,  // Changed from #93f3a7ff for better contrast (5.2:1 ratio)
    padding: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.lg,
  },
  ribbonText: {
    color: theme.colors.background.primary,  // Changed from #fff to use theme color
    ...theme.typography.body,
    fontWeight: '600',  // Override typography fontWeight
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutral.gray200,
    marginVertical: theme.spacing.sm,
  },
  accordionContent: {
    maxHeight: 200,
    paddingHorizontal: theme.spacing.lg,
  },
  accordionContentLast: {
    maxHeight: 200,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});
