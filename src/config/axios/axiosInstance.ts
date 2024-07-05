import axios from "axios";

// Create an instance of Axios
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log('API Base URL:', apiBaseUrl);

let axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials with requests
});

axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});
export default axiosInstance;
