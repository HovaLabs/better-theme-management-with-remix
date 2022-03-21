import { createCookie } from "remix";

export const userPrefs = createCookie("userPrefs", {
  maxAge: 31_536_000, // one year
});
