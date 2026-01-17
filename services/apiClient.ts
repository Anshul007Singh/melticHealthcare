/**
 * Unified API Client
 * Handles all API requests with timeout, retry logic, and error classification
 */

const API_BASE = 'https://www.melticgroup.com/online/wp-json';
const CONSUMER_KEY = 'ck_8ed576e4b09fbadb918a2360c252064763a5a1d8';
const CONSUMER_SECRET = 'cs_55439183c9806d1a0ac32052649eeb8d6d387bc0';

const TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  API_ERROR = 'API_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
}

export interface ApiClientConfig {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  includeAuth?: boolean;
}

/**
 * Create a timeout promise that rejects after specified milliseconds
 */
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error: ApiError = {
        type: ErrorType.TIMEOUT_ERROR,
        message: `Request timed out after ${ms}ms`,
      };
      reject(error);
    }, ms);
  });
}

/**
 * Sleep for specified milliseconds (used for retry delay)
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Classify error into specific error type
 */
function classifyError(error: any): ApiError {
  // Network error (no internet connection)
  if (error.message === 'Network request failed' || error.message?.includes('Failed to fetch')) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'No internet connection. Please check your network.',
      originalError: error,
    };
  }

  // Timeout error
  if (error.type === ErrorType.TIMEOUT_ERROR) {
    return error;
  }

  // API error with status code
  if (error.statusCode) {
    return {
      type: ErrorType.API_ERROR,
      message: error.message || `API error: ${error.statusCode}`,
      statusCode: error.statusCode,
      originalError: error,
    };
  }

  // Parse error
  if (error.message?.includes('JSON') || error.message?.includes('parse')) {
    return {
      type: ErrorType.PARSE_ERROR,
      message: 'Failed to parse server response',
      originalError: error,
    };
  }

  // Unknown error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error.message || 'An unknown error occurred',
    originalError: error,
  };
}

/**
 * Build URL with auth parameters
 */
function buildUrl(endpoint: string, params: Record<string, any> = {}, includeAuth: boolean = true): string {
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`);

  // Add auth params if needed
  if (includeAuth) {
    url.searchParams.append('consumer_key', CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONSUMER_SECRET);
  }

  // Add other params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Make HTTP request with timeout and retry logic
 */
async function makeRequest(
  endpoint: string,
  options: RequestInit = {},
  config: ApiClientConfig = {}
): Promise<any> {
  const {
    timeout = TIMEOUT,
    maxRetries = MAX_RETRIES,
    retryDelay = INITIAL_RETRY_DELAY,
    includeAuth = true,
  } = config;

  let lastError: ApiError | null = null;

  // Retry loop
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add delay before retry (except first attempt)
      if (attempt > 0) {
        const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        await sleep(delay);
      }

      // Build URL
      const url = buildUrl(endpoint, {}, includeAuth);

      // Create fetch promise
      const fetchPromise = fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Race between fetch and timeout
      const response = await Promise.race([
        fetchPromise,
        createTimeoutPromise(timeout),
      ]);

      // Check response status
      if (!response.ok) {
        const error: ApiError = {
          type: ErrorType.API_ERROR,
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
        throw error;
      }

      // Parse JSON
      try {
        const data = await response.json();
        return data;
      } catch (parseError) {
        const error: ApiError = {
          type: ErrorType.PARSE_ERROR,
          message: 'Failed to parse server response',
          originalError: parseError,
        };
        throw error;
      }

    } catch (error: any) {
      lastError = classifyError(error);

      // Don't retry on certain errors
      if (
        lastError.type === ErrorType.PARSE_ERROR ||
        (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500)
      ) {
        // Client errors (4xx) and parse errors should not be retried
        break;
      }

      // Last attempt failed
      if (attempt === maxRetries) {
        break;
      }

      // Continue to next retry attempt
      continue;
    }
  }

  // All retries failed
  throw lastError;
}

/**
 * API Client
 */
export const apiClient = {
  /**
   * GET request
   */
  async get(endpoint: string, params: Record<string, any> = {}, config: ApiClientConfig = {}): Promise<any> {
    const url = buildUrl(endpoint, params, config.includeAuth ?? true);
    return makeRequest(url, { method: 'GET' }, config);
  },

  /**
   * POST request
   */
  async post(endpoint: string, body: any = {}, config: ApiClientConfig = {}): Promise<any> {
    return makeRequest(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      config
    );
  },

  /**
   * PUT request
   */
  async put(endpoint: string, body: any = {}, config: ApiClientConfig = {}): Promise<any> {
    return makeRequest(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      config
    );
  },

  /**
   * DELETE request
   */
  async delete(endpoint: string, config: ApiClientConfig = {}): Promise<any> {
    return makeRequest(endpoint, { method: 'DELETE' }, config);
  },
};

/**
 * Helper to check if user is online
 */
export async function checkNetworkConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
}
