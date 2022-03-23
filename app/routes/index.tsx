import { MetaFunction } from "remix";
import flowDiagram from "../media/flow-diagram.png";

const title = "Perfect Dark Mode with Remix";
const description =
  "How to set up your Remix app to use light and dark mode themes";

export const meta: MetaFunction = () => {
  return {
    description: description,
    "og:description": description,
    "twitter:description": description,
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
    title,
    "og:title": title,
    "og:image": flowDiagram,
    "twitter:card": "TODO",
    "twitter:title": title,
    "twitter:image:width": "1200",
    "twitter:image:height": "630",
    "twitter:image": flowDiagram,
  };
};

export default function Index() {
  return (
    <div>
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
        This site is a minimal example of how to set up a{" "}
        <a href="https://remix.run/">Remix</a> app with light/dark mode.
      </p>
      <h2>Project Inspiration</h2>
      <p>
        This project is inspired by Josh Comeau's blog post{" "}
        <a href="https://www.joshwcomeau.com/react/dark-mode/">
          The Quest for the Perfect Dark Mode
        </a>
        . In his blog post, the goal is to set up a Gatsby/NextJS-style app.
        With Remix, we can take the solution to the next level by utilizing
        cookies instead of localStorage. Regardless of whether we're using
        cookies or localStorage, let's talk about our customer's requirements.
        Apologies for the copy/pasting, Josh, but your list of requirements are
        too perfect to not re-use.
      </p>
      <h2>Our requirements</h2>
      <p>Here's our set of criteria for this feature:</p>
      <ul>
        <li>
          The user should be able to click a toggle to switch between light and
          dark mode.
        </li>
        <li>
          The user's preference should be saved, so that future visits use the
          correct color theme.
        </li>
        <li>
          It should default to the user's "preferred" color scheme, according to
          their operating system settings. If not set, it should default to
          light.
        </li>
        <li>
          The site should not flicker on first load, even if the user has
          selected a non-default color theme.
        </li>
        <li>The site should never show the wrong toggle state.</li>
      </ul>
      <p>Let's reimagine these requirements as a flow diagram:</p>
      <img
        alt="requirements-flow-diagram"
        style={{
          width: "100%",
          height: "auto",
          border: "1px solid black",
          borderRadius: 5,
          overflow: "hidden",
        }}
        src={flowDiagram}
      />
      <h2>
        Setting up the styles in{" "}
        <a href="/app/styles/root.css">/app/styles/root.css</a>
      </h2>
      <p>
        In order to meet the requirements described above, we set up two sets of
        two identical lists of css variables.
      </p>
      <pre>
        {`/* Default to a light theme */
:root {
  --background: white;
  --onBackground: black
}

/* Overwrite css variables if device prefers dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --background: black;
    --onBackground: white;
  }
}

/* Manually overwrite css variables by setting class="light" */
.light {
  --background: white;
  --onBackground: black;
}

/* Manually overwrite css variables by setting class="dark" */
.dark {
  --background: black;
  --onBackground: white;
}`}
      </pre>
      <p>
        By declaring our css variables in the order described above, we've set
        up our css to do everything we've described in our requirements. Our
        site will look great and automatically match the OS's light/dark theme
        preference. But we still need to do some work to allow for the user to
        manually modify the theme, and for the site to remember this decision.
      </p>
      <h2>Setting up the theme cookie</h2>
      <p>
        To set up a cookie where we can store the user's theme preference, we're
        going to use Remix's `createCookie` API
      </p>
      <pre>
        {`// app/cookies.ts
import { createCookie } from "remix";

export const userPrefs = createCookie("userPrefs", {
  maxAge: 31_536_000, // one year
});`}
      </pre>
      <h2>Setting the cookie value</h2>
      <p>
        In order to set the cookie value, we're going to use a form and
        corresponding action handler.
      </p>
      <p>Here's the form:</p>
      <pre>
        {`// app/root.tsx
import { Form } from 'remix';

...

<Form method="post">
  <input type="hidden" name="theme" value="dark" />
  <button type="submit">Toggle Theme</button>
</Form>`}
      </pre>
      <p>And here's the action handler:</p>
      <pre>
        {`import { ActionFunction } from 'remix';
import { userPrefs } from '~/cookie';

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
};`}
      </pre>
      <p>
        When the user clicks on the "Toggle Theme" button, a form is submitted,
        which replies with a cookie. On any future visits to the site, this
        cookie will be sent, which will allow the server to set a "light" or
        "dark" class on the {`<html />`} element returned to the user's browser.
      </p>
      <h2>Retrieving the theme cookie</h2>
      <p>
        When a user visits the site, they will send to the server a cookie.
        Here's how we can parse that cookie and set a relevant class
        declaration.
      </p>
      <pre>
        {`export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  return json(cookie);
};

export default function App() {
  const cookie = useLoaderData<any>();

  return (
    <html lang="en" className={cookie.theme ?? undefined}>
      ...
    </html>
  );
}`}
      </pre>
      <h2>That's it</h2>
      <p>
        Hope you enjoyed this post. Please check out the actual code, as I
        believe it does a much better job than some of the broken-out
        code-snippets shown earler. If there's a way we can improve the example
        or supporting notes, we'd love your feedback.{" "}
        <a href="https://github.com/HovaLabs/remix-perfect-dark-mode/issues/new">
          We're open to PR's.
        </a>
      </p>
      <h2>Thanks for reading</h2>
      <p>
        ❤️ <a href="https://hovalabs.com">The Hovas</a>
      </p>
    </div>
  );
}
