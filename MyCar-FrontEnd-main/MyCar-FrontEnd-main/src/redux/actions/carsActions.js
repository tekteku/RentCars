import { message } from "antd";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';

// Axios instance with error handling
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Get All Cars with optional filters
 * @param {Object} filters - Optional filters (carType, fuelType, minPrice, maxPrice)
 */
export const getAllCars = (filters = {}) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/api/cars/getallcars?${queryParams}` : '/api/cars/getallcars';
    
    const response = await api.get(url);
    
    // Handle both old and new API response formats
    const cars = response.data.data || response.data;
    
    dispatch({ type: "GET_ALL_CARS", payload: cars });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.error("Error fetching cars:", error);
    message.error("Failed to load cars. Please try again.");
    dispatch({ type: "GET_ALL_CARS", payload: [] });
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * Get Single Car by ID
 * @param {string} carId - Car ID
 */
export const getCarById = (carId) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await api.get(`/api/cars/${carId}`);
    const car = response.data.data || response.data;
    
    dispatch({ type: "GET_CAR_BY_ID", payload: car });
    dispatch({ type: "LOADING", payload: false });
    return car;
  } catch (error) {
    console.error("Error fetching car:", error);
    message.error("Failed to load car details.");
    dispatch({ type: "LOADING", payload: false });
    return null;
  }
};

/**
 * Add New Car (Admin only)
 * @param {Object} reqObj - Car data
 */
export const addcar = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await api.post('/api/cars/addcar', reqObj);

    dispatch({ type: "ADD_CAR_SUCCESS", payload: response.data });
    dispatch({ type: "LOADING", payload: false });

    message.success("New car added successfully!");
    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  } catch (error) {
    console.error("Error adding car:", error);
    const errorMessage = error.response?.data?.error || "Failed to add car";
    message.error(errorMessage);
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * Edit Car (Admin only)
 * @param {Object} reqObj - Updated car data
 */
export const editcar = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await api.post('/api/cars/editcar', reqObj);

    dispatch({ type: "EDIT_CAR_SUCCESS", payload: response.data });
    dispatch({ type: "LOADING", payload: false });

    message.success("Car details updated successfully!");
    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  } catch (error) {
    console.error("Error editing car:", error);
    const errorMessage = error.response?.data?.error || "Failed to update car";
    message.error(errorMessage);
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * Delete Car (Admin only)
 * @param {Object} reqObj - Contains car ID
 */
export const deleteCar = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await api.post('/api/cars/deletecar', reqObj);

    dispatch({ type: "DELETE_CAR_SUCCESS", payload: reqObj._id });
    dispatch({ type: "LOADING", payload: false });

    message.success("Car deleted successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error("Error deleting car:", error);
    const errorMessage = error.response?.data?.error || "Failed to delete car";
    message.error(errorMessage);
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * Search Cars by name or type
 * @param {string} searchTerm - Search term
 */
export const searchCars = (searchTerm) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await api.get(`/api/cars/getallcars?search=${encodeURIComponent(searchTerm)}`);
    const cars = response.data.data || response.data;
    
    dispatch({ type: "SEARCH_CARS", payload: cars });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.error("Error searching cars:", error);
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * Toggle Favorite Car
 * @param {string} carId - Car ID to toggle favorite
 */
export const toggleFavorite = (carId) => (dispatch) => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const index = favorites.indexOf(carId);
  
  if (index === -1) {
    favorites.push(carId);
    message.success("Added to favorites!");
  } else {
    favorites.splice(index, 1);
    message.success("Removed from favorites");
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  dispatch({ type: "UPDATE_FAVORITES", payload: favorites });
};

/**
 * Get Favorite Cars
 */
export const getFavorites = () => (dispatch) => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  dispatch({ type: "GET_FAVORITES", payload: favorites });
};



