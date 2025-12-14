import axios from "axios";
import { message } from "antd";

const BASE_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000';

// Axios instance with interceptors for better error handling
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      message.error('Session expired. Please login again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
    return Promise.reject(error);
  }
);

/**
 * User Login Action
 * @param {Object} reqObj - Contains username and password
 */
export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  
  try {
    const response = await api.post('/api/users/login', reqObj);
    const userData = response.data;
    
    // Store user data with token
    const userToStore = {
      ...userData.data,
      token: userData.token
    };
    
    localStorage.setItem("user", JSON.stringify(userToStore));
    
    message.success("Login successful! Welcome back.");
    dispatch({ type: "LOGIN_SUCCESS", payload: userToStore });
    dispatch({ type: "LOADING", payload: false });
    
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
    
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials.";
    message.error(errorMessage);
    dispatch({ type: "LOGIN_FAILED", payload: errorMessage });
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * User Registration Action
 * @param {Object} reqObj - Contains username, password, and optional email
 */
export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await api.post('/api/users/register', reqObj);
    
    message.success("Registration successful! Please login.");
    dispatch({ type: "REGISTER_SUCCESS" });
    dispatch({ type: "LOADING", payload: false });
    
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
    
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
    message.error(errorMessage);
    dispatch({ type: "REGISTER_FAILED", payload: errorMessage });
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * User Logout Action
 */
export const userLogout = () => (dispatch) => {
  localStorage.removeItem("user");
  message.success("Logged out successfully");
  dispatch({ type: "LOGOUT" });
  window.location.href = "/login";
};

/**
 * Get User Profile Action
 */
export const getUserProfile = () => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  
  try {
    const response = await api.get('/api/users/profile');
    dispatch({ type: "GET_PROFILE_SUCCESS", payload: response.data.data });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.error("Get profile error:", error);
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * Update User Profile Action
 * @param {Object} profileData - Profile data to update
 */
export const updateUserProfile = (profileData) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  
  try {
    const response = await api.put('/api/users/profile', profileData);
    
    // Update local storage with new data
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    message.success("Profile updated successfully");
    dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: response.data.data });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.error("Update profile error:", error);
    const errorMessage = error.response?.data?.error || "Failed to update profile";
    message.error(errorMessage);
    dispatch({ type: "LOADING", payload: false });
  }
};

/**
 * Change Password Action
 * @param {Object} passwordData - Contains currentPassword and newPassword
 */
export const changePassword = (passwordData) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });
  
  try {
    await api.put('/api/users/profile', passwordData);
    message.success("Password changed successfully");
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.error("Change password error:", error);
    const errorMessage = error.response?.data?.error || "Failed to change password";
    message.error(errorMessage);
    dispatch({ type: "LOADING", payload: false });
  }
};