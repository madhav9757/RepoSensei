import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // 👈 FULL backend URL
  withCredentials: true, // 👈 REQUIRED for cookies
});

export default api;
