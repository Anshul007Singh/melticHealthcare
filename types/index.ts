/**
 * Shared Type Definitions for Meltic Healthcare Mobile Application
 *
 * This file contains all shared TypeScript type definitions used across the application.
 * Importing from this central location ensures type consistency and improves maintainability.
 */

/* ================= USER & AUTHENTICATION ================= */

export interface User {
  id: string | number;
  email: string;
  name: string;
  mobile?: string;
  token?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, user?: User) => Promise<void>;
  logout: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

/* ================= PRODUCTS ================= */

export interface Product {
  id: number;
  img: string;
  title: string;
  content: string;
  category: string;
  madeby: string;
  quantity: string;
  mrp: string;
}

export type ProductCategory =
  | 'Tablets'
  | 'Tonic'
  | 'Pediatric'
  | 'Capsule'
  | 'Derma'
  | 'Injection'
  | 'Sachets'
  | 'Drops'
  | 'Others';

/* ================= CART ================= */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  emptyCart: () => void;
}

/* ================= ORDERS ================= */

export interface WooOrder {
  id: number;
  status: OrderStatus;
  date_created: string;
  total: string;
  currency: string;
  billing?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  line_items?: OrderLineItem[];
  payment_method?: string;
  payment_method_title?: string;
  customer_note?: string;
}

export interface OrderLineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  subtotal: string;
  total: string;
  price: number;
  image?: {
    src: string;
  };
}

export type OrderStatus =
  | 'pending'
  | 'on-hold'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'refunded';

export interface OrderStatusConfig {
  label: string;
  bg: string;
  text: string;
}

export interface PlaceOrderRequest {
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
    name?: string;
    price?: number;
  }>;
  payment_method?: string;
  payment_method_title?: string;
  customer_note?: string;
}

/* ================= KYC ================= */

export interface KYCFormData {
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth: Date | null;
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  license20BFile: DocumentPickerAsset | null;
  license21BFile: DocumentPickerAsset | null;
  gstFile: DocumentPickerAsset | null;
  aadhaarFile: DocumentPickerAsset | null;
  panFile: DocumentPickerAsset | null;
}

export interface DocumentPickerAsset {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  type?: string;
}

export interface KYCSubmissionData {
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  aadhaarHash: string;
  panHash: string;
  aadhaarMasked: string;
  panMasked: string;
  gstNumber: string;
  license20B?: File;
  license21B?: File;
  gstFile?: File;
  aadhaarFile?: File;
  panFile?: File;
}

/* ================= CONTACT ================= */

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/* ================= API RESPONSES ================= */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OrderResponse {
  order_id: number;
  status: OrderStatus;
  message: string;
}

/* ================= MODAL ================= */

export interface ModalData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

/* ================= VISUAL AID ================= */

export interface VisualAidItem {
  id: number;
  title: string;
  image: string;
  pdfUrl?: string;
}

/* ================= ENVIRONMENT ================= */

export interface Environment {
  WC_BASE_URL: string;
  API_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
}

/* ================= NAVIGATION ================= */

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ProductDetail: { productId: number };
  Cart: undefined;
  OrderDetails: undefined;
  KYCDetails: undefined;
  Contact: undefined;
};

/* ================= UTILITY TYPES ================= */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/* ================= FORM VALIDATION ================= */

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

/* ================= HTTP HEADERS ================= */

export interface AuthHeader {
  Authorization?: string;
  'Content-Type'?: string;
}

export interface MultipartHeader extends AuthHeader {
  'Content-Type': 'multipart/form-data';
}

/* ================= DATE/TIME ================= */

export interface DateRange {
  fromDate: Date | null;
  toDate: Date | null;
}

/* ================= COMPONENT PROPS ================= */

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithStyle {
  style?: any;
}

export interface WithTestID {
  testID?: string;
}
