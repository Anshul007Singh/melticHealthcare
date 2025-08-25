import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Appbar,
  Button,
  Text,
  Card,
  Divider,
  Checkbox,
} from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from '@/context/cartContext';

export default function ProductDetailPage() {
  const { id, title, img, category } = useLocalSearchParams();
  console.log(id, title, img, category);
  const { addToCart } = useCart();
  const product = { id: '1', name: 'Etobix-120t', price: 120, quantity: 100 };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.card}>
          <Card.Content>
            <Image
              src={`${img}`}
              style={styles.productImage}
              resizeMode='contain'
            />
            <Text style={styles.label}>
              <Text style={styles.bold}>PACK SIZE: </Text>10x10 TABLETS
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>COMPOSITION: </Text>Etoricoxib I.P. 120
              mg.
            </Text>
            <Text style={styles.mrp}>MRP: 125/-</Text>
          </Card.Content>
        </Card>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>ETORICOXIB 120 MG (ALU ALU)</Text>
        <Text style={styles.category}>
          Category: <Text style={{ color: 'green' }}>{category}</Text>
        </Text>

        <Divider style={{ marginVertical: 16 }} />

        <Text variant='titleMedium' style={styles.reviewHeader}>
          Reviews 0
        </Text>
        <Text>There are no reviews yet.</Text>
        <Text style={{ marginTop: 8 }}>
          Be the first to review "ETOBIX-120 t"
        </Text>
        <Text style={styles.note}>
          Your email address will not be published. Required fields are marked *
        </Text>

        <Text style={styles.ratingLabel}>Your rating *</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((num) => (
            <Text key={num} style={styles.starBox}>
              ☆ {num} of 5
            </Text>
          ))}
        </View>

        <RNTextInput
          multiline
          numberOfLines={4}
          placeholder='Write your review...'
          style={styles.textArea}
        />
        <RNTextInput placeholder='Name *' style={styles.input} />
        <RNTextInput placeholder='Email *' style={styles.input} />

        <View style={styles.checkboxContainer}>
          <Checkbox status='checked' />
          <Text style={{ flex: 1 }}>
            Save my name, email, and website in this browser for the next time I
            comment.
          </Text>
        </View>

        <Button
          mode='contained'
          style={styles.submitButton}
          onPress={() => addToCart(product)}
        >
          Add to Cart
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16 },
  showAll: {
    color: '#018a44',
    textAlign: 'right',
    marginBottom: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 20,
    elevation: 2,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 350,
    alignSelf: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginVertical: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  mrp: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
    fontSize: 13,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  category: {
    fontSize: 15,
    marginBottom: 16,
  },
  reviewHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  note: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  ratingLabel: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  starBox: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 12,
    textAlignVertical: 'top',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 6,
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#018a44',
  },
});
