import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api",
  withCredentials: true,
});

let csrfToken = null;
let isFetchingToken = null;

// Function to fetch a new CSRF token
export const fetchCsrfToken = async () => {
  if (isFetchingToken) return isFetchingToken;

  isFetchingToken = (async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api"}/csrf-token`, {
        withCredentials: true,
      });
      csrfToken = response.data.token;
      return csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return null;
    } finally {
      isFetchingToken = null;
    }
  })();

  return isFetchingToken;
};

// Request interceptor to add CSRF token to headers
api.interceptors.request.use(
  async (config) => {
    // Only add CSRF token for non-GET requests if validation is enabled
    if (config.method !== "get" && config.method !== "head" && config.method !== "options") {
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry or invalidation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get an EBADCSRFTOKEN error, try refreshing the token once
    if (error.response?.status === 403 && error.response?.data?.error?.code === "EBADCSRFTOKEN" && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await fetchCsrfToken();
      if (newToken) {
        originalRequest.headers["X-CSRF-Token"] = newToken;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
