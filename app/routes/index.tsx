import {
  json,
  redirect,
  useLoaderData,
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
} from "remix";

import { userPrefs } from "~/cookies";

export const meta: MetaFunction = () => {
  return {
    description: "TODO",
    "og:description": "TODO",
    keywords: [
      "hovalabs",
      "hova labs",
      "the hovas",
      "design system",
      "design systems",
      "css",
      "css variables",
      "theme",
      "light theme",
      "dark theme",
      "light mode",
      "dark mode",
      "remix",
      "remix run",
      "react",
      "javascript",
      "typescript",
    ].join(", "),
    author: "The Hovas",
    title: "The perfect dark mode with Remix Run",
    "og:title": "The perfect dark mode with Remix Run",
    "og:image": "https://placekitten.com/400/400",
    "twitter:card": "TODO",
    "twitter:title": "TODO",
    "twitter:description": "TODO",
    "twitter:image:width": "1200",
    "twitter:image:height": "630",
    "twitter:image": "https://placekitten.com/400/400",
  };
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

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  return json(cookie);
};

export default function Index() {
  const cookie = useLoaderData<any>();
  const setThemeTo = (cookie?.theme ?? "light") === "light" ? "dark" : "light";

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>The Perfect Dark Mode</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://github.com/HovaLabs/remix-perfect-dark-mode/"
            rel="noreferrer"
          >
            Check out the code on Github
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <p>
        This site is a minimal example of how to set up a Remix app with
        light/dark mode. The site defaults to the OS's theme preferences
        (light/dark theme) while also allowing the user to override it,
        manually. The user's setting is stored in a cookie 🍪. No flash, no
        fuss, just good clean theming fun.
      </p>
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
  );
}
