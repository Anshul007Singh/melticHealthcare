import Constants from 'expo-constants';

/**
 * Environment configuration for the Meltic Healthcare application
 *
 * Environment variables should be prefixed with EXPO_PUBLIC_ to be available in the app
 * Configure these in:
 * - .env files for local development
 * - eas.json for EAS builds
 * - Expo dashboard for OTA updates
 */

export const ENV = {
  // API Base URLs
  WC_BASE_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_WC_BASE_URL ||
                process.env.EXPO_PUBLIC_WC_BASE_URL ||
                'https://www.melticgroup.com/online',

  API_URL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
           process.env.EXPO_PUBLIC_API_URL ||
           'https://www.melticgroup.com/online/wp-json/app/v1',

  // App Environment
  APP_ENV: Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_ENV ||
           process.env.EXPO_PUBLIC_APP_ENV ||
           'development',

  // Feature flags
  IS_PRODUCTION: (Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_ENV ||
                  process.env.EXPO_PUBLIC_APP_ENV) === 'production',

  IS_DEVELOPMENT: __DEV__,
};

/**
 * Validate that all required environment variables are set
 */
export const validateEnvironment = (): void => {
  const requiredVars = ['WC_BASE_URL', 'API_URL'];

  for (const varName of requiredVars) {
    if (!ENV[varName as keyof typeof ENV]) {
      console.warn(`⚠️ Environment variable ${varName} is not set. Using default value.`);
    }
  }

  if (ENV.IS_DEVELOPMENT) {
    console.log('🔧 Running in DEVELOPMENT mode');
    console.log('API URL:', ENV.API_URL);
  }
};

// Run validation on import
validateEnvironment();
