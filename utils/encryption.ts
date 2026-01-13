import * as Crypto from 'expo-crypto';

/**
 * Security Utilities for Sensitive Data
 *
 * IMPORTANT: This provides basic client-side obfuscation through hashing.
 * For true end-to-end encryption, a proper PKI (Public Key Infrastructure)
 * system would be required.
 *
 * The hashed values allow the backend to:
 * - Verify data integrity
 * - Store in a non-reversible format
 * - Compare against uploaded documents for verification
 */

/**
 * Hash sensitive data using SHA-256 before transmission
 *
 * @param data - The sensitive data to hash (Aadhar number, PAN number, etc.)
 * @returns SHA-256 hash of the data
 */
export const hashSensitiveData = async (data: string): Promise<string> => {
  if (!data || data.trim().length === 0) {
    throw new Error('Cannot hash empty data');
  }

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data.trim().toUpperCase(), // Normalize before hashing
  );

  return hash;
};

/**
 * Mask Aadhaar number for display
 * Shows only last 4 digits: XXXX-XXXX-1234
 *
 * @param aadhaar - 12-digit Aadhaar number
 * @returns Masked Aadhaar number
 */
export const maskAadhaar = (aadhaar: string): string => {
  if (!aadhaar || aadhaar.length !== 12) {
    return aadhaar;
  }

  const cleaned = aadhaar.replace(/\D/g, ''); // Remove non-digits
  if (cleaned.length !== 12) {
    return aadhaar;
  }

  return `XXXX-XXXX-${cleaned.slice(-4)}`;
};

/**
 * Mask PAN number for display
 * Shows first 2 and last 3 characters: AB****123
 *
 * @param pan - 10-character PAN number
 * @returns Masked PAN number
 */
export const maskPAN = (pan: string): string => {
  if (!pan || pan.length !== 10) {
    return pan;
  }

  return `${pan.slice(0, 2)}XXXXX${pan.slice(-3)}`.toUpperCase();
};

/**
 * Validate Aadhaar number format
 * Must be exactly 12 digits
 *
 * @param aadhaar - Aadhaar number to validate
 * @returns true if valid format
 */
export const validateAadhaarFormat = (aadhaar: string): boolean => {
  const cleaned = aadhaar.replace(/\D/g, '');
  return cleaned.length === 12;
};

/**
 * Validate PAN number format
 * Must match pattern: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
 *
 * @param pan - PAN number to validate
 * @returns true if valid format
 */
export const validatePANFormat = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

/**
 * Format Aadhaar number with hyphens for display
 * 1234-5678-9012
 *
 * @param aadhaar - 12-digit Aadhaar number
 * @returns Formatted Aadhaar number
 */
export const formatAadhaar = (aadhaar: string): string => {
  const cleaned = aadhaar.replace(/\D/g, '');
  if (cleaned.length !== 12) {
    return aadhaar;
  }

  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
};
