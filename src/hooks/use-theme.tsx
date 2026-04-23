import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "lensly-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
