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
import type { LinksFunction, MetaFunction } from "remix";
import styles from "./styles/root.css";
import favicon from "~/media/favicon.png";

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

  const theme = bodyParams.get("theme");
  if (theme === "light") {
    cookie.theme = "light";
  } else if (theme === "dark") {
    cookie.theme = "dark";
  } else if (theme === "") {
    cookie.theme = null;
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};

type Theme = "light" | "dark" | undefined;
interface LoaderData {
  theme: Theme;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const theme: Theme =
    cookie.theme === "light"
      ? "light"
      : cookie.theme === "dark"
      ? "dark"
      : undefined;
  return { theme };
};

export default function App() {
  const { theme } = useLoaderData<LoaderData>();
  const setThemeTo = theme === "light" ? "dark" : "light";

  return (
    <html lang="en" className={theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <h1>Perfect Dark Mode with Remix</h1>
          <div style={{ display: "flex" }}>
            <Form method="post">
              <input type="hidden" name="theme" value={setThemeTo} />
              <button type="submit">Toggle Theme</button>
            </Form>
            <div style={{ width: 32 }} />
            <Form method="post">
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
