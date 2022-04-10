import createThemeHelper from "react-theme-helper";

export const { useThemeInfo, nullishStringToThemeName, ThemeProvider } =
  createThemeHelper(["light", "dark", "christmas"]);

export type ThemeName = ReturnType<typeof useThemeInfo>["themeName"];
