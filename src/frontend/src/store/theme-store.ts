import type { Theme } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        applyTheme(next);
      },
    }),
    { name: "connectsphere-theme" },
  ),
);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

// Apply stored theme on module load
const stored = localStorage.getItem("connectsphere-theme");
const initial: Theme = stored
  ? (JSON.parse(stored) as { state: { theme: Theme } }).state.theme
  : "dark";
applyTheme(initial);
