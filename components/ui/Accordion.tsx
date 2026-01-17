import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Typography } from './Typography';

export interface AccordionProps {
  /** Title of the accordion */
  title: string;
  /** Content to display when expanded */
  children: React.ReactNode;
  /** Initially expanded state */
  initiallyExpanded?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

/**
 * Accordion Component
 *
 * A collapsible accordion component for showing/hiding content.
 *
 * @example
 * ```tsx
 * <Accordion title="Product Description">
 *   <Typography>This is the product description...</Typography>
 * </Accordion>
 * ```
 */
export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  initiallyExpanded = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint || `Double tap to ${expanded ? 'collapse' : 'expand'}`}
        accessibilityState={{ expanded }}
      >
        <Typography variant="bodyBold" style={styles.title}>
          {title}
        </Typography>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    minHeight: 44,  // Minimum touch target size
  },
  title: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray100,
  },
});

export default Accordion;
