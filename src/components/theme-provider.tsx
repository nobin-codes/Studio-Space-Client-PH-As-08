
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "studio-space-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY);

      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme;
      } else {
        document.documentElement.dataset.theme = "dark";
      }
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme: Theme =
        currentTheme === "dark" ? "light" : "dark";

      document.documentElement.dataset.theme = nextTheme;

      try {
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch {
        // The theme still works for the current session.
      }

      return nextTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="theme-toggle group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full border px-4 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
    >
      <span className="relative flex size-5 items-center justify-center">
        {isDark ? (
          <Sun
            size={19}
            strokeWidth={2}
            className="transition-transform duration-500 group-hover:rotate-45"
          />
        ) : (
          <Moon
            size={19}
            strokeWidth={2}
            className="transition-transform duration-500 group-hover:-rotate-12"
          />
        )}
      </span>

      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
