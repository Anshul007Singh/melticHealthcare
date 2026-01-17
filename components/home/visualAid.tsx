import { ErrorCard, H3, Shimmer, Typography } from '@/components/ui';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

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
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);

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
    } catch (e: any) {
      console.error('Visual Aid API error', e);
      setError(e.message || 'Failed to load visual aids');
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

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <H3>Visual Aid</H3>
        </View>
        <ErrorCard
          title="Failed to Load"
          message={error}
          onRetry={fetchVisualAids}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <H3>Visual Aid</H3>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: theme.spacing.lg }}
        >
          {[...Array(4)].map((_, index) => (
            <View key={index} style={styles.card}>
              <Shimmer
                width={CARD_WIDTH}
                height={65}
                borderRadius={theme.borderRadius.md}
              />
              <View style={{ marginTop: theme.spacing.sm }}>
                <Shimmer
                  width={CARD_WIDTH * 0.8}
                  height={14}
                  borderRadius={4}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <H3>Visual Aid</H3>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: theme.spacing.lg }}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => openModal(item)}
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name} visual aid`}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode='contain'
              accessibilityIgnoresInvertColors
            />
            <Typography variant="caption" style={styles.label}>
              {item.name}
            </Typography>
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
                <Typography variant="h4" style={styles.modalTitle}>
                  {selectedItem?.name}
                </Typography>
                  <Ionicons onPress={closeModal} name='close' size={24} color={theme.colors.primary.main} />
              </View>

              {!selectedItem?.pdfUrl ? (
                <View style={styles.pdfLoader}>
                  <Typography>No PDF available</Typography>
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
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: theme.borderRadius.md,
    width: '100%',
    height: 65,
    resizeMode: 'cover',
  },
  label: {
    marginTop: theme.spacing.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    padding: theme.spacing.xxxl,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    height: '90%',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.gray100,
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  pdfLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
