import createThemeUtils from "./createThemeUtils";

export const { useTheme, ThemeContext, ThemeProvider, nullishStringToTheme } =
  createThemeUtils(["light", "dark", "pink"]);

export type Theme = ReturnType<typeof useTheme>["theme"];
