import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface SectionDividerProps {
  /** Visual variant of the divider */
  variant?: 'default' | 'invisible';
  /** Spacing above and below divider */
  spacing?: keyof typeof theme.spacing;
}

/**
 * SectionDivider Component
 *
 * A subtle divider for separating content sections.
 *
 * @example
 * ```tsx
 * <SectionDivider />
 * <SectionDivider variant="invisible" spacing="xl" />
 * ```
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'default',
  spacing = 'xl',
}) => {
  const spacingValue = theme.spacing[spacing];

  return (
    <View
      style={[
        styles.container,
        { marginVertical: spacingValue / 2 },
      ]}
    >
      {variant === 'default' && <View style={styles.line} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  line: {
    width: '90%',
    height: 1,
    backgroundColor: theme.colors.neutral.gray200,
  },
});

export default SectionDivider;
