import {
  json,
  redirect,
  useLoaderData,
  ActionFunction,
  Form,
  LoaderFunction,
} from "remix";

import { userPrefs } from "~/cookies";

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  const theme = bodyParams.get("theme");
  if (theme === "light") {
    cookie.theme = "light";
  } else if (theme === "dark") {
    cookie.theme = "dark";
  } else if (theme === null) {
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
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <Form method="post">
        <input type="hidden" name="theme" value={setThemeTo} />
        <button type="submit">Toggle Theme</button>
      </Form>
    </div>
  );
}
