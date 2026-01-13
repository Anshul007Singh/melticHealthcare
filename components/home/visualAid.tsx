import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const CARD_WIDTH = Dimensions.get('window').width * 0.28;
const API_URL = 'https://www.melticgroup.com/online/wp-json/wp/v2/visual_aids';

type VisualAidItem = {
  id: number;
  name: string;
  image: string;
  pdfUrl: string | null;
};

const VisualAid = () => {
  const [items, setItems] = useState<VisualAidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VisualAidItem | null>(null);

  const extractPdfUrl = (html: string) => {
    const regex = /href="(https?:\/\/[^"]+\.pdf)"/;
    const match = html.match(regex);
    return match ? match[1] : null;
  };

  const getPdfViewerUrl = (url: string) =>
    `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url,
    )}`;

  const fetchVisualAids = async () => {
    try {
      const res = await axios.get(API_URL);

      const mapped: VisualAidItem[] = res.data.map((item: any) => {
        const pdfUrl = extractPdfUrl(item.content.rendered);

        const image = item.thumbnail
          ? item.thumbnail
          : item._links?.['wp:featuredmedia']?.[0]?.href || '';

        return {
          id: item.id,
          name: item.title.rendered,
          image,
          pdfUrl,
        };
      });

      setItems(mapped);
    } catch (e) {
      console.log('Visual Aid API error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisualAids();
  }, []);

  const openModal = (item: VisualAidItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Visual Aid</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => openModal(item)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode='contain'
            />
            <Text style={styles.label}>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType='fade'
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close ✕</Text>
                </TouchableOpacity>
              </View>

              {!selectedItem?.pdfUrl ? (
                <View style={styles.pdfLoader}>
                  <Text>No PDF available</Text>
                </View>
              ) : (
                <WebView
                  source={{ uri: getPdfViewerUrl(selectedItem.pdfUrl!) }}
                  style={{ flex: 1 }}
                  originWhitelist={['*']}
                  javaScriptEnabled
                  domStorageEnabled
                  startInLoadingState
                />
              )}
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VisualAid;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 10,
    width: '100%',
    height: 65,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  loader: {
    padding: 40,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#d9534f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pdfLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
