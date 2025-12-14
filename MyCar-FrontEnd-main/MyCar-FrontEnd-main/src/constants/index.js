/**
 * Application Constants
 * Centralized constants for the RentCars application
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';
export const API_TIMEOUT = 15000; // 15 seconds

// Car Types
export const CAR_TYPES = [
  { value: 'sedan', label: 'Sedan', icon: '🚗' },
  { value: 'suv', label: 'SUV', icon: '🚙' },
  { value: 'hatchback', label: 'Hatchback', icon: '🚘' },
  { value: 'coupe', label: 'Coupe', icon: '🏎️' },
  { value: 'convertible', label: 'Convertible', icon: '🚕' },
  { value: 'wagon', label: 'Station Wagon', icon: '🚐' },
  { value: 'van', label: 'Van', icon: '🚐' },
  { value: 'truck', label: 'Truck', icon: '🛻' },
  { value: 'luxury', label: 'Luxury', icon: '✨' },
  { value: 'sports', label: 'Sports Car', icon: '🏎️' },
  { value: 'electric', label: 'Electric', icon: '⚡' },
];

// Fuel Types
export const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol', icon: '⛽' },
  { value: 'diesel', label: 'Diesel', icon: '🛢️' },
  { value: 'electric', label: 'Electric', icon: '⚡' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔋' },
  { value: 'plugin_hybrid', label: 'Plug-in Hybrid', icon: '🔌' },
];

// Transmission Types
export const TRANSMISSION_TYPES = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'cvt', label: 'CVT' },
];

// Booking Statuses
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: { label: 'Pending', color: 'orange' },
  [BOOKING_STATUS.CONFIRMED]: { label: 'Confirmed', color: 'blue' },
  [BOOKING_STATUS.IN_PROGRESS]: { label: 'In Progress', color: 'cyan' },
  [BOOKING_STATUS.COMPLETED]: { label: 'Completed', color: 'green' },
  [BOOKING_STATUS.CANCELLED]: { label: 'Cancelled', color: 'red' },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  OWNER: 'owner',
};

// Loyalty Tiers
export const LOYALTY_TIERS = [
  { name: 'Bronze', minPoints: 0, discount: 0, color: '#cd7f32', icon: '🥉' },
  { name: 'Silver', minPoints: 500, discount: 5, color: '#c0c0c0', icon: '🥈' },
  { name: 'Gold', minPoints: 1500, discount: 10, color: '#ffd700', icon: '🥇' },
  { name: 'Platinum', minPoints: 5000, discount: 15, color: '#e5e4e2', icon: '💎' },
  { name: 'Diamond', minPoints: 15000, discount: 20, color: '#b9f2ff', icon: '👑' },
];

// Price Ranges for filtering
export const PRICE_RANGES = [
  { min: 0, max: 25, label: 'Under €25/hr' },
  { min: 25, max: 50, label: '€25 - €50/hr' },
  { min: 50, max: 100, label: '€50 - €100/hr' },
  { min: 100, max: 200, label: '€100 - €200/hr' },
  { min: 200, max: Infinity, label: '€200+/hr' },
];

// Capacity Options
export const CAPACITY_OPTIONS = [
  { value: 2, label: '2 passengers' },
  { value: 4, label: '4 passengers' },
  { value: 5, label: '5 passengers' },
  { value: 7, label: '7 passengers' },
  { value: 8, label: '8+ passengers' },
];

// Driver Cost per hour
export const DRIVER_RATE_PER_HOUR = 30;

// Minimum booking hours
export const MIN_BOOKING_HOURS = 1;
export const MAX_BOOKING_HOURS = 720; // 30 days

// Date Format Constants
export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATE_TIME_FORMAT = 'MMM DD, YYYY HH:mm';

// Validation Rules
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  PHONE_REGEX: /^[\d\s\-+()]+$/,
  LICENSE_PLATE_REGEX: /^[A-Z0-9\-\s]+$/i,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back! You have been logged in successfully.',
  REGISTER: 'Account created successfully! Please login.',
  LOGOUT: 'You have been logged out successfully.',
  BOOKING_CREATED: 'Your booking has been confirmed!',
  BOOKING_CANCELLED: 'Booking cancelled successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  CAR_ADDED: 'New car added successfully.',
  CAR_UPDATED: 'Car details updated successfully.',
  CAR_DELETED: 'Car deleted successfully.',
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  ACCENT: '#f093fb',
  SUCCESS: '#52c41a',
  WARNING: '#fa8c16',
  DANGER: '#ff4d4f',
  INFO: '#1890ff',
  TEXT_PRIMARY: '#2d3748',
  TEXT_SECONDARY: '#718096',
  BACKGROUND: '#f5f7fa',
};

// Animation Durations (in ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (in px)
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  FAVORITES: 'favorites',
  COMPARE_LIST: 'compareList',
  REMEMBERED_USER: 'rememberedUser',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
};

// Features Flags
export const FEATURES = {
  ENABLE_SOCIAL_LOGIN: false,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_LOYALTY_PROGRAM: true,
  ENABLE_TRIP_PLANNER: true,
  ENABLE_CAR_COMPARISON: true,
  ENABLE_REVIEWS: true,
};
