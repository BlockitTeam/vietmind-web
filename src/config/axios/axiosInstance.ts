import axios from "axios";

// Create an instance of Axios
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

let axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials with requests
});


export default axiosInstance;
