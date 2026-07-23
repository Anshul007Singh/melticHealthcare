import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  /** Current search value */
  value: string;
  /** Callback when text changes */
  onChangeText: (text: string) => void;
  /** Callback when search bar is focused */
  onFocus?: () => void;
  /** Callback when search bar is blurred */
  onBlur?: () => void;
  /** Callback when clear button is pressed */
  onClear?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether input should auto focus */
  autoFocus?: boolean;
  /** Whether input is editable */
  editable?: boolean;
  /** Custom style for container */
  containerStyle?: any;
}

/**
 * SearchBar Component
 *
 * Search input with icon and clear button.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={query}
 *   onChangeText={setQuery}
 *   onFocus={() => setModalVisible(true)}
 *   placeholder="Search products, categories, brands..."
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onClear,
  placeholder = 'Search products, categories, brands...',
  autoFocus = false,
  editable = true,
  containerStyle,
  ...textInputProps
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      accessibilityRole='search'
      accessibilityLabel='Search bar'
    >
      {/* Search Icon */}
      <Ionicons
        name='search-outline'
        color={theme.colors.neutral.gray500}
        style={styles.searchIcon}
      />

      {/* Text Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral.gray900}
        style={styles.input}
        autoFocus={autoFocus}
        editable={editable}
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='search'
        accessibilityLabel='Search input'
        accessibilityHint='Enter search query to find products, categories, or brands'
        {...textInputProps}
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          accessibilityRole='button'
          accessibilityLabel='Clear search'
          accessibilityHint='Double tap to clear search text'
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name='close-circle' color={theme.colors.neutral.gray400} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 0,
    minHeight: theme.layout.minTouchTarget,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
    fontSize: 20,
    color: theme.colors.primary.dark,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text.inverse,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  clearButtonPressed: {
    color: theme.colors.primary.contrast,
  },
});

export default SearchBar;
