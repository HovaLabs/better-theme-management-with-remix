import {
  ActionFunction,
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
import {
  ThemeName,
  ThemeProvider,
  useThemeInfo,
  nullishStringToThemeName,
} from "~/theme";
import ThemeToggle from "~/components/ThemeToggle";

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

  // Could probably do a bit more sanitization on the url
  const url = bodyParams.get("url")?.toString() ?? "/";

  const theme = nullishStringToThemeName(bodyParams.get("theme")?.toString());
  cookie.theme = theme ?? null;

  return redirect(url, {
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

export default function AppWithContexts() {
  const { themeName: cookieThemeName } = useLoaderData<LoaderData>();

  return (
    <ThemeProvider themeName={cookieThemeName}>
      <App />
    </ThemeProvider>
  );
}

function App() {
  const { themeName } = useThemeInfo();

  return (
    <html lang="en" className={themeName}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GoogleAnalytics />
        <header>
          <ThemeToggle />
        </header>
        <div className="outlet-container">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
