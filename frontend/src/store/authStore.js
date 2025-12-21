import { create } from "zustand";
import api from "@/api/api";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  },
}));

export default useAuthStore;
