import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-9lc5.onrender.com/api/ver1",
  withCredentials: true, // to include cookies if your auth uses them
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// Interceptor for 401 errors (token expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch(Promise.reject);
      }

      isRefreshing = true;

      try {
        // 🔁 Request new access token using refresh token
        await axiosInstance.post("/admin/refreshToken");

        processQueue();
        return axiosInstance(originalRequest); // retry the failed request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        processQueue(refreshError, null);

        // Logout and redirect if refresh fails
        sessionStorage.removeItem("adminData");
        window.location.href = "/";
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
