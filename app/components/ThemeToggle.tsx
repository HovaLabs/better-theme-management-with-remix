import * as React from "react";
import { useSubmit, Form } from "remix";

import { nullishStringToThemeName, useThemeInfo } from "~/theme";

export default function ThemeToggle() {
  const { themeName, osThemeName, setThemeName } = useThemeInfo();
  const submitForm = useSubmit();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newTheme = nullishStringToThemeName(form.get("theme")?.toString());
    setThemeName(newTheme);
    submitForm(e.currentTarget, { action: "/", replace: true });
  };

  return (
    <div style={{ display: "flex" }}>
      <Form method="post" onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="theme"
          value={(themeName ?? osThemeName) === "dark" ? "light" : "dark"}
        />
        <button className="toggle" type="submit">
          Toggle Theme
        </button>
      </Form>
      <div style={{ width: 32 }} />
      <Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="theme" value="christmas" />
        <button type="submit">Use Christmas Theme</button>
      </Form>
      <div style={{ width: 32 }} />
      <Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="theme" value={""} />
        <button type="submit">Reset Theme Cookie</button>
      </Form>
    </div>
  );
}
