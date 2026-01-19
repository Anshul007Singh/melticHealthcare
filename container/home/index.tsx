import { ErrorBoundary } from '@/components/ErrorBoundary';
import Carousel from '@/components/home/carousel';
import PremiumProducts from '@/components/home/categories';
import Divsions from '@/components/home/division/divsion';
import HighQualityProducts from '@/components/home/featureProducts';
import VisualAid from '@/components/home/visualAid';
import { SearchBar, SearchModal } from '@/components/search';
import { theme } from '@/constants/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const Home = () => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleSearchFocus = () => {
    setSearchModalVisible(true);
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <View style={styles.search}>
          <SearchBar
            value=''
            onChangeText={() => {}}
            onFocus={handleSearchFocus}
            editable={true}
            placeholder='Search products, categories, brands...'
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Carousel />

          <VisualAid />

          <PremiumProducts />

          <HighQualityProducts />

          <Divsions />
        </ScrollView>

        <SearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
        />
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  search: {
    backgroundColor: theme.colors.primary.main,
  },
  scrollContent: {
    paddingBottom: theme.spacing.huge,
  },
});

export default Home;
