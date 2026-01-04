// utils/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

// Create an instance of Axios
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Log the base URL for debugging
if (typeof window !== "undefined") {
  console.log("🔗 API Base URL:", apiBaseUrl);
}

const axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Bearer token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401/403 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token and redirect to login
      Cookies.remove("accessToken");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
