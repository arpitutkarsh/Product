import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-9lc5.onrender.com/api/ver1",
  withCredentials: true, // important: sends cookies
});

// Refresh control
let isRefreshing = false;
let failedQueue = [];

/**
 * processQueue - resolves or rejects pending requests queued during refresh
 * @param {Error|null} error
 */
const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

// Response interceptor: auto-refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If there's no response (network error), just reject
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;

    // If request was to refresh endpoint, don't try to refresh again
    const isRefreshEndpoint = originalRequest && originalRequest.url && originalRequest.url.includes("/admin/refresh");

    // Only try once per request
    if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue request while a refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        // Call refresh endpoint (cookie will be sent automatically)
        await axiosInstance.post("/admin/refresh");

        // Resolve queued requests
        processQueue(null);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // Reject queued requests
        processQueue(err);

        // Redirect to login page / root (frontend should clear session on route)
        // You might prefer to use a global logout function here instead of direct location change.
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
