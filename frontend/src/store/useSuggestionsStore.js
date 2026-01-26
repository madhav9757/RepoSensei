import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/api/api";

const useSuggestionsStore = create(
    persist(
        (set, get) => ({
            // State
            suggestions: [],
            loading: false,
            error: null,
            lastFetchedRepo: null, // Track which repo was last fetched

            // Actions
            fetchSuggestions: async (owner, repo, goal = "Improve code quality") => {
                const repoKey = `${owner}/${repo}`;

                // Check if we already have suggestions for this repo
                if (get().lastFetchedRepo === repoKey && get().suggestions.length > 0) {
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

                    set({
                        suggestions: response.data.suggestions || [],
                        loading: false,
                        error: null,
                        lastFetchedRepo: repoKey,
                    });
                } catch (err) {
                    set({
                        error: err.response?.data?.message || err.message || "Failed to fetch suggestions",
                        loading: false,
                        suggestions: [],
                    });
                }
            },

            // Force refresh suggestions (bypass cache)
            refreshSuggestions: async (owner, repo, goal = "Improve code quality") => {
                set({ loading: true, error: null, suggestions: [] });

                try {
                    const response = await api.post("/suggestions", {
                        owner,
                        repo,
                        goal,
                    });

                    set({
                        suggestions: response.data.suggestions || [],
                        loading: false,
                        error: null,
                        lastFetchedRepo: `${owner}/${repo}`,
                    });
                } catch (err) {
                    set({
                        error: err.response?.data?.message || err.message || "Failed to fetch suggestions",
                        loading: false,
                        suggestions: [],
                    });
                }
            },

            // Clear suggestions
            clearSuggestions: () => {
                set({
                    suggestions: [],
                    error: null,
                    lastFetchedRepo: null,
                });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "ai-suggestions-storage",
            partialize: (state) => ({
                suggestions: state.suggestions,
                lastFetchedRepo: state.lastFetchedRepo,
            }),
        }
    )
);

export default useSuggestionsStore;
