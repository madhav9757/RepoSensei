// src/store/useRepoStore.js
import { create } from "zustand";
import api from "@/api/api";

const useRepoStore = create((set) => ({
  repos: [],
  selectedRepo: null,
  repoTree: [],
  suggestions: [],
  loading: false,
  error: "",

  fetchUserRepos: async () => {
    set({ loading: true, error: "" });
    try {
      const res = await api.get("/repos"); // assumes backend fetches based on session
      set({ repos: res.data.data });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchRepoDetails: async (owner, repo) => {
    set({ loading: true, error: "" });
    try {
      const res = await api.get(`/repo/${owner}/${repo}`);
      set({ selectedRepo: res.data.data });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchRepoStructure: async (owner, repo) => {
    set({ loading: true, error: "" });
    try {
      const res = await api.get(`/repo/${owner}/${repo}/structure`);
      set({ repoTree: res.data.data });
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
