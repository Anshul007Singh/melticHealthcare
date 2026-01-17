import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './ui/Button';
import { Typography } from './ui/Typography';

interface Props {
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * React Error Boundary that catches JavaScript errors anywhere in the child component tree.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Error Icon */}
            <Ionicons
              name="bug-outline"
              color={theme.colors.semantic.error}
              style={styles.icon}
            />

            {/* Error Title */}
            <Typography
              variant="h3"
              color="error"
              style={styles.title}
            >
              Something went wrong
            </Typography>

            {/* Error Message */}
            <Typography
              variant="small"
              color="secondary"
              style={styles.message}
            >
              We encountered an unexpected error. Please try restarting the app.
            </Typography>

            {/* Error Details (development only) */}
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Typography
                  variant="caption"
                  color="tertiary"
                  style={styles.errorText}
                >
                  {this.state.error.toString()}
                </Typography>
              </View>
            )}

            {/* Reset Button */}
            <Button
              variant="primary"
              size="medium"
              onPress={this.handleReset}
              style={styles.resetButton}
              accessibilityLabel="Try again"
              accessibilityHint="Double tap to reset and try again"
            >
              Try Again
            </Button>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  message: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  errorDetails: {
    backgroundColor: theme.colors.neutral.gray100,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    maxWidth: '100%',
  },
  errorText: {
    fontFamily: 'monospace',
  },
  resetButton: {
    minWidth: 160,
  },
});

export default ErrorBoundary;
