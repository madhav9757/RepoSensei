import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with credentials
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    console.error("API Error:", message);
    
    // Redirect to home on 401 Unauthorized
    if (error.response?.status === 401) {
      window.location.href = "/";
    }
    
    return Promise.reject(error);
  }
);

// API methods
const api = {
  // Generic methods
  get: (url) => axiosInstance.get(url),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url),

  // Auth endpoints
  auth: {
    me: () => axiosInstance.get("/auth/me"),
    logout: () => axiosInstance.post("/auth/logout"),
    githubLogin: () => {
      window.location.href = `${API_BASE_URL}/auth/github/login`;
    },
  },

  // Repository endpoints
  repos: {
    getAll: (username) => axiosInstance.get(`/repos?username=${username}`),
    getOne: (owner, repo) => axiosInstance.get(`/repos/${owner}/${repo}`),
    getStructure: (owner, repo) => axiosInstance.get(`/repos/${owner}/${repo}/structure`),
    sync: () => axiosInstance.post("/repos/sync"),
  },

  // Analysis endpoints
  analysis: {
    byUrl: (repoUrl) => axiosInstance.post("/analyze", { repoUrl }),
    byOwnerRepo: (owner, repo) => axiosInstance.get(`/analyze/${owner}/${repo}`),
  },

  // Pull requests endpoints
  pullRequests: {
    getAll: (owner, repo, state = "all") => 
      axiosInstance.get(`/pr/${owner}/${repo}?state=${state}`),
    getOne: (owner, repo, number) => 
      axiosInstance.get(`/pr/${owner}/${repo}/${number}`),
  },

  // Suggestions endpoints
  suggestions: {
    get: (repoId) => axiosInstance.get(`/suggestions/${repoId}`),
    generate: (repoStructure) => 
      axiosInstance.post("/suggestions", { repoStructure }),
  },
};

export default api;