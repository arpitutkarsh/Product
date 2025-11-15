import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/ver1", // adjust as per your backend
});

export default axiosInstance;
