import { MetaFunction } from "remix";
import flowDiagram from "../media/flow-diagram.png";
import metaImage from "../media/meta.jpg";
import Link from "~/components/Link";
import * as constants from "~/constants";

const description =
  "How to set up your Remix app to use light, dark, and custom themes";

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
      "themes",
      "custom themes",
      "light theme",
      "dark theme",
      "light mode",
      "dark mode",
      "remix",
      "remix run",
      "react",
      "react-theme-helper",
      "javascript",
      "typescript",
      constants.TITLE,
    ].join(", "),
    author: "The Hovas",
    title: constants.TITLE,
    "og:title": constants.TITLE,
    "og:image": metaImage,
    "twitter:card": "summary",
    "twitter:title": constants.TITLE,
    "twitter:image:width": "1200",
    "twitter:image:height": "630",
    "twitter:image": metaImage,
  };
};

export default function Index() {
  return (
    <div>
      <p>
        This site is a minimal example of how to set up a{" "}
        <Link href="https://remix.run/">Remix</Link> app with light, dark, and
        custom themes.
      </p>
      <Link href="https://github.com/HovaLabs/remix-theme-management/">
        Check out the code on Github
      </Link>
      <h1>Our requirements</h1>
      <p>
        We should talk about our customer's requirements. If you've read{" "}
        <Link href="https://www.joshwcomeau.com/react/dark-mode/">
          The Quest for the Perfect Dark Mode
        </Link>{" "}
        this list may look familiar. Apologies for the copy/pasting, Josh, but
        your list of requirements are too perfect to not re-use.
      </p>
      <p>Here's our set of criteria for this feature:</p>
      <ul>
        <li>
          The user should be able to click a toggle to switch between light and
          dark mode.
        </li>
        <li>
          ✨New Requirement✨ - The user should be able to select other custom
          themes as well.
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
        <li>The site should never show the wrong theme.</li>
      </ul>
      <h2>Some notes about the tech stack</h2>
      <ul>
        <li>
          We want to build our app with{" "}
          <Link href="https://remix.run">Remix</Link> and utilize cookies to
          remember our user's theme preference.
        </li>
        <li>
          In addition to supporting light/dark mode, we want to support using
          custom themes. For this blog post, we'll use a "Christmas" theme, but
          it's worth pointing out, there are much more useful (but not as
          🎄festive🎄) accessibility-targeted themes which could be implemented
          following this pattern.
        </li>
      </ul>
      <p>Let's reimagine these requirements as a "Theme Decision Tree":</p>
      <div className="flow-diagram-wrapper">
        <img
          alt="requirements-flow-diagram"
          className="flow-diagram"
          src={flowDiagram}
        />
      </div>
      <h1>The CSS</h1>
      <p>
        In order to meet the requirements described above, we create two sets of
        light and dark mode css variables. The first set is for handling default
        behavior, and the second set is for handling when the user manually
        selects a theme. In addition, we'll create one class per each custom
        theme we want to support.
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
}

.christmas {
  --background: green;
  --onBackground: red;
}`}
      </pre>
      <p>
        By declaring css variables in the order described above, we've set up
        the css to meet our requirements. By default, the site will
        automatically match the OS's light/dark theme preference. We still need
        to do some work to allow the user to manually modify the theme, and for
        the site to remember this decision.
      </p>
      <h2>Setting up the theme cookie</h2>
      <p>
        We're going to use a cookie to "remember" if a browser has set a
        preferred theme. To set up our cookie we're going to use Remix's
        "createCookie" API.
      </p>
      <pre>
        {`// app/cookies.ts
import { createCookie } from "remix";

export const userPrefs = createCookie("userPrefs", {
  maxAge: 31_536_000, // one year
});`}
      </pre>
      <h1>Using react-theme-helper</h1>
      <p>
        To smooth out our implementation, we've created a helper package, called{" "}
        <Link href="https://github.com/HovaLabs/react-theme-helper">
          react-theme-helper
        </Link>
        . This package exposes two helper functions:
      </p>
      <pre>
        {`// app/theme.tsx
import createThemeHelper from "react-theme-helper";

export const {
  nullishStringToThemeName,
  useThemeName,
} = createThemeHelper(["light", "dark", "christmas"]);`}
      </pre>
      <p>
        <b>nullishStringToThemeName</b> coerces a string into one of our themes.
        If the string doesn't match any of our theme values, it will return
        undefined. We can use this function on the frontend and the backend.
      </p>
      <p>
        <b>useThemeName</b> is a react hook that will provide the user-selected
        theme, the os's current them, and a function to update the user-selected
        theme.
      </p>
      <h1>Setting the theme by submitting a form</h1>
      <p>
        Remix allows each route to have an action handler, which can reply with
        a{" "}
        <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Response">
          response-compliant payload
        </Link>
        . In this case, when a user clicks on the "Toggle Theme" button, a form
        is submitted, which the action handler will reply to with the new theme
        value, baked into a cookie.
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
      <p>And here's the matching action handler:</p>
      <pre>
        {`import { ActionFunction } from 'remix';
import { nullishStringToThemeName } from "~/theme";
import { userPrefs } from '~/cookie';

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  // This utility function will coerce our theme
  // to a valid theme or undefined
  const theme = nullishStringToThemeName(bodyParams.get("theme"));

  cookie.theme = theme ?? null;

  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};
`}
      </pre>
      <p>
        Any future requests for this site from the browser will include this
        cookie.
      </p>
      <h1>Serving the website</h1>
      <p>
        When a user visits the site, they will send to the server a cookie.
        Here's how we can parse that cookie.
      </p>
      <pre>
        {`import { Form, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { nullishStringToThemeName } from "~/theme";

type Theme = "light" | "dark" | "christmas" | undefined;
interface LoaderData {
  theme: Theme;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  let themeName = nullishStringToThemeName(cookie.theme);
  return { themeName };
};`}
      </pre>
      <h1>Setting up the theme toggle</h1>
      <p>
        We're going a bit full-circle here. Now that the loader function has
        parsed our cookie, we can use the combination of the cookie value and
        the OS's current theme to determine what value the toggle should fire
        when clicked. In addition to submitting the form, we also optimistically
        update the state locally so that the theme update is instantaneous.
      </p>
      <pre>
        {`
import { nullishStringToThemeName, useThemeName } from "~/theme";

export default function App() {
  const { themeName: cookieThemeName } = useLoaderData<LoaderData>();

  const {
    themeName,
    setThemeName,
    osThemeName,
  } = useThemeName(cookieThemeName);

  const setThemeTo = (themeName ?? osThemeName) === "dark" ? "light" : "dark";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = new FormData(e.target as HTMLFormElement);
    const newTheme = nullishStringToThemeName(form.get("theme"));
    setThemeName(newTheme);
  };
  
  return (
    <html lang="en" className={theme}>
      <body>
        <Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="theme" value={setThemeTo} />
          <button type="submit">Toggle Theme</button>
        </Form>
      </body>
    </html>
  );
}`}
      </pre>
      <h1>Setting a custom theme</h1>
      <p>
        To allow setting and unsetting a custom theme, we've added two
        additional forms, with a hidden input's value set to "christmas" and "",
        respectively
      </p>
      <pre>
        {`<Form method="post" onSubmit={handleSubmit}>
  <input type="hidden" name="theme" value="christmas" />
  <button type="submit">Christmas Theme</button>
</Form>
<Form method="post" onSubmit={handleSubmit}>
  <input type="hidden" name="theme" value="" />
  <button type="submit">Reset Theme</button>
</Form>`}
      </pre>
      <h1>What's still missing</h1>
      <p>
        You may notice there's no way for the server-rendered html to detect
        light/dark mode unless a cookie is set. We're able to avoid the dreaded
        flash by utilizing css media queries, but the server-rendered html
        remains unaware of the client's theme preference. If we wanted a toggle
        to render content differently for light/dark mode and could not achieve
        the result with css media queries, we would need to hack a bit further.
      </p>
      <h1>That's it</h1>
      <p>
        Hope you enjoyed this post. Please check out{" "}
        <Link href="https://github.com/hovalabs/remix-theme-management">
          the actual code
        </Link>
        , as I believe it provides a much more realistic context. If there's a
        way we can improve the example or supporting notes, we'd love your
        feedback.{" "}
        <Link href="https://github.com/HovaLabs/remix-theme-management/issues/new">
          We're open to PR's.
        </Link>
      </p>
      <h2>Thanks for reading</h2>
      <p>
        ❤️ <Link href="https://hovalabs.com">The Hovas</Link>
      </p>
    </div>
  );
}
