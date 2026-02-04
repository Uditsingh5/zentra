import axios from "axios";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}/api`
  : "/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
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
      const isRelativeApi = !import.meta.env.VITE_API_BASE_URL && (error.config?.baseURL === '/api' || String(error.config?.baseURL || '').startsWith('/'));
      toast.error(isRelativeApi
        ? 'API not configured: set VITE_API_BASE_URL (and VITE_SOCKET_URL) in Vercel to your backend URL, then redeploy.'
        : 'Resource not found');
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