import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { theme } from '@/constants/theme';

export interface InputProps extends TextInputProps {
  /** Label text above the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom input style */
  inputStyle?: TextStyle;
  /** Show required indicator */
  required?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Input Component
 *
 * A fully accessible text input with label, error states, and helper text.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   error="Invalid email"
 *   required
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  required = false,
  accessibilityLabel,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    textInputProps.editable === false && styles.inputDisabled,
    inputStyle,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TextInput
        style={inputContainerStyle}
        placeholderTextColor={theme.colors.text.tertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={helperText}
        accessibilityState={{
          disabled: textInputProps.editable === false,
        }}
        {...textInputProps}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.smallBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.semantic.error,
  },
  inputContainer: {
    ...theme.components.input.default,
  },
  inputFocused: {
    ...theme.components.input.focused,
  },
  inputError: {
    ...theme.components.input.error,
  },
  inputDisabled: {
    ...theme.components.input.disabled,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.text.error,
    marginTop: theme.spacing.xs,
  },
  helperText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});

export default Input;
