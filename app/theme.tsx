import createThemeHelper from "react-theme-helper";

export const { useThemeName, nullishStringToThemeName } = createThemeHelper([
  "light",
  "dark",
  "christmas",
]);

export type ThemeName = ReturnType<typeof useThemeName>["themeName"];
