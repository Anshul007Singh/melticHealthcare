# Backend Requirements for Meltic Healthcare App Security Fixes

This document outlines the required backend changes to fully implement the security fixes made to the Meltic Healthcare mobile application.

## Table of Contents
1. [Overview](#overview)
2. [Critical Security Changes](#critical-security-changes)
3. [API Endpoint Updates](#api-endpoint-updates)
4. [Database Changes](#database-changes)
5. [Security Best Practices](#security-best-practices)
6. [Testing Requirements](#testing-requirements)

---

## Overview

The mobile app has been updated with critical security improvements. However, several changes require backend implementation to be fully effective.

**Priority:** CRITICAL
**Timeline:** Should be implemented before deploying the new mobile app version
**Impact:** Without these changes, some security vulnerabilities will remain partially unmitigated

---

## Critical Security Changes

### 1. WooCommerce Credentials - Remove from Client App ⚠️ CRITICAL

**Issue:** WooCommerce consumer key and secret were exposed in the mobile app code.

**Solution:** Backend must proxy all WooCommerce API calls through authenticated endpoints.

#### Required Changes:

**1.1 Create New Endpoint: `/place-order`**

**Purpose:** Handle order placement server-side with WooCommerce credentials stored securely on the backend.

**Endpoint:** `POST /wp-json/app/v1/place-order`

**Authentication:** Requires JWT token in `Authorization: Bearer <token>` header

**Request Body:**
```json
{
  "payment_method": "string",
  "payment_method_title": "string",
  "set_paid": boolean,
  "billing": {
    "first_name": "string",
    "last_name": "string",
    "address_1": "string",
    "address_2": "string",
    "city": "string",
    "state": "string",
    "postcode": "string",
    "country": "string",
    "email": "string",
    "phone": "string"
  },
  "shipping": {
    // Same structure as billing
  },
  "line_items": [
    {
      "product_id": number,
      "quantity": number
    }
  ],
  "shipping_lines": [
    {
      "method_id": "string",
      "method_title": "string",
      "total": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order_id": number,
  "order_number": "string",
  "status": "string",
  "total": "string",
  "currency": "string"
}
```

**Implementation (PHP - WordPress):**

```php
<?php
add_action('rest_api_init', function () {
    register_rest_route('app/v1', '/place-order', [
        'methods' => 'POST',
        'callback' => 'meltic_handle_place_order',
        'permission_callback' => 'meltic_check_jwt_auth',
    ]);
});

function meltic_check_jwt_auth() {
    // Verify JWT token
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('unauthorized', 'Invalid or expired token', ['status' => 401]);
    }
    return true;
}

function meltic_handle_place_order($request) {
    $user_id = get_current_user_id();

    // Get order data from request
    $order_data = $request->get_json_params();

    // CRITICAL: Store WooCommerce credentials in wp-config.php or environment variables
    $wc_key = defined('MELTIC_WC_CONSUMER_KEY') ? MELTIC_WC_CONSUMER_KEY : get_option('meltic_wc_consumer_key');
    $wc_secret = defined('MELTIC_WC_CONSUMER_SECRET') ? MELTIC_WC_CONSUMER_SECRET : get_option('meltic_wc_consumer_secret');

    // Make WooCommerce API call server-side
    $response = wp_remote_post(
        'https://www.melticgroup.com/online/wp-json/wc/v3/orders',
        [
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($wc_key . ':' . $wc_secret),
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode($order_data),
            'timeout' => 30,
        ]
    );

    if (is_wp_error($response)) {
        return new WP_Error('order_failed', $response->get_error_message(), ['status' => 500]);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    $status_code = wp_remote_retrieve_response_code($response);

    if ($status_code !== 201) {
        return new WP_Error('order_failed', $body['message'] ?? 'Failed to create order', ['status' => $status_code]);
    }

    return [
        'success' => true,
        'order_id' => $body['id'],
        'order_number' => $body['number'],
        'status' => $body['status'],
        'total' => $body['total'],
        'currency' => $body['currency'],
    ];
}
```

**Configuration (wp-config.php):**
```php
// Add these to wp-config.php (NEVER commit to version control)
define('MELTIC_WC_CONSUMER_KEY', 'ck_8ed576e4b09fbadb918a2360c252064763a5a1d8');
define('MELTIC_WC_CONSUMER_SECRET', 'cs_55439183c9806d1a0ac32052649eeb8d6d387bc0');
```

---

### 2. Fix IDOR Vulnerability in `/my-orders` ⚠️ CRITICAL

**Issue:** The mobile app was fetching ALL orders and filtering client-side. Any user could intercept the API response and view other customers' orders.

**Solution:** Implement server-side filtering by authenticated user's email.

#### Required Changes:

**2.1 Update Endpoint: `/my-orders`**

**Endpoint:** `GET /wp-json/app/v1/my-orders`

**Authentication:** Requires JWT token

**Query Parameters:**
```
per_page: number (default: 50)
orderby: string (default: 'date')
order: string (default: 'desc')
after: ISO 8601 date string (optional)
before: ISO 8601 date string (optional)
```

**Response:**
```json
[
  {
    "id": number,
    "status": "string",
    "date_created": "string",
    "total": "string",
    "currency": "string",
    "billing": {
      "email": "string",
      "first_name": "string",
      // ...
    },
    "line_items": [...]
  }
]
```

**CRITICAL Implementation Requirements:**
1. **MUST** verify JWT authentication
2. **MUST** filter orders by authenticated user's email SERVER-SIDE
3. **MUST NOT** return orders belonging to other users
4. Support date range filtering
5. Implement rate limiting (max 100 requests per hour per user)

**Implementation (PHP - WordPress):**

```php
<?php
add_action('rest_api_init', function () {
    register_rest_route('app/v1', '/my-orders', [
        'methods' => 'GET',
        'callback' => 'meltic_get_user_orders_secure',
        'permission_callback' => 'meltic_check_jwt_auth',
    ]);
});

function meltic_get_user_orders_secure($request) {
    // Get authenticated user
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('unauthorized', 'Invalid token', ['status' => 401]);
    }

    // Get user email (CRITICAL: Use the authenticated user's email, NOT from request)
    $user = get_userdata($user_id);
    $user_email = $user->user_email;

    // Get query parameters
    $per_page = $request->get_param('per_page') ?: 50;
    $after = $request->get_param('after');
    $before = $request->get_param('before');

    // Get WooCommerce credentials from secure storage
    $wc_key = defined('MELTIC_WC_CONSUMER_KEY') ? MELTIC_WC_CONSUMER_KEY : get_option('meltic_wc_consumer_key');
    $wc_secret = defined('MELTIC_WC_CONSUMER_SECRET') ? MELTIC_WC_CONSUMER_SECRET : get_option('meltic_wc_consumer_secret');

    // Build WooCommerce API URL with email filter SERVER-SIDE
    $args = [
        'consumer_key' => $wc_key,
        'consumer_secret' => $wc_secret,
        'per_page' => min($per_page, 100), // Cap at 100
        'customer' => $user_email, // WooCommerce filters by email
        'orderby' => 'date',
        'order' => 'desc',
    ];

    if ($after) $args['after'] = $after;
    if ($before) $args['before'] = $before;

    $url = add_query_arg($args, 'https://www.melticgroup.com/online/wp-json/wc/v3/orders');

    // Make request
    $response = wp_remote_get($url, ['timeout' => 30]);

    if (is_wp_error($response)) {
        return new WP_Error('fetch_failed', 'Could not fetch orders', ['status' => 500]);
    }

    $orders = json_decode(wp_remote_retrieve_body($response), true);

    // CRITICAL: Double-check email matches (defense in depth)
    // Even though WooCommerce should filter, verify again
    $filtered = array_filter($orders, function($order) use ($user_email) {
        return isset($order['billing']['email']) &&
               strtolower($order['billing']['email']) === strtolower($user_email);
    });

    return array_values($filtered);
}
```

**Security Testing:**
1. Login as User A, get JWT token
2. Make request to `/my-orders` - should see only User A's orders
3. Attempt to modify token or request to get User B's orders - should return 401
4. Verify NO client-side filtering is happening
5. Check that orders are filtered by the authenticated user's email, not a user-provided email

---

### 3. KYC Data Handling - Encrypted Sensitive Data ⚠️ CRITICAL

**Issue:** Mobile app was sending Aadhar and PAN numbers in cleartext.

**Solution:** Accept hashed values instead of cleartext sensitive data.

#### Required Changes:

**3.1 Update Endpoint: `/userinfo` (KYC Submission)**

**Endpoint:** `POST /wp-json/app/v1/userinfo`

**Authentication:** Requires JWT token

**Changes to Request Body:**

**OLD (INSECURE):**
```json
{
  "aadhaarNumber": "123456789012",  // ❌ CLEARTEXT
  "panNumber": "ABCDE1234F"          // ❌ CLEARTEXT
}
```

**NEW (SECURE):**
```json
{
  "aadhaarHash": "sha256_hash_value",     // ✅ SHA-256 hash
  "panHash": "sha256_hash_value",          // ✅ SHA-256 hash
  "aadhaarMasked": "XXXX-XXXX-1234",      // For display only
  "panMasked": "AB*****123",               // For display only
  "aadhaarFile": "file (multipart)",       // Actual Aadhar document
  "panFile": "file (multipart)",           // Actual PAN card document
  // ... other fields
}
```

**Implementation Requirements:**
1. **MUST** accept `aadhaarHash` and `panHash` instead of cleartext values
2. **MUST** validate file uploads (size < 5MB, types: PDF/JPEG only)
3. **MUST** store files in secure location (outside public web directory)
4. **MUST** add `.htaccess` to document folder to prevent direct access
5. **MUST** encrypt files at rest if possible
6. Store hashed values in database (not reversible)
7. Use uploaded documents for manual verification

**Implementation (PHP - WordPress):**

```php
<?php
add_action('rest_api_init', function () {
    register_rest_route('app/v1', '/userinfo', [
        'methods' => 'POST',
        'callback' => 'meltic_handle_kyc_submission',
        'permission_callback' => 'meltic_check_jwt_auth',
    ]);
});

function meltic_handle_kyc_submission($request) {
    $user_id = get_current_user_id();

    // Get hashed values (NOT cleartext)
    $aadhaar_hash = $request->get_param('aadhaarHash');
    $pan_hash = $request->get_param('panHash');

    // Validate hashes are provided
    if (empty($aadhaar_hash) || empty($pan_hash)) {
        return new WP_Error('missing_data', 'Aadhaar and PAN hashes are required', ['status' => 400]);
    }

    // Validate hash format (SHA-256 = 64 hex characters)
    if (strlen($aadhaar_hash) !== 64 || strlen($pan_hash) !== 64) {
        return new WP_Error('invalid_hash', 'Invalid hash format', ['status' => 400]);
    }

    // Validate file uploads
    $allowed_types = ['application/pdf', 'image/jpeg'];
    $max_size = 5 * 1024 * 1024; // 5MB

    foreach ($_FILES as $field => $file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return new WP_Error('upload_failed', "Failed to upload {$field}", ['status' => 400]);
        }

        if (!in_array($file['type'], $allowed_types)) {
            return new WP_Error('invalid_type', "Invalid file type for {$field}", ['status' => 400]);
        }

        if ($file['size'] > $max_size) {
            return new WP_Error('file_too_large', "{$field} exceeds 5MB limit", ['status' => 400]);
        }
    }

    // Store hashed values in user meta
    update_user_meta($user_id, 'aadhaar_hash', $aadhaar_hash);
    update_user_meta($user_id, 'pan_hash', $pan_hash);
    update_user_meta($user_id, 'aadhaar_masked', $request->get_param('aadhaarMasked'));
    update_user_meta($user_id, 'pan_masked', $request->get_param('panMasked'));

    // Store files in secure location
    $upload_dir = wp_upload_dir();
    $secure_dir = $upload_dir['basedir'] . '/kyc-documents/' . $user_id;

    if (!file_exists($secure_dir)) {
        mkdir($secure_dir, 0755, true);

        // CRITICAL: Add .htaccess to prevent direct access
        file_put_contents($secure_dir . '/.htaccess', "Deny from all\n<Files ~ \"\.pdf$\">\nDeny from all\n</Files>");
    }

    // Move uploaded files
    $files_moved = [];
    foreach ($_FILES as $field => $file) {
        $filename = sanitize_file_name($file['name']);
        $destination = $secure_dir . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $files_moved[$field] = $filename;
            update_user_meta($user_id, $field . '_filename', $filename);
        }
    }

    // Store other KYC details
    $kyc_data = [
        'company_name' => sanitize_text_field($request->get_param('companyName')),
        'pin_code' => sanitize_text_field($request->get_param('pinCode')),
        'drug_license' => sanitize_text_field($request->get_param('drugLicense')),
        'gst_available' => sanitize_text_field($request->get_param('gstAvailable')),
        'gst_number' => sanitize_text_field($request->get_param('gstNumber')),
        'license_20b' => sanitize_text_field($request->get_param('license20B')),
        'license_21b' => sanitize_text_field($request->get_param('license21B')),
        'anniversary' => sanitize_text_field($request->get_param('anniversary')),
    ];

    update_user_meta($user_id, 'kyc_data', $kyc_data);
    update_user_meta($user_id, 'kyc_submitted', true);
    update_user_meta($user_id, 'kyc_status', 'pending'); // For admin review

    return [
        'success' => true,
        'message' => 'KYC submitted successfully',
        'files_uploaded' => array_keys($files_moved),
    ];
}
```

---

## Database Changes

### 1. User Meta Keys

Add these user meta keys to store KYC data securely:

```sql
-- Hashed sensitive data (irreversible)
wp_usermeta.meta_key = 'aadhaar_hash' (VARCHAR 64)
wp_usermeta.meta_key = 'pan_hash' (VARCHAR 64)

-- Masked values for display
wp_usermeta.meta_key = 'aadhaar_masked' (VARCHAR 20)
wp_usermeta.meta_key = 'pan_masked' (VARCHAR 20)

-- File references
wp_usermeta.meta_key = 'aadhaarFile_filename' (VARCHAR 255)
wp_usermeta.meta_key = 'panFile_filename' (VARCHAR 255)
wp_usermeta.meta_key = 'license20BFile_filename' (VARCHAR 255)
wp_usermeta.meta_key = 'license21BFile_filename' (VARCHAR 255)
wp_usermeta.meta_key = 'gstFile_filename' (VARCHAR 255)

-- KYC status
wp_usermeta.meta_key = 'kyc_submitted' (BOOLEAN)
wp_usermeta.meta_key = 'kyc_status' (VARCHAR 20) -- 'pending', 'approved', 'rejected'
wp_usermeta.meta_key = 'kyc_data' (LONGTEXT) -- JSON serialized data
```

### 2. Security Indices

Add indices for faster queries:

```sql
CREATE INDEX idx_kyc_status ON wp_usermeta(meta_key, meta_value)
WHERE meta_key = 'kyc_status';
```

---

## Security Best Practices

### 1. Store Credentials Securely

**wp-config.php (NEVER commit to version control):**
```php
// WooCommerce API credentials
define('MELTIC_WC_CONSUMER_KEY', 'ck_8ed576e4b09fbadb918a2360c252064763a5a1d8');
define('MELTIC_WC_CONSUMER_SECRET', 'cs_55439183c9806d1a0ac32052649eeb8d6d387bc0');
```

### 2. Protect KYC Documents Directory

**Create `/wp-content/uploads/kyc-documents/.htaccess`:**
```apache
# Deny all access
Deny from all

# Prevent directory listing
Options -Indexes

# Prevent execution of PHP files
<FilesMatch "\.php$">
    Deny from all
</FilesMatch>
```

### 3. Implement Rate Limiting

Add rate limiting to prevent abuse:

```php
function meltic_check_rate_limit($user_id, $endpoint) {
    $transient_key = "rate_limit_{$user_id}_{$endpoint}";
    $requests = get_transient($transient_key);

    if ($requests === false) {
        set_transient($transient_key, 1, HOUR_IN_SECONDS);
        return true;
    }

    if ($requests >= 100) { // 100 requests per hour
        return false;
    }

    set_transient($transient_key, $requests + 1, HOUR_IN_SECONDS);
    return true;
}
```

### 4. Add Request Logging

Log all sensitive operations for auditing:

```php
function meltic_log_api_request($user_id, $endpoint, $action, $data = []) {
    $log_entry = [
        'timestamp' => current_time('mysql'),
        'user_id' => $user_id,
        'endpoint' => $endpoint,
        'action' => $action,
        'ip_address' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'],
        'data' => $data,
    ];

    // Store in custom table or file
    error_log(json_encode($log_entry), 3, '/path/to/api-logs/meltic-api.log');
}
```

---

## Testing Requirements

### 1. Security Testing Checklist

- [ ] Verify WooCommerce credentials are NOT in client app (decompile APK/IPA)
- [ ] Test IDOR vulnerability is fixed (User A cannot see User B's orders)
- [ ] Verify sensitive data is hashed in network traffic (use Charles Proxy)
- [ ] Test file upload validation (reject >5MB, reject .exe files)
- [ ] Verify KYC documents are not publicly accessible
- [ ] Test rate limiting (exceed 100 requests per hour)
- [ ] Verify JWT token expiration handling

### 2. Functional Testing

- [ ] Place order successfully with new endpoint
- [ ] View order history (only user's own orders)
- [ ] Submit KYC with hashed data
- [ ] Upload KYC documents successfully
- [ ] Test date range filtering in order history

### 3. Performance Testing

- [ ] Load test: 1000 concurrent users
- [ ] Response time for /my-orders < 500ms
- [ ] Response time for /place-order < 2s
- [ ] File upload time for 5MB < 10s

---

## Migration Plan

### Phase 1: Deploy Backend Changes (Week 1)
1. Add new `/place-order` endpoint
2. Update `/my-orders` with server-side filtering
3. Update `/userinfo` to accept hashed values
4. Store WooCommerce credentials in wp-config.php
5. Create secure KYC documents directory

### Phase 2: Testing (Week 1-2)
1. Test all endpoints in staging environment
2. Security testing (penetration testing)
3. Load testing
4. Fix any issues found

### Phase 3: Deploy Mobile App (Week 2)
1. Deploy backend changes to production
2. Keep old endpoints active for 2 weeks (backwards compatibility)
3. Deploy new mobile app version
4. Monitor error rates and user feedback

### Phase 4: Cleanup (Week 4)
1. Remove old insecure endpoints
2. Verify no users are on old app version
3. Update API documentation

---

## Support Contacts

**Mobile App Team:**
- Lead Developer: [Contact Info]
- Email: [Email]

**Backend Team:**
- Lead Developer: [Contact Info]
- Email: [Email]

**Security Contact:**
- Email: security@melticgroup.com

---

## Appendix

### A. API Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 401 | Unauthorized | Invalid or expired JWT token |
| 403 | Forbidden | User doesn't have permission |
| 400 | Bad Request | Invalid request data |
| 404 | Not Found | Endpoint not found |
| 500 | Server Error | Internal server error |
| 429 | Too Many Requests | Rate limit exceeded |

### B. Hash Format Reference

**Aadhaar Hash Example:**
- Input: `123456789012`
- Hash: `a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3` (SHA-256)

**PAN Hash Example:**
- Input: `ABCDE1234F`
- Hash: `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef` (SHA-256)

---

### C. Forgot Password Endpoint (NEW)

## 4. Forgot Password Feature

**Added:** 2026-01-13

The mobile app now includes a "Forgot Password" feature that allows users to reset their password via email.

### 4.1 Endpoint: POST /forgot-password

**Full URL:** `POST /wp-json/custom/v1/forgot-password`

**Authentication:** None required (public endpoint)

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset instructions have been sent to your email."
}
```

**Error Responses:**

**404 Not Found** - Email not found:
```json
{
  "success": false,
  "message": "No account found with that email address."
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "success": false,
  "message": "Too many reset requests. Please try again in 15 minutes."
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Failed to send reset email. Please contact support."
}
```

### 4.2 Implementation Requirements

#### Security Requirements:
1. **Rate Limiting:**
   - Max 3 requests per email per 15 minutes
   - Max 10 requests per IP per hour
   - Store rate limit data in transients or database

2. **Token Generation:**
   - Generate cryptographically secure random token (32 bytes minimum)
   - Hash token before storing in database (use wp_hash_password())
   - Set expiration time (recommended: 1 hour)
   - Store: user_id, token_hash, expiration_time

3. **Email Security:**
   - Do NOT reveal whether email exists in database
   - Always return success message (even if email not found)
   - This prevents email enumeration attacks

4. **Database Table:**
```sql
CREATE TABLE wp_password_reset_tokens (
  id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT(20) UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  KEY expires_at (expires_at)
);
```

### 4.3 WordPress/PHP Implementation

```php
<?php
// File: wp-content/plugins/meltic-custom-api/includes/forgot-password.php

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/forgot-password', [
        'methods' => 'POST',
        'callback' => 'meltic_handle_forgot_password',
        'permission_callback' => '__return_true', // Public endpoint
    ]);
});

function meltic_handle_forgot_password($request) {
    global $wpdb;

    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address.', ['status' => 400]);
    }

    // Check rate limiting
    $rate_limit_key = 'pwd_reset_' . md5($email);
    $attempts = get_transient($rate_limit_key);

    if ($attempts && $attempts >= 3) {
        return new WP_Error(
            'rate_limit',
            'Too many reset requests. Please try again in 15 minutes.',
            ['status' => 429]
        );
    }

    // Increment rate limit counter
    set_transient($rate_limit_key, ($attempts ? $attempts + 1 : 1), 15 * MINUTE_IN_SECONDS);

    // Check if user exists
    $user = get_user_by('email', $email);

    if (!$user) {
        // SECURITY: Don't reveal if email exists
        // Still return success to prevent email enumeration
        return [
            'success' => true,
            'message' => 'If an account exists with that email, you will receive password reset instructions.',
        ];
    }

    // Generate secure reset token
    $token = bin2hex(random_bytes(32)); // 64 character hex string
    $token_hash = wp_hash_password($token);

    // Store token in database
    $table_name = $wpdb->prefix . 'password_reset_tokens';
    $wpdb->insert(
        $table_name,
        [
            'user_id' => $user->ID,
            'token_hash' => $token_hash,
            'created_at' => current_time('mysql'),
            'expires_at' => date('Y-m-d H:i:s', strtotime('+1 hour')),
            'used' => 0,
        ],
        ['%d', '%s', '%s', '%s', '%d']
    );

    // Clean up old expired tokens
    $wpdb->query(
        "DELETE FROM {$table_name} WHERE expires_at < NOW() OR used = 1"
    );

    // Generate reset URL
    $reset_url = add_query_arg([
        'action' => 'reset_password',
        'token' => $token,
        'email' => urlencode($email),
    ], home_url('/password-reset/'));

    // Send email
    $to = $user->user_email;
    $subject = 'Password Reset Request - Meltic Healthcare';

    $message = "Hello {$user->display_name},\n\n";
    $message .= "We received a request to reset your password for your Meltic Healthcare account.\n\n";
    $message .= "Click the link below to reset your password:\n";
    $message .= "{$reset_url}\n\n";
    $message .= "This link will expire in 1 hour.\n\n";
    $message .= "If you didn't request this password reset, please ignore this email.\n\n";
    $message .= "Best regards,\n";
    $message .= "Meltic Healthcare Team";

    $headers = ['Content-Type: text/plain; charset=UTF-8'];

    $email_sent = wp_mail($to, $subject, $message, $headers);

    if (!$email_sent) {
        error_log('Failed to send password reset email to: ' . $email);
        return new WP_Error(
            'email_failed',
            'Failed to send reset email. Please try again later.',
            ['status' => 500]
        );
    }

    return [
        'success' => true,
        'message' => 'If an account exists with that email, you will receive password reset instructions.',
    ];
}
```

### 4.4 Password Reset Page (WordPress)

You'll also need to create a password reset page that handles the token verification and password update:

**Endpoint:** `POST /wp-json/custom/v1/reset-password`

**Request:**
```json
{
  "token": "abc123...",
  "email": "user@example.com",
  "new_password": "NewSecurePassword123!"
}
```

**Implementation:**
```php
<?php
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/reset-password', [
        'methods' => 'POST',
        'callback' => 'meltic_handle_reset_password',
        'permission_callback' => '__return_true',
    ]);
});

function meltic_handle_reset_password($request) {
    global $wpdb;

    $token = sanitize_text_field($request->get_param('token'));
    $email = sanitize_email($request->get_param('email'));
    $new_password = $request->get_param('new_password');

    // Validate inputs
    if (empty($token) || empty($email) || empty($new_password)) {
        return new WP_Error('missing_fields', 'All fields are required.', ['status' => 400]);
    }

    if (strlen($new_password) < 8) {
        return new WP_Error('weak_password', 'Password must be at least 8 characters.', ['status' => 400]);
    }

    $user = get_user_by('email', $email);
    if (!$user) {
        return new WP_Error('invalid_token', 'Invalid reset link.', ['status' => 404]);
    }

    // Verify token
    $table_name = $wpdb->prefix . 'password_reset_tokens';
    $stored_tokens = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$table_name}
         WHERE user_id = %d
         AND used = 0
         AND expires_at > NOW()
         ORDER BY created_at DESC",
        $user->ID
    ));

    $valid_token = false;
    $token_id = null;

    foreach ($stored_tokens as $stored) {
        if (wp_check_password($token, $stored->token_hash)) {
            $valid_token = true;
            $token_id = $stored->id;
            break;
        }
    }

    if (!$valid_token) {
        return new WP_Error('invalid_token', 'Invalid or expired reset link.', ['status' => 401]);
    }

    // Update password
    wp_set_password($new_password, $user->ID);

    // Mark token as used
    $wpdb->update(
        $table_name,
        ['used' => 1],
        ['id' => $token_id],
        ['%d'],
        ['%d']
    );

    return [
        'success' => true,
        'message' => 'Password reset successfully. You can now log in with your new password.',
    ];
}
```

### 4.5 Testing Checklist

- [ ] User receives reset email within 1 minute
- [ ] Reset link expires after 1 hour
- [ ] Used tokens cannot be reused
- [ ] Rate limiting works (max 3 attempts per 15 minutes)
- [ ] Non-existent emails don't reveal user doesn't exist
- [ ] Email HTML template looks professional
- [ ] Reset link works on mobile devices
- [ ] Password complexity requirements enforced
- [ ] Old tokens are cleaned up automatically

### 4.6 Email Template (Optional Enhancement)

For better user experience, consider using HTML email:

```php
function meltic_get_password_reset_email_html($user_name, $reset_url) {
    ob_start();
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0060AA, #001F60); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Meltic Healthcare</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <h2>Password Reset Request</h2>
                <p>Hello <?php echo esc_html($user_name); ?>,</p>
                <p>We received a request to reset your password for your Meltic Healthcare account.</p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="<?php echo esc_url($reset_url); ?>"
                       style="background: #0060AA; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="font-size: 12px; color: #666;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <?php echo esc_url($reset_url); ?>
                </p>
            </div>
            <div style="padding: 20px; text-align: center; font-size: 12px; color: #666;">
                <p>Meltic Healthcare © <?php echo date('Y'); ?>. All rights reserved.</p>
                <p>
                    <a href="mailto:info@meltichealth.com" style="color: #0060AA;">Contact Support</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    <?php
    return ob_get_clean();
}

// In wp_mail call, use:
$headers = ['Content-Type: text/html; charset=UTF-8'];
$message = meltic_get_password_reset_email_html($user->display_name, $reset_url);
wp_mail($to, $subject, $message, $headers);
```

---

**Document Version:** 1.1
**Last Updated:** 2026-01-13 (Added Forgot Password Feature)
**Status:** Pending Implementation
