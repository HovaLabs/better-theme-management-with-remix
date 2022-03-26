import createThemeHelper from "react-theme-helper";

export const {
  useThemeName,
  ThemeContext, // Not using this one yet
  ThemeProvider,
  nullishStringToThemeName,
} = createThemeHelper(["light", "dark", "christmas"]);

export type ThemeName = ReturnType<typeof useThemeName>["themeName"];
