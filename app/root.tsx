import * as React from "react";
import {
  ActionFunction,
  Form,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { userPrefs } from "~/cookies";
import favicon from "~/media/favicon.png";
import faviconDark from "~/media/favicon-dark.png";
import styles from "~/styles/root.css";
import GoogleAnalytics from "~/components/GoogleAnalytics";
import { ThemeName, useThemeName, nullishStringToThemeName } from "./theme";

import type { LinksFunction, MetaFunction } from "remix";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1,minimum-scale=1",
});

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: favicon },
    { rel: "icon", href: faviconDark, media: "(prefers-color-scheme: dark)" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();
  const theme = nullishStringToThemeName(bodyParams.get("theme")?.toString());
  cookie.theme = theme ?? null;

  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};

interface LoaderData {
  themeName: ThemeName;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  let themeName = nullishStringToThemeName(cookie.theme);
  return { themeName };
};

export default function App() {
  const { themeName: cookieThemeName } = useLoaderData<LoaderData>();
  const { themeName, setThemeName, osThemeName } =
    useThemeName(cookieThemeName);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = new FormData(e.target as HTMLFormElement);
    const newTheme = nullishStringToThemeName(form.get("theme")?.toString());
    setThemeName(newTheme);
  };

  return (
    <html lang="en" className={themeName}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GoogleAnalytics />
        <div>
          <h1>Perfect Themes with Remix</h1>
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
              <button type="submit">Enable Christmas Theme!</button>
            </Form>
            <div style={{ width: 32 }} />
            <Form method="post" onSubmit={handleSubmit}>
              <input type="hidden" name="theme" value={""} />
              <button type="submit">Reset Theme Cookie</button>
            </Form>
          </div>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
