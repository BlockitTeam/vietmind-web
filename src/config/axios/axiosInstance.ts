// utils/axios.ts
import axios from 'axios';
import { redirectToRoot } from '@/utils/redirect';
import Cookies from 'universal-cookie';

// Function to clear all cookies
const clearAllCookies = () => {
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  for (const cookie in allCookies) {
    cookies.remove(cookie);
  }
};

// Create an instance of Axios
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials with requests
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      clearAllCookies();
      redirectToRoot();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;