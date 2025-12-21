// src/store/useRepoStore.js
import { create } from "zustand";
import useAuthStore from "./authStore";
import api from "@/api/api";

const useRepoStore = create((set) => ({
  repos: [],
  selectedRepo: null,
  repoTree: [],
  suggestions: [],
  loading: false,
  error: "",

  // fetchUserRepos in Zustand store
  fetchUserRepos: async () => {
    set({ loading: true, error: "" });
    try {
      const user = useAuthStore.getState().user; 
      if (!user) throw new Error("User not logged in");
      const res = await api.get(`/repos?username=${user.username}`);
      set({ repos: res.data.data });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchRepoTree: async (id) => {
    set({ loading: true, error: "" });
    try {
      const res = await api.get(`/repo/${id}/tree`);
      set({ repoTree: res.data.data || [] });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchSuggestions: async (id) => {
    set({ loading: true, error: "" });
    try {
      const res = await api.get(`/suggestions/${id}`);
      set({ suggestions: res.data.data || [] });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },

  clearRepoData: () =>
    set({ selectedRepo: null, repoTree: [], suggestions: [], error: "" }),
}));

export default useRepoStore;
