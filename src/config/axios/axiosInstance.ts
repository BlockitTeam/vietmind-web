import axios from "axios";
import { useRouter } from 'next/router';
import Cookies from "universal-cookie";

// Function to clear all cookies

const cookies = new Cookies();

const clearAllCookies = () => {
  const allCookies = cookies.getAll();
  for (const cookie in allCookies) {
    cookies.remove(cookie);
  }
};

// Create an instance of Axios
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

let axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials with requests
});

// axiosInstance.interceptors.response.use(
//   response => response,
//   error => {
//     console.log("🚀 ~ error:", error)
//     if (error.response && error.response.status === 403) {
//       clearAllCookies();
//       if (typeof window !== 'undefined') {
//         // Client-side redirection
//         window.location.href = '/';
//       } else {
//         // Server-side redirection (if applicable)
//         const router = useRouter();
//         router.push('/login');
//       }
//     }
//     return Promise.reject(error);
//   }
// );
export default axiosInstance;
