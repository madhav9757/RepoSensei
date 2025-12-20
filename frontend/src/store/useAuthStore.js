import { create } from "zustand";
import api from "@/utils/api";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // ------------------------------------
  // Restore session (called on app load)
  // ------------------------------------
  fetchMe: async () => {
    try {
      const res = await api.get("/auth/me", {
        withCredentials: true, // VERY IMPORTANT
      });

      set({
        user: res.data.user,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        loading: false,
      });
    }
  },

  // ------------------------------------
  // Logout
  // ------------------------------------
  logout: async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      set({ user: null });
      window.location.href = "/"; // hard reset is safest
    }
  },

  // ------------------------------------
  // OAuth Login (redirect)
  // ------------------------------------
  githubLogin: () => {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    window.location.href = `${API_BASE_URL}/auth/github/login`;
  },

  // ------------------------------------
  // Helpers
  // ------------------------------------
  isAuthenticated: () => !!useAuthStore.getState().user,
}));

export default useAuthStore;
