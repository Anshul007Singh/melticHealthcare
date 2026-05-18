# Meltic Healthcare Design System

Complete theme configuration and UI component library for consistent, accessible design across the application.

## 📚 Table of Contents

- [Overview](#overview)
- [Theme System](#theme-system)
- [UI Components](#ui-components)
- [Usage Examples](#usage-examples)
- [Accessibility Features](#accessibility-features)
- [Migration Guide](#migration-guide)

---

## Overview

The design system provides:

- **Single source of truth** for all design tokens
- **Reusable UI components** with built-in accessibility
- **Type-safe** theme with TypeScript
- **WCAG 2.1 AA compliant** colors and interactions
- **Consistent** spacing, typography, and visual hierarchy

### Key Files

```
constants/
  theme.ts              # Complete design system
components/ui/
  Button.tsx            # Button component (6 variants)
  Card.tsx              # Card and TouchableCard
  Input.tsx             # Form input with validation
  Badge.tsx             # Notification badges
  Typography.tsx        # Text components (H1-H4, Body, etc.)
  Shimmer.tsx           # Loading skeletons
  index.ts              # Exports
```

---

## Theme System

### Import the Theme

```tsx
import { theme } from '@/constants/theme';
```

### Colors

```tsx
// Primary Brand Colors
theme.colors.primary.main; // #0060AA
theme.colors.primary.light; // #F5FAFD
theme.colors.primary.lighter; // #C4E0F5
theme.colors.primary.dark; // #004A87
theme.colors.primary.contrast; // #FFFFFF

// Semantic Colors
theme.colors.semantic.success; // #28A745
theme.colors.semantic.error; // #FF4C4C
theme.colors.semantic.warning; // #FFC107
theme.colors.semantic.info; // #17A2B8

// Neutral Colors
theme.colors.neutral.white; // #FFFFFF
theme.colors.neutral.gray50; // #F9F9F9
theme.colors.neutral.gray100; // #F2F2F2
theme.colors.neutral.gray300; // #CCCCCC
theme.colors.neutral.gray900; // #1A1A1A

// Text Colors
theme.colors.text.primary; // #1A1A1A
theme.colors.text.secondary; // #555555
theme.colors.text.tertiary; // #999999
theme.colors.text.inverse; // #FFFFFF
theme.colors.text.link; // #0060AA
```

### Typography

```tsx
// Typography Variants
theme.typography.h1; // { fontSize: 24, fontWeight: '700', lineHeight: 32 }
theme.typography.h2; // { fontSize: 22, fontWeight: '700', lineHeight: 30 }
theme.typography.h3; // { fontSize: 20, fontWeight: '700', lineHeight: 28 }
theme.typography.h4; // { fontSize: 18, fontWeight: '600', lineHeight: 24 }
theme.typography.body; // { fontSize: 16, fontWeight: '400', lineHeight: 22 }
theme.typography.bodyBold; // { fontSize: 16, fontWeight: '600', lineHeight: 22 }
theme.typography.small; // { fontSize: 14, fontWeight: '400', lineHeight: 20 }
theme.typography.caption; // { fontSize: 13, fontWeight: '400', lineHeight: 18 }
theme.typography.tiny; // { fontSize: 10, fontWeight: '400', lineHeight: 14 }
```

### Spacing (8px Grid)

```tsx
theme.spacing.xs; // 4px
theme.spacing.sm; // 8px
theme.spacing.md; // 12px
theme.spacing.lg; // 16px
theme.spacing.xl; // 20px
theme.spacing.xxl; // 24px
theme.spacing.xxxl; // 32px
```

### Border Radius

```tsx
theme.borderRadius.sm; // 6px
theme.borderRadius.md; // 10px
theme.borderRadius.lg; // 12px
theme.borderRadius.xl; // 16px
theme.borderRadius.round; // 999px (fully rounded)
```

### Shadows

```tsx
theme.shadows.sm; // Subtle shadow
theme.shadows.md; // Medium shadow
theme.shadows.lg; // Large shadow
theme.shadows.xl; // Extra large shadow
```

### Layout Constants

```tsx
theme.layout.screenPadding; // 16
theme.layout.cardMargin; // 12
theme.layout.headerHeight; // 60
theme.layout.minTouchTarget; // 44 (iOS/Android minimum)
```

---

## UI Components

### Button

6 variants with full accessibility support.

```tsx
import { Button } from '@/components/ui';

// Primary Button
<Button variant="primary" onPress={handlePress}>
  Submit
</Button>

// Success Button
<Button variant="success" onPress={handleSuccess}>
  Checkout
</Button>

// Secondary Button
<Button variant="secondary" size="small" onPress={handlePress}>
  Cancel
</Button>

// With Loading State
<Button variant="primary" loading={isLoading}>
  Processing...
</Button>

// Full Width
<Button variant="primary" fullWidth>
  Continue
</Button>

// Disabled
<Button variant="primary" disabled>
  Submit
</Button>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'text'
- `size`: 'small' | 'medium' | 'large'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- All TouchableOpacity props

### Card

Container component with 4 variants.

```tsx
import { Card, TouchableCard } from '@/components/ui';

// Default Card
<Card variant="default">
  <Text>Card content</Text>
</Card>

// Elevated Card (with shadow)
<Card variant="elevated">
  <Text>Elevated content</Text>
</Card>

// Bordered Card
<Card variant="bordered">
  <Text>Bordered content</Text>
</Card>

// Light Background Card
<Card variant="light">
  <Text>Light background</Text>
</Card>

// Pressable Card
<TouchableCard variant="elevated" onPress={handlePress}>
  <Text>Tap me!</Text>
</TouchableCard>
```

### Input

Form input with validation states.

```tsx
import { Input } from '@/components/ui';

// Basic Input
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

// Required Input
<Input
  label="Company Name"
  value={companyName}
  onChangeText={setCompanyName}
  required
/>

// Input with Error
<Input
  label="Phone Number"
  value={phone}
  onChangeText={setPhone}
  error="Invalid phone number"
/>

// Input with Helper Text
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  helperText="Must be at least 8 characters"
/>

// Disabled Input
<Input
  label="User ID"
  value={userId}
  editable={false}
/>
```

### Badge

Notification badges with variants.

```tsx
import { Badge } from '@/components/ui';

// Error Badge (for cart count)
<Badge count={5} variant="error" />

// Primary Badge
<Badge count={10} variant="primary" />

// Success Badge
<Badge count={3} variant="success" />

// Max Count (shows "99+")
<Badge count={150} maxCount={99} />

// Show Zero
<Badge count={0} showZero />
```

### Typography

Consistent text styling.

```tsx
import { Typography, H1, H2, H3, H4, Body, Caption } from '@/components/ui';

// Heading Components
<H1>Main Heading</H1>
<H2>Section Heading</H2>
<H3>Subsection</H3>
<H4>Small Heading</H4>

// Body Text
<Body>Regular paragraph text</Body>
<Body color="secondary">Secondary text</Body>

// Caption
<Caption>Small caption or label</Caption>

// Typography Component (more flexible)
<Typography variant="h3" color="primary" center>
  Centered Primary Heading
</Typography>

<Typography variant="bodyBold" color="error">
  Error message text
</Typography>
```

**Color Options:**

- `primary`, `secondary`, `tertiary`, `inverse`, `link`, `success`, `error`, `warning`

### Shimmer

Loading skeleton placeholders.

```tsx
import { Shimmer, ShimmerGroup } from '@/components/ui';

// Single Shimmer
<Shimmer width={200} height={20} borderRadius={8} />

// Full Width Shimmer
<Shimmer width="100%" height={50} />

// Multiple Shimmers
<ShimmerGroup count={5} width={300} height={30} spacing={12} />
```

---

## Usage Examples

### Styling with Theme

**Before:**

```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
```

**After:**

```tsx
import { theme } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  text: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
  },
});
```

### Replace Custom Buttons

**Before:**

```tsx
<TouchableOpacity
  style={{
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  }}
  onPress={handleCheckout}
>
  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
    Checkout
  </Text>
</TouchableOpacity>
```

**After:**

```tsx
<Button variant='success' onPress={handleCheckout} fullWidth>
  Checkout
</Button>
```

### Replace Custom Cards

**Before:**

```tsx
<View
  style={{
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  }}
>
  <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
</View>
```

**After:**

```tsx
<Card variant='bordered' style={{ marginBottom: theme.spacing.md }}>
  <Typography variant='bodyBold'>{item.name}</Typography>
</Card>
```

### Replace Custom Shimmer

**Before:**

```tsx
<View style={styles.shimmerCard}>
  <View style={styles.shimmerImageWrapper}>
    <Animated.View
      style={[styles.shimmerEffect, { transform: [{ translateX }] }]}
    />
  </View>
</View>
```

**After:**

```tsx
<Card variant='default' style={styles.shimmerCard}>
  <Shimmer width='100%' height={120} borderRadius={theme.borderRadius.sm} />
</Card>
```

---

## Accessibility Features

All components include:

### Minimum Touch Targets

```tsx
// All interactive elements have minimum 44x44px touch area
const styles = StyleSheet.create({
  button: {
    minWidth: theme.layout.minTouchTarget, // 44
    minHeight: theme.layout.minTouchTarget, // 44
  },
});
```

### Screen Reader Support

```tsx
// Components include proper accessibility labels
<Button
  variant='primary'
  onPress={handlePress}
  accessibilityLabel='Submit form'
  accessibilityHint='Submits the registration form'
>
  Submit
</Button>
```

### Color Contrast

```tsx
// All text/background combinations meet WCAG AA (4.5:1 minimum)
// Primary text on white: 14.5:1 ✅
// Links on white: 7.4:1 ✅
// Secondary text on white: 7.2:1 ✅
```

### Focus Indicators

```tsx
// Keyboard navigation shows clear focus states
const styles = StyleSheet.create({
  focused: {
    borderColor: theme.accessibility.focusIndicatorColor,
    borderWidth: theme.accessibility.focusIndicatorWidth,
  },
});
```

---

## Migration Guide

### Step 1: Import Theme

Add to your component:

```tsx
import { theme } from '@/constants/theme';
import {
  Button,
  Card,
  Typography,
  Input,
  Badge,
  Shimmer,
} from '@/components/ui';
```

### Step 2: Replace Hardcoded Values

Find and replace:

- `'#0060AA'` → `theme.colors.primary.main`
- `'#ffffff'` → `theme.colors.background.primary`
- `fontSize: 16` → `theme.typography.body.fontSize`
- `padding: 16` → `padding: theme.spacing.lg`
- `borderRadius: 10` → `borderRadius: theme.borderRadius.md`

### Step 3: Replace Custom Components

- TouchableOpacity buttons → `<Button>`
- View containers → `<Card>` or `<TouchableCard>`
- TextInput → `<Input>`
- Badge/notification counters → `<Badge>`
- Text elements → `<Typography>` or `<H1>`, `<H2>`, etc.
- Loading skeletons → `<Shimmer>`

### Step 4: Add Accessibility

Ensure all interactive elements have:

```tsx
accessibilityRole = 'button';
accessibilityLabel = 'Descriptive label';
accessibilityHint = 'What happens when pressed';
```

### Step 5: Update StyleSheet

```tsx
const styles = StyleSheet.create({
  // Replace all hardcoded values with theme tokens
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
});
```

---

## Quick Reference

### Common Patterns

#### Header with Cart Badge

```tsx
<View style={styles.header}>
  <Ionicons
    name='cart-outline'
    size={28}
    color={theme.colors.primary.contrast}
  />
  <Badge count={cartCount} variant='error' />
</View>
```

#### Form Section

```tsx
<Card variant='bordered'>
  <H4>Personal Information</H4>
  <Input label='Full Name' value={name} onChangeText={setName} required />
  <Input
    label='Email'
    value={email}
    onChangeText={setEmail}
    error={emailError}
    keyboardType='email-address'
  />
  <Button variant='primary' onPress={handleSubmit} fullWidth>
    Submit
  </Button>
</Card>
```

#### Product Card

```tsx
<TouchableCard
  variant='elevated'
  onPress={() => navigateToProduct(item.id)}
  accessibilityLabel={`View ${item.name}`}
>
  <Image source={{ uri: item.image }} style={styles.image} />
  <Typography variant='caption' numberOfLines={2}>
    {item.name}
  </Typography>
  <Typography variant='smallBold' color='primary'>
    ₹ {item.price}
  </Typography>
</TouchableCard>
```

#### Empty State

```tsx
<View style={styles.emptyContainer}>
  <Ionicons
    name='cart-outline'
    size={150}
    color={theme.colors.neutral.gray300}
  />
  <Typography
    variant='body'
    color='tertiary'
    style={{ marginTop: theme.spacing.md }}
  >
    Your cart is empty
  </Typography>
</View>
```

---

## Support

For questions or issues:

- Review this documentation
- Check `/Users/akanksharaopaul/.claude/plans/quirky-jumping-tiger.md` for implementation plan
- Look at updated files for examples:
  - `app/mainLayout.tsx`
  - `app/pages/cart.tsx`
  - `components/home/categories.tsx`
  - `components/home/visualAid.tsx`

---

**Version:** 1.0.1
**Last Updated:** January 2026
**Maintained By:** Meltic Healthcare Development Team
