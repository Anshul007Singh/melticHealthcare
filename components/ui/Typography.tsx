import React from 'react';
import {
  Text,
  TextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { theme } from '@/constants/theme';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodyBold'
  | 'small'
  | 'smallBold'
  | 'caption'
  | 'captionBold'
  | 'tiny';

type TextColor = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'success' | 'error' | 'warning';

export interface TypographyProps extends TextProps {
  /** Typography variant */
  variant?: TypographyVariant;
  /** Text color */
  color?: TextColor;
  /** Center align text */
  center?: boolean;
  /** Custom text style */
  style?: TextStyle;
  /** Child text content */
  children: React.ReactNode;
}

/**
 * Typography Component
 *
 * Provides consistent text styling across the app.
 *
 * @example
 * ```tsx
 * <Typography variant="h1" color="primary">
 *   Main Heading
 * </Typography>
 * <Typography variant="body" color="secondary">
 *   Body text content
 * </Typography>
 * ```
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'primary',
  center = false,
  style,
  children,
  ...textProps
}) => {
  const textStyle = [
    styles[variant],
    styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}` as keyof typeof styles],
    center && styles.center,
    style,
  ];

  return (
    <Text style={textStyle} {...textProps}>
      {children}
    </Text>
  );
};

// Convenience components
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

const styles = StyleSheet.create({
  // Variant styles
  h1: theme.typography.h1,
  h2: theme.typography.h2,
  h3: theme.typography.h3,
  h4: theme.typography.h4,
  body: theme.typography.body,
  bodyBold: theme.typography.bodyBold,
  small: theme.typography.small,
  smallBold: theme.typography.smallBold,
  caption: theme.typography.caption,
  captionBold: theme.typography.captionBold,
  tiny: theme.typography.tiny,

  // Color styles
  colorPrimary: {
    color: theme.colors.text.primary,
  },
  colorSecondary: {
    color: theme.colors.text.secondary,
  },
  colorTertiary: {
    color: theme.colors.text.tertiary,
  },
  colorInverse: {
    color: theme.colors.text.inverse,
  },
  colorLink: {
    color: theme.colors.text.link,
  },
  colorSuccess: {
    color: theme.colors.text.success,
  },
  colorError: {
    color: theme.colors.text.error,
  },
  colorWarning: {
    color: theme.colors.text.warning,
  },

  // Alignment
  center: {
    textAlign: 'center',
  },
});

export default Typography;
