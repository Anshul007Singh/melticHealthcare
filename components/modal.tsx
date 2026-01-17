import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'error' | 'info';
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title = 'Confirmation',
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  type = 'info',
  children,
}) => {
  const themeStyles = {
    success: {
      color: theme.colors.semantic.success,
      icon: 'check-circle',
      bg: theme.colors.semantic.successBackground,
    },
    error: {
      color: theme.colors.semantic.error,
      icon: 'error',
      bg: theme.colors.semantic.errorBackground,
    },
    info: {
      color: theme.colors.semantic.info,
      icon: 'info',
      bg: theme.colors.semantic.infoBackground,
    },
  }[type];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: themeStyles.bg },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <MaterialIcons
            name={themeStyles.icon as any}
            size={48}
            color={themeStyles.color}
          />
        </View>

        {/* Title */}
        {title ? (
          <Text style={[styles.title, { color: themeStyles.color }]}>
            {title}
          </Text>
        ) : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {children ? <View style={{ marginTop: theme.spacing.sm }}>{children}</View> : null}
        <Divider style={{ marginVertical: theme.spacing.lg }} />
        <View style={styles.buttonRow}>
          <Button
            mode='outlined'
            onPress={onClose}
            textColor={themeStyles.color}
            style={[styles.button, { borderColor: themeStyles.color }]}
          >
            {cancelText}
          </Button>

          {onConfirm ? (
            <Button
              mode='contained'
              onPress={onConfirm}
              buttonColor={themeStyles.color}
              textColor={theme.colors.background.primary}
              style={styles.button}
            >
              {confirmText}
            </Button>
          ) : (
            <Button
              mode='contained'
              onPress={onClose}
              buttonColor={themeStyles.color}
              textColor={theme.colors.background.primary}
              style={styles.button}
            >
              {confirmText}
            </Button>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    elevation: 6,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h4,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: theme.spacing.sm,
  },
  button: {
    width: '40%',
  },
});

export default CustomModal;
