import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = "https://zentra-o7c5.onrender.com";
const baseURL = `${BACKEND_URL}`;

console.log("🔌 Axios baseURL:", baseURL);

const API = axios.create({
  baseURL,
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
    console.log(`📡 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
API.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Error:", error.config?.url, error.status, error.message);
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      toast.error('Please login to continue');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Check your connection');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default API;