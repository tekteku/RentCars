/**
 * RentCars Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: EUR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date));
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Calculate rental duration in hours
 * @param {string|Date} from - Start date
 * @param {string|Date} to - End date
 * @returns {number} Duration in hours
 */
export const calculateDuration = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  const diffMs = end - start;
  return Math.ceil(diffMs / (1000 * 60 * 60));
};

/**
 * Calculate total rental cost
 * @param {number} hours - Number of hours
 * @param {number} ratePerHour - Rate per hour
 * @param {boolean} includeDriver - Whether driver is included
 * @param {number} driverRate - Driver rate per hour (default: 30)
 * @returns {number} Total cost
 */
export const calculateTotalCost = (hours, ratePerHour, includeDriver = false, driverRate = 30) => {
  let total = hours * ratePerHour;
  if (includeDriver) {
    total += hours * driverRate;
  }
  return total;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get user from localStorage
 * @returns {object|null} User object or null
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Check if user is admin
 * @returns {boolean} Whether current user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * Check if user is logged in
 * @returns {boolean} Whether user is logged in
 */
export const isLoggedIn = () => {
  return !!getCurrentUser();
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Get car type label
 * @param {string} type - Car type code
 * @returns {string} Human readable car type
 */
export const getCarTypeLabel = (type) => {
  const types = {
    sedan: 'Sedan',
    suv: 'SUV',
    hatchback: 'Hatchback',
    coupe: 'Coupe',
    convertible: 'Convertible',
    wagon: 'Station Wagon',
    van: 'Van',
    truck: 'Truck',
    luxury: 'Luxury',
    sports: 'Sports Car',
    electric: 'Electric Vehicle'
  };
  return types[type?.toLowerCase()] || type;
};

/**
 * Get fuel type label
 * @param {string} type - Fuel type code
 * @returns {string} Human readable fuel type
 */
export const getFuelTypeLabel = (type) => {
  const types = {
    petrol: 'Petrol',
    diesel: 'Diesel',
    electric: 'Electric',
    hybrid: 'Hybrid',
    plugin_hybrid: 'Plug-in Hybrid'
  };
  return types[type?.toLowerCase()] || type;
};

/**
 * Calculate discount based on duration
 * @param {number} hours - Number of hours
 * @returns {number} Discount percentage
 */
export const calculateDurationDiscount = (hours) => {
  if (hours >= 168) return 20; // 7+ days = 20% off
  if (hours >= 72) return 10;  // 3+ days = 10% off
  if (hours >= 24) return 5;   // 1+ day = 5% off
  return 0;
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Get time ago string
 * @param {string|Date} date - Date to calculate from
 * @returns {string} Time ago string
 */
export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

/**
 * Storage helper with expiry
 */
export const storage = {
  set: (key, value, expiryMinutes = null) => {
    const item = {
      value,
      timestamp: Date.now(),
      expiry: expiryMinutes ? expiryMinutes * 60 * 1000 : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    try {
      const item = JSON.parse(itemStr);
      if (item.expiry && Date.now() - item.timestamp > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};
