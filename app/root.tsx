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
import styles from "~/styles/root.css";
import GoogleAnalytics from "~/utils/GoogleAnalytics";
import { Theme, useTheme, nullishStringToTheme } from "./theme";

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
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();
  const theme = nullishStringToTheme(bodyParams.get("theme")?.toString());
  cookie.theme = theme ?? null;

  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};

interface LoaderData {
  theme: Theme | undefined;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  let theme = nullishStringToTheme(cookie.theme);
  return { theme };
};

export default function App() {
  const { theme: cookieTheme } = useLoaderData<LoaderData>();
  const { theme, setTheme, osTheme } = useTheme(cookieTheme);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = new FormData(e.target as HTMLFormElement);
    const newTheme = nullishStringToTheme(form.get("theme")?.toString());
    console.log({ newTheme });
    setTheme(newTheme);
  };

  console.log({ theme, osTheme });

  return (
    <html lang="en" className={theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GoogleAnalytics />
        <div>
          <h1>Perfect Light / Dark Mode with Remix</h1>
          <div style={{ display: "flex" }}>
            <Form method="post" onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="theme"
                value={(theme ?? osTheme) === "dark" ? "light" : "dark"}
              />
              <button type="submit">Toggle Theme</button>
            </Form>
            <div style={{ width: 32 }} />
            <Form method="post" onSubmit={handleSubmit}>
              <input type="hidden" name="theme" value={""} />
              <button type="submit">Reset Theme Cookie</button>
            </Form>
            <div style={{ width: 32 }} />
            <Form method="post" onSubmit={handleSubmit}>
              <input type="hidden" name="theme" value="pink" />
              <button type="submit">Enable Pink Theme!</button>
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
