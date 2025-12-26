import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

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
      color: '#2E7D32',
      icon: 'check-circle',
      bg: '#E8F5E9',
    },
    error: {
      color: '#C62828',
      icon: 'error',
      bg: '#FFEBEE',
    },
    info: {
      color: '#1565C0',
      icon: 'info',
      bg: '#E3F2FD',
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
        {children ? <View style={{ marginTop: 10 }}>{children}</View> : null}
        <Divider style={{ marginVertical: 15 }} />
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
              textColor='white'
              style={styles.button}
            >
              {confirmText}
            </Button>
          ) : (
            <Button
              mode='contained'
              onPress={onClose}
              buttonColor={themeStyles.color}
              textColor='white'
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
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 25,
    elevation: 6,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button: {
    width: '40%',
  },
});

export default CustomModal;
