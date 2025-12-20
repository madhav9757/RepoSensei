import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      /* -------- STATE -------- */
      theme: "light", // "light" | "dark"

      /* -------- ACTIONS -------- */
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-store",
    }
  )
);

export default useThemeStore;
