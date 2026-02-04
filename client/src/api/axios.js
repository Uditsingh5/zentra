import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://zentra-o7c5.onrender.com";
const baseURL = `${API_BASE_URL.replace(/\/$/, "")}/api`;

const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token dynamically to each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    // Handle specific error codes
    if (error.response?.status === 401) {
      toast.error('Please login to continue');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later');
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      toast.error('Network error. Check your connection');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;