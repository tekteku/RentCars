/**
 * Custom React Hooks for RentCars Application
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing local storage state
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * Hook for debouncing values (useful for search inputs)
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for handling window resize events
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * Hook for detecting mobile devices
 */
export const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  return width < breakpoint;
};

/**
 * Hook for handling online/offline status
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Hook for handling click outside of an element
 * @param {Function} handler - Handler to call when clicking outside
 */
export const useClickOutside = (handler) => {
  const ref = useRef();

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};

/**
 * Hook for handling keyboard shortcuts
 * @param {string} key - Key to listen for
 * @param {Function} callback - Callback to execute
 * @param {object} options - Options (ctrl, alt, shift, meta)
 */
export const useKeyPress = (key, callback, options = {}) => {
  useEffect(() => {
    const handler = (event) => {
      if (options.ctrl && !event.ctrlKey) return;
      if (options.alt && !event.altKey) return;
      if (options.shift && !event.shiftKey) return;
      if (options.meta && !event.metaKey) return;

      if (event.key.toLowerCase() === key.toLowerCase()) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options]);
};

/**
 * Hook for handling scroll position
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

/**
 * Hook for handling scroll direction
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > prevScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < prevScrollY) {
        setScrollDirection('up');
      }
      
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  return scrollDirection;
};

/**
 * Hook for handling document title
 * @param {string} title - Page title
 */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | RentCars` : 'RentCars - Premium Car Rental';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

/**
 * Hook for handling async operations with loading and error states
 */
export const useAsync = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  });

  const execute = useCallback(async (asyncFunction) => {
    setState({ loading: true, error: null, data: null });
    try {
      const data = await asyncFunction();
      setState({ loading: false, error: null, data });
      return data;
    } catch (error) {
      setState({ loading: false, error: error.message, data: null });
      throw error;
    }
  }, []);

  return { ...state, execute };
};

/**
 * Hook for handling previous value
 * @param {any} value - Current value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * Hook for toggling boolean state
 * @param {boolean} initialValue - Initial value
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
};

/**
 * Hook for handling favorites
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);

  const toggleFavorite = useCallback((carId) => {
    setFavorites((prev) => {
      const index = prev.indexOf(carId);
      if (index === -1) {
        return [...prev, carId];
      }
      return prev.filter((id) => id !== carId);
    });
  }, [setFavorites]);

  const isFavorite = useCallback((carId) => {
    return favorites.includes(carId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};

/**
 * Hook for handling car comparison
 */
export const useCompare = (maxItems = 3) => {
  const [compareList, setCompareList] = useLocalStorage('compareList', []);

  const addToCompare = useCallback((carId) => {
    setCompareList((prev) => {
      if (prev.includes(carId)) return prev;
      if (prev.length >= maxItems) {
        // Remove first item and add new one
        return [...prev.slice(1), carId];
      }
      return [...prev, carId];
    });
  }, [setCompareList, maxItems]);

  const removeFromCompare = useCallback((carId) => {
    setCompareList((prev) => prev.filter((id) => id !== carId));
  }, [setCompareList]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, [setCompareList]);

  const isInCompare = useCallback((carId) => {
    return compareList.includes(carId);
  }, [compareList]);

  return { compareList, addToCompare, removeFromCompare, clearCompare, isInCompare };
};
