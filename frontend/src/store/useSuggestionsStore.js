import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/api/api";

const useSuggestionsStore = create(
  persist(
    (set, get) => ({
      // State: Map of repoKey -> suggestions array
      // suggestionsMap: { "owner/repo": [...] }
      suggestionsMap: {},
      loading: false,
      error: null,

      // Actions
      fetchSuggestions: async (owner, repo, goal = "Improve code quality") => {
        const repoKey = `${owner}/${repo}`;
        const currentSuggestions = get().suggestionsMap[repoKey];

        // Check if we already have suggestions for this repo
        if (currentSuggestions && currentSuggestions.length > 0) {
          console.log("📦 Using cached suggestions for", repoKey);
          return;
        }

        set({ loading: true, error: null });

        try {
          const response = await api.post("/suggestions", {
            owner,
            repo,
            goal,
          });

          set((state) => ({
            suggestionsMap: {
              ...state.suggestionsMap,
              [repoKey]: response.data.suggestions || [],
            },
            loading: false,
            error: null,
          }));
        } catch (err) {
          set({
            error:
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch suggestions",
            loading: false,
          });
        }
      },

      // Force refresh suggestions (bypass cache)
      refreshSuggestions: async (
        owner,
        repo,
        goal = "Improve code quality",
      ) => {
        const repoKey = `${owner}/${repo}`;
        set({ loading: true, error: null });

        try {
          const response = await api.post("/suggestions", {
            owner,
            repo,
            goal,
          });

          set((state) => ({
            suggestionsMap: {
              ...state.suggestionsMap,
              [repoKey]: response.data.suggestions || [],
            },
            loading: false,
            error: null,
          }));
        } catch (err) {
          set({
            error:
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch suggestions",
            loading: false,
          });
        }
      },

      // Get suggestions for a specific repo
      getSuggestionsForRepo: (owner, repo) => {
        const repoKey = `${owner}/${repo}`;
        return get().suggestionsMap[repoKey] || [];
      },

      // Clear suggestions for a specific repo or all
      clearSuggestions: (owner, repo) => {
        if (owner && repo) {
          const repoKey = `${owner}/${repo}`;
          set((state) => {
            const newMap = { ...state.suggestionsMap };
            delete newMap[repoKey];
            return { suggestionsMap: newMap };
          });
        } else {
          set({ suggestionsMap: {} });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "ai-suggestions-storage",
      partialize: (state) => ({
        suggestionsMap: state.suggestionsMap,
      }),
    },
  ),
);

export default useSuggestionsStore;
