import React, { useState } from 'react';
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
} from 'react-native';
import { WebView } from 'react-native-webview';

const CARD_WIDTH = Dimensions.get('window').width * 0.28;

const visualAidItems = [
  {
    id: 1,
    name: 'Cardiever',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl:
      'https://drive.google.com/file/d/1JL7mXeaND4DSrH5ek2Fgb-vQzRatFBE0/preview',
  },
  {
    id: 2,
    name: 'Dalcon',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl:
      'https://drive.google.com/file/d/1wXDIPN0W-juA975DD5IkYoaSOD_soyOa/preview',
  },
  {
    id: 3,
    name: 'Meltic',
    image: require('../../assets/images/offers.jpg'),
    pdfUrl:
      'https://drive.google.com/file/d/1qm9M9zB4qAk5hW-_9-bjlAdSQty_eRCv/preview',
  },
];

const VisualAid = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    pdfUrl: string;
  } | null>(null);

  const openModal = (item: { name: string; pdfUrl: string }) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

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
        {visualAidItems.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => openModal(item)}
          >
            <Image
              source={item.image}
              style={styles.image}
              resizeMode='contain'
            />
            <Text style={styles.label}>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType='fade'
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedItem ? selectedItem.name : 'Visual Aid'}
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close ✕</Text>
                </TouchableOpacity>
              </View>

              {/* PDF Viewer */}
              {selectedItem && (
                <WebView
                  source={{ uri: selectedItem.pdfUrl }}
                  style={{ flex: 1 }}
                  originWhitelist={['*']}
                  startInLoadingState={true}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
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
    elevation: 10,
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
});
