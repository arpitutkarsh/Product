import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-9lc5.onrender.com/api/ver1",
  withCredentials: true, // sends cookies
});

// Refresh control
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);
    const status = error.response.status;

    const isRefreshEndpoint =
      originalRequest?.url?.includes("/admin/refresh");

    // 🔥 DEBUG LOG
    console.log("❗ AXIOS 401 ERROR", {
      url: originalRequest.url,
      status,
      cookiesSent: document.cookie, // httpOnly cookies will NOT appear
      serverMessage: error.response.data,
    });

    // Handle 401
    if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue pending requests
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("🔄 Attempting refresh… sending request to /admin/refreshToken");

        const refreshRes = await axiosInstance.post("/admin/refreshToken");

        console.log("🔐 Refresh success:", refreshRes.data);

        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (err) {
        console.log("❌ Refresh failed:", err.response?.data);

        processQueue(err);
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
