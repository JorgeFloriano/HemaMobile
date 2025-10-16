import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use your computer's IP address, not localhost!
// Find your IP: ipconfig (Windows) or ifconfig (Linux/Mac)

const API_BASE_URL = "http://10.183.230.214/Hema/public/api"; // Replace with your IP

//const API_BASE_URL = "http://192.168.0.110/Hema/public/api"; // Replace with your IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.log('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api;
