import * as React from "react";

export default function createThemeUtils<T extends string>(themes: T[]) {
  function nullishStringToTheme(themeString?: string | null): T | undefined {
    for (const theme of themes) {
      if (theme === themeString) return theme;
    }
    return undefined;
  }

  function getOsTheme(): T | undefined {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined"
    ) {
      return undefined;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)")) {
      return "dark" as T;
    }
    return "light" as T;
  }

  type ThemeContextValue = {
    theme: T | undefined;
  };
  const ThemeContext = React.createContext<ThemeContextValue>({
    theme: undefined,
  });

  const useTheme = (initialTheme?: string) => {
    const [theme, setTheme] = React.useState<T | undefined>(
      nullishStringToTheme(initialTheme)
    );
    const [osTheme, setOsTheme] = React.useState<T | undefined>(getOsTheme());

    React.useEffect(() => {
      function handleThemeChange(e: MediaQueryListEvent) {
        const newColorScheme = (e.matches ? "dark" : "light") as T;
        setOsTheme(newColorScheme);
      }

      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", handleThemeChange);
      return () => {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .removeEventListener("change", handleThemeChange);
      };
    }, [theme]);

    return { theme, setTheme, osTheme };
  };

  function ThemeProvider({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: T;
  }) {
    return (
      <ThemeContext.Provider value={{ theme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return {
    ThemeContext,
    useTheme,
    ThemeProvider,
    nullishStringToTheme,
  };
}
