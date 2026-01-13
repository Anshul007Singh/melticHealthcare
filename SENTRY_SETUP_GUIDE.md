# Sentry Setup Guide for Meltic Healthcare

This guide explains how to set up Sentry crash reporting and error monitoring for the Meltic Healthcare mobile application.

## What is Sentry?

Sentry is a real-time error tracking and monitoring platform that helps you:
- **Catch crashes** before users report them
- **Track errors** across iOS, Android, and Web
- **Monitor performance** and identify bottlenecks
- **Get context** about errors (device info, user actions, stack traces)
- **Fix issues faster** with detailed error reports

## Benefits for Meltic Healthcare

✅ **Proactive Error Detection** - Know about crashes immediately
✅ **Improved User Experience** - Fix issues before they affect many users
✅ **Better Debugging** - Full context with stack traces and breadcrumbs
✅ **Performance Monitoring** - Identify slow API calls and UI rendering issues
✅ **Release Health** - Track crash-free sessions and adoption rates

---

## Setup Instructions

### Step 1: Create Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Sign up for a free account (up to 5,000 errors/month free)
3. Create a new project:
   - **Platform:** React Native
   - **Project Name:** meltic-healthcare
   - **Team:** Your organization name

### Step 2: Install Sentry SDK

```bash
# Install Sentry React Native SDK
npm install --save @sentry/react-native

# iOS: Install CocoaPods dependencies
cd ios && pod install && cd ..

# Configure Sentry with Expo
npx @sentry/wizard -i reactNative -p ios android
```

### Step 3: Get Your DSN (Data Source Name)

After creating the project, Sentry will provide a DSN that looks like:
```
https://abc123def456@o123456.ingest.sentry.io/7890123
```

**⚠️ IMPORTANT:** Never commit your DSN directly to the codebase. Use environment variables.

### Step 4: Add DSN to Environment Variables

Update your `.env` files:

**.env.development**
```bash
EXPO_PUBLIC_SENTRY_DSN=your-development-dsn-here
EXPO_PUBLIC_SENTRY_ENVIRONMENT=development
```

**.env.production**
```bash
EXPO_PUBLIC_SENTRY_DSN=your-production-dsn-here
EXPO_PUBLIC_SENTRY_ENVIRONMENT=production
```

Update `eas.json` to include Sentry environment variables:

```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_SENTRY_DSN": "your-dev-dsn",
        "EXPO_PUBLIC_SENTRY_ENVIRONMENT": "development"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SENTRY_DSN": "your-prod-dsn",
        "EXPO_PUBLIC_SENTRY_ENVIRONMENT": "production"
      }
    }
  }
}
```

### Step 5: Create Sentry Configuration File

Create `config/sentry.ts`:

```typescript
import * as Sentry from '@sentry/react-native';
import { ENV } from './environment';

/**
 * Initialize Sentry error tracking
 *
 * Call this at the start of your app (in app/_layout.tsx)
 */
export function initializeSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('Sentry DSN not configured. Skipping Sentry initialization.');
    return;
  }

  Sentry.init({
    dsn,
    environment: ENV.APP_ENV,

    // Enable automatic session tracking
    enableAutoSessionTracking: true,

    // Set sample rate for production (100% = all errors, 0.5 = 50% of errors)
    sampleRate: ENV.IS_PRODUCTION ? 1.0 : 1.0,

    // Set traces sample rate (performance monitoring)
    tracesSampleRate: ENV.IS_PRODUCTION ? 0.2 : 1.0,

    // Enable native crash handling (iOS and Android)
    enableNative: true,

    // Enable automatic breadcrumbs (user actions, network requests, etc.)
    enableAutoSessionTracking: true,

    // Only enable in production (or staging)
    enabled: ENV.APP_ENV === 'production' || ENV.APP_ENV === 'staging',

    // Integrations
    integrations: [
      new Sentry.ReactNativeTracing({
        // Tracing configuration
        tracingOrigins: ['localhost', ENV.API_URL],
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
      }),
    ],

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive data from error reports
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }

      // Filter out specific errors (optional)
      if (event.exception?.values?.[0]?.value?.includes('Network request failed')) {
        // You can modify or drop network errors if they're too noisy
        return event;
      }

      return event;
    },
  });

  console.log('Sentry initialized for environment:', ENV.APP_ENV);
}

/**
 * Set user context for error reports
 * Call this after user logs in
 */
export function setSentryUser(user: { id: string; email: string; name?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

/**
 * Clear user context on logout
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Manually capture an exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('custom', context);
  }
  Sentry.captureException(error);
}

/**
 * Add breadcrumb (user action tracking)
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}
```

### Step 6: Initialize Sentry in Your App

Update `app/_layout.tsx`:

```typescript
import { initializeSentry } from '@/config/sentry';

// Initialize Sentry at app startup
initializeSentry();

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logError(error, 'App Root');
        // Sentry will automatically capture errors from ErrorBoundary
      }}
    >
      {/* Rest of your app */}
    </ErrorBoundary>
  );
}
```

### Step 7: Update Auth Context to Track Users

Update `context/authContext.tsx`:

```typescript
import { setSentryUser, clearSentryUser } from '@/config/sentry';

const login = async (token: string, userData?: User) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    if (userData) {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);

      // Track user in Sentry
      setSentryUser({
        id: userData.id.toString(),
        email: userData.email,
        name: userData.name,
      });
    }
    setIsLoggedIn(true);
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'userInfo']);
    setIsLoggedIn(false);
    setUser(null);

    // Clear user from Sentry
    clearSentryUser();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
```

### Step 8: Test Sentry Integration

Add a test button to trigger an error (development only):

```typescript
import * as Sentry from '@sentry/react-native';

// In your component
<Button
  onPress={() => {
    throw new Error('Test Sentry Error');
  }}
  title="Test Sentry"
/>
```

Or manually capture an error:

```typescript
try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}
```

---

## Usage Examples

### Tracking Custom Events

```typescript
import { addBreadcrumb } from '@/config/sentry';

// Track user actions
addBreadcrumb('User placed order', 'user-action', {
  orderId: order.id,
  total: order.total,
});

// Track navigation
addBreadcrumb('Navigated to Cart', 'navigation', {
  previousScreen: 'ProductList',
});
```

### Handling API Errors

Update `utils/errorHandler.ts`:

```typescript
import { captureException } from '@/config/sentry';

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

  // Send to Sentry in production
  if (ENV.IS_PRODUCTION) {
    captureException(error as Error, {
      context,
      errorType,
      message,
    });
  }
}
```

### Performance Monitoring

```typescript
import * as Sentry from '@sentry/react-native';

// Track slow operations
const transaction = Sentry.startTransaction({
  name: 'Load Product Data',
  op: 'http.client',
});

try {
  const products = await fetchProducts();
  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

---

## Sentry Dashboard Features

Once configured, you'll have access to:

### 1. **Issues Dashboard**
- Real-time error tracking
- Stack traces and error context
- Affected users count
- Error trends over time

### 2. **Performance Monitoring**
- Slow API calls
- Screen load times
- Database query performance
- Transaction traces

### 3. **Release Health**
- Crash-free session rate
- Crash-free user rate
- Session duration
- Adoption rate per release

### 4. **Alerts**
- Email notifications for new errors
- Slack/Discord integrations
- PagerDuty integration for critical errors

---

## Best Practices

### 1. **Filter Sensitive Data**
```typescript
beforeSend(event, hint) {
  // Remove passwords, tokens, credit card numbers
  if (event.request?.data) {
    delete event.request.data.password;
    delete event.request.data.cardNumber;
  }
  return event;
}
```

### 2. **Set Meaningful Contexts**
```typescript
Sentry.setContext('order', {
  orderId: currentOrder.id,
  status: currentOrder.status,
});
```

### 3. **Use Fingerprinting for Grouping**
```typescript
beforeSend(event, hint) {
  // Group similar errors together
  if (event.exception?.values?.[0]?.type === 'NetworkError') {
    event.fingerprint = ['network-error'];
  }
  return event;
}
```

### 4. **Sample Errors in Production**
Don't send 100% of errors to avoid quota limits:
```typescript
sampleRate: 0.5, // Send 50% of errors
tracesSampleRate: 0.1, // Track 10% of transactions
```

---

## Cost Considerations

**Free Tier:**
- 5,000 errors/month
- 10,000 performance units/month
- 30-day data retention
- 1 team member

**Team Plan ($26/month):**
- 50,000 errors/month
- 100,000 performance units/month
- 90-day data retention
- Unlimited team members

**For Meltic Healthcare:**
- Start with free tier
- Upgrade to Team plan when you hit limits
- Monitor usage in Sentry dashboard

---

## Troubleshooting

### Sentry not capturing errors?

1. Check DSN is configured correctly
2. Verify `enabled: true` in Sentry config
3. Check environment matches (development/production)
4. Test with a manual error: `throw new Error('Test')`

### Errors not showing in dashboard?

1. Wait 1-2 minutes for processing
2. Check sample rate isn't too low
3. Verify `beforeSend` isn't filtering out errors
4. Check quota limits in Sentry dashboard

### Build errors after installing Sentry?

```bash
# Clear cache and rebuild
npm start -- --reset-cache

# iOS: Clean build folder
cd ios && xcodebuild clean && cd ..
```

---

## Next Steps

1. ✅ Create Sentry account
2. ✅ Install SDK and configure DSN
3. ✅ Initialize Sentry in app/_layout.tsx
4. ✅ Add user tracking in authContext
5. ✅ Test error capturing
6. ✅ Set up Slack notifications (optional)
7. ✅ Configure release tracking in CI/CD
8. ✅ Review dashboard weekly

---

## Additional Resources

- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Expo + Sentry Guide](https://docs.expo.dev/guides/using-sentry/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Best Practices](https://docs.sentry.io/platforms/react-native/best-practices/)

---

**Questions?** Contact Sentry support or refer to their comprehensive documentation.

**Note:** This is an optional but highly recommended feature for production apps. Implement when you're ready to deploy to production.
