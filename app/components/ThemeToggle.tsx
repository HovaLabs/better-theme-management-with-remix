import * as React from "react";
import { useLocation, useSubmit, Form } from "remix";

import { nullishStringToThemeName, useThemeInfo } from "~/theme";

export default function ThemeToggle() {
  const { themeName, osThemeName, setThemeName } = useThemeInfo();
  const submitForm = useSubmit();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newTheme = nullishStringToThemeName(form.get("theme")?.toString());
    setThemeName(newTheme);
    submitForm(e.currentTarget, { action: "/", replace: true });
  };

  const url = `${location.pathname}${location.hash}${
    location.search ? `?${new URLSearchParams(location.search)}` : ""
  }`;

  return (
    <div style={{ display: "flex" }}>
      <Form method="post" onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="theme"
          value={(themeName ?? osThemeName) === "dark" ? "light" : "dark"}
        />
        <input type="hidden" name="url" value={url} />
        <button className="toggle" type="submit">
          Toggle Theme
        </button>
      </Form>
      <div style={{ width: 32 }} />
      <Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="theme" value="christmas" />
        <input type="hidden" name="url" value={url} />
        <button type="submit">Use Christmas Theme</button>
      </Form>
      <div style={{ width: 32 }} />
      <Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="theme" value={""} />
        <input type="hidden" name="url" value={url} />
        <button type="submit">Reset Theme Cookie</button>
      </Form>
    </div>
  );
}
