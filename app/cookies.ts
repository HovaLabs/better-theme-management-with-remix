import { createCookie } from "remix";

export const userPrefs = createCookie("userPrefs", {
  maxAge: 604_800, // one week
});
