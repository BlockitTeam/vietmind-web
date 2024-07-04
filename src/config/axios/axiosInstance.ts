import axios from "axios";

// Create an instance of Axios
let axiosInstance = axios.create({
  baseURL: "http://localhost:9001/api/v1/", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials with requests
});
export default axiosInstance;
