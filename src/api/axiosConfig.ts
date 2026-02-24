import axios from "axios";
import { useAuthStore } from "../stores/authStore";

// Create the instance
const api = axios.create({
  baseURL: "https://pindrop-backend-fc3j.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true if you decide to use HttpOnly Cookies later
});

/**
 * Request Interceptor
 * Runs before every request is sent to the server.
 */
api.interceptors.request.use(
  (config) => {
    // Access the token directly from the Zustand store
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error cases like 401 Unauthorized.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the request was made to the login endpoint
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    // Only trigger the auto-logout if it's a 401 AND it's NOT a login attempt
    if (error.response?.status === 401 && !isLoginRequest) {
      console.warn("Session expired. Logging out...");
      
      useAuthStore.getState().logout();
      
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;