import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:9001/', // Your backend URL
  withCredentials: true, // Include credentials with requests
});
export default axiosInstance;
