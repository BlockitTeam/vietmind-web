import axios from "axios";

// Create an instance of Axios
let axiosInstance = axios.create({
  baseURL: "http://91.108.104.57/proxy/api/v1/", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials with requests
});
export default axiosInstance;
