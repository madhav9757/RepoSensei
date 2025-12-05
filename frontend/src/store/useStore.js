import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // ------------------
      // Auth State
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // ------------------
      // Theme State
      theme: typeof window !== 'undefined' && localStorage.getItem('reposensei-storage') 
        ? JSON.parse(localStorage.getItem('reposensei-storage')).state?.theme || 'light'
        : 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),

      // ------------------
      // Repositories State
      repositories: [],
      currentRepo: null,
      reposLoading: false,
      reposError: null,
      setRepositories: (repos) => set({ repositories: repos }),
      setCurrentRepo: (repo) => set({ currentRepo: repo }),
      setReposLoading: (loading) => set({ reposLoading: loading }),
      setReposError: (error) => set({ reposError: error }),
      addRepository: (repo) =>
        set((state) => ({ repositories: [...state.repositories, repo] })),
      updateRepository: (id, updates) =>
        set((state) => ({
          repositories: state.repositories.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      removeRepository: (id) =>
        set((state) => ({
          repositories: state.repositories.filter((r) => r.id !== id),
        })),

      // ------------------
      // Analysis State
      analyses: {},
      currentAnalysis: null,
      analysisLoading: false,
      analysisError: null,
      setAnalysis: (id, analysis) =>
        set((state) => ({ analyses: { ...state.analyses, [id]: analysis } })),
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      setAnalysisLoading: (loading) => set({ analysisLoading: loading }),
      setAnalysisError: (error) => set({ analysisError: error }),
      getAnalysis: (id) => get().analyses[id],

      // ------------------
      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ------------------
      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...notification, id: Date.now(), timestamp: new Date() },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // ------------------
      // Search & Filters
      searchQuery: '',
      filters: { language: 'all', sortBy: 'updated', order: 'desc' },
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () =>
        set({
          searchQuery: '',
          filters: { language: 'all', sortBy: 'updated', order: 'desc' },
        }),

      // ------------------
      // Reset all state
      resetStore: () =>
        set({
          user: null,
          isAuthenticated: false,
          repositories: [],
          currentRepo: null,
          analyses: {},
          currentAnalysis: null,
          notifications: [],
          searchQuery: '',
          filters: { language: 'all', sortBy: 'updated', order: 'desc' },
        }),
    }),
    {
      name: 'reposensei-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        filters: state.filters,
      }),
    }
  )
);

// ------------------
// Note: Import useStore directly in components and subscribe to individual values
// Example: const theme = useStore((state) => state.theme);
// This prevents object reference issues and infinite loops

export default useStore;