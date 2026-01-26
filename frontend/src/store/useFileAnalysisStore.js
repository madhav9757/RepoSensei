import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/api/api";

const useFileAnalysisStore = create(
    persist(
        (set, get) => ({
            // Map of filePath -> analysisResults[]
            // Key format: "owner/repo/path/to/file" to avoid collisions across repos
            analysisCache: {},
            loading: false,
            error: null,

            // Action to analyze a file
            analyzeFile: async (owner, repo, filePath, code) => {
                const cacheKey = `${owner}/${repo}/${filePath}`;

                // Check cache first (optional: add invalidation logic later)
                // We only return if we have valid results. If it was an error before, we retry.
                const cached = get().analysisCache[cacheKey];
                if (cached && !cached.error) {
                    console.log("📦 Using cached analysis for", cacheKey);
                    return;
                }

                set({ loading: true, error: null });

                try {
                    const res = await api.post("/analyze", {
                        fileName: filePath,
                        code,
                    });

                    // Update cache
                    set((state) => ({
                        analysisCache: {
                            ...state.analysisCache,
                            [cacheKey]: {
                                timestamp: Date.now(),
                                suggestions: res.data.suggestions
                            },
                        },
                        loading: false,
                    }));
                } catch (err) {
                    console.error("Analysis failed:", err);
                    set({
                        loading: false,
                        error: "Analysis failed. Please try again."
                    });

                    // Optionally cache the error state or just leave it separate
                }
            },

            getCachedAnalysis: (owner, repo, filePath) => {
                const key = `${owner}/${repo}/${filePath}`;
                return get().analysisCache[key]?.suggestions || null;
            },

            clearCache: () => set({ analysisCache: {} })
        }),
        {
            name: "repo-sensei-file-analysis", // unique name for localStorage
            partialize: (state) => ({ analysisCache: state.analysisCache }), // persist only the cache
        }
    )
);

export default useFileAnalysisStore;
