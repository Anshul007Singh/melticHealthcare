/**
 * Error Handling Utilities for Meltic Healthcare
 *
 * Centralized error handling for consistent error messages,
 * logging, and user feedback across the application.
 */

import { ApiError } from '@/types';
import { AxiosError } from 'axios';

/* ================= ERROR TYPES ================= */

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  originalError?: unknown;
}

/* ================= ERROR MESSAGES ================= */

const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: 'Network error. Please check your internet connection and try again.',
  [ErrorType.AUTHENTICATION]: 'Your session has expired. Please log in again.',
  [ErrorType.VALIDATION]: 'Invalid data submitted. Please check your input and try again.',
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.SERVER]: 'Server error. Please try again later.',
  [ErrorType.TIMEOUT]: 'Request timed out. Please check your connection and try again.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

/* ================= ERROR CLASSIFICATION ================= */

/**
 * Classifies an error based on its type and status code
 */
export function classifyError(error: unknown): ErrorType {
  if (!error) return ErrorType.UNKNOWN;

  // Check if it's an Axios error
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // No response (network error)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return ErrorType.TIMEOUT;
      }
      return ErrorType.NETWORK;
    }

    // Classify by status code
    const status = axiosError.response.status;
    if (status === 401 || status === 403) {
      return ErrorType.AUTHENTICATION;
    }
    if (status === 404) {
      return ErrorType.NOT_FOUND;
    }
    if (status === 400 || status === 422) {
      return ErrorType.VALIDATION;
    }
    if (status >= 500) {
      return ErrorType.SERVER;
    }
  }

  return ErrorType.UNKNOWN;
}

/**
 * Type guard to check if error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as any).isAxiosError === true
  );
}

/* ================= ERROR HANDLERS ================= */

/**
 * Handles API errors and returns user-friendly error messages
 *
 * @param error - The error object from an API call
 * @returns User-friendly error message
 */
export function handleApiError(error: unknown): string {
  const errorType = classifyError(error);

  // Try to extract custom error message from API response
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as any;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return typeof responseData.error === 'string'
        ? responseData.error
        : responseData.error.message || ERROR_MESSAGES[errorType];
    }
  }

  // Check if it's a standard Error object with a message
  if (error instanceof Error && error.message) {
    return error.message;
  }

  // Return default message for error type
  return ERROR_MESSAGES[errorType];
}

/**
 * Creates a standardized AppError object
 *
 * @param type - The error type
 * @param message - Custom error message (optional)
 * @param originalError - The original error object (optional)
 * @returns AppError object
 */
export function createAppError(
  type: ErrorType,
  message?: string,
  originalError?: unknown,
): AppError {
  const error = new Error(message || ERROR_MESSAGES[type]) as AppError;
  error.type = type;
  error.originalError = originalError;

  if (isAxiosError(originalError)) {
    error.statusCode = (originalError as AxiosError).response?.status;
  }

  return error;
}

/**
 * Logs error details (in production, send to error tracking service)
 *
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logError(error: unknown, context?: string): void {
  const errorType = classifyError(error);
  const message = handleApiError(error);

  console.error('Error occurred:', {
    type: errorType,
    message,
    context,
    timestamp: new Date().toISOString(),
    error,
  });

  // TODO: In production, send to error tracking service (Sentry, etc.)
  // Example: Sentry.captureException(error);
}

/* ================= VALIDATION HELPERS ================= */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Indian mobile number (10 digits starting with 6-9)
 */
export function isValidMobile(mobile: string): boolean {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
}

/**
 * Validates Aadhaar number (12 digits)
 */
export function isValidAadhaar(aadhaar: string): boolean {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
}

/**
 * Validates PAN number (format: ABCDE1234F)
 */
export function isValidPAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

/**
 * Validates GST number (15 characters)
 */
export function isValidGST(gst: string): boolean {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase());
}

/* ================= RETRY HELPERS ================= */

/**
 * Retries an async operation with exponential backoff
 *
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param delayMs - Initial delay between retries (doubles each time)
 * @returns Promise with the result or throws error
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on authentication errors
      if (classifyError(error) === ErrorType.AUTHENTICATION) {
        throw error;
      }

      // Don't retry on validation errors
      if (classifyError(error) === ErrorType.VALIDATION) {
        throw error;
      }

      // Don't retry if we've exhausted all attempts
      if (i === maxRetries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
    }
  }

  throw lastError;
}

/* ================= NETWORK STATUS ================= */

/**
 * Checks if device has network connectivity
 * Note: This is a basic check. For production, use @react-native-community/netinfo
 */
export async function isNetworkAvailable(): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
}

/* ================= ERROR BOUNDARY HELPER ================= */

/**
 * Formats error information for display in ErrorBoundary
 */
export function formatErrorForDisplay(error: Error): {
  title: string;
  message: string;
  technicalDetails?: string;
} {
  return {
    title: 'Oops! Something went wrong',
    message: 'We encountered an unexpected error. Please try again.',
    technicalDetails: __DEV__ ? error.stack || error.message : undefined,
  };
}
