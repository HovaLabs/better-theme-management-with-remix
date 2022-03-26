import { MetaFunction } from "remix";
import flowDiagram from "../media/flow-diagram.png";
import metaImage from "../media/meta.jpg";

const title = "Perfect Themes with Remix";
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
    ].join(", "),
    author: "The Hovas",
    title,
    "og:title": title,
    "og:image": metaImage,
    "twitter:card": "summary",
    "twitter:title": title,
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
        <a target="_blank" rel="noopener noreferrer" href="https://remix.run/">
          Remix
        </a>{" "}
        app with light, dark, and custom themes.
      </p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/HovaLabs/remix-perfect-themes/"
      >
        Check out the code on Github
      </a>
      <h2>Project Inspiration</h2>
      <p>
        This project is inspired by Josh Comeau's blog post{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.joshwcomeau.com/react/dark-mode/"
        >
          The Quest for the Perfect Dark Mode
        </a>
        . If you haven't read it yet, please check it out, as it's a great
        source of context on this subject with very thorough explanations. That
        blog post discusses the motivation and strategy for setting up a
        Gatsby/NextJS-style app with light/dark mode themed colors. This blog
        post has similar, but slightly different goals.
      </p>
      <p>
        1. Instead of NextJS or Gatsby, we want to build our app with Remix,
        utilizing cookies, instead of localStorage.
      </p>
      <p>
        2. In addition to supporting light/dark mode, we want to support using
        custom themes. For this blog post, we'll use a "Christmas" theme, but
        it's worth pointing out, there are much more useful (but not as
        🎄festive🎄) accessibility-targeted themes such as high-contrast,
        tritanopia, etc.. which could be implemented following this pattern.
      </p>
      <p>
        We should talk about our customer's requirements. Apologies for the
        copy/pasting, Josh, but your list of requirements are too perfect to not
        re-use.
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
        <li>
          * The site should allow for non-standard themes, and should remember
          them, if selected.
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
      <h2>
        Setting up the styles in{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/HovaLabs/remix-perfect-themes/blob/master/app/styles/root.css"
        >
          /app/styles/root.css
        </a>
      </h2>
      <p>
        In order to meet the requirements described above, we set up two sets of
        two identical lists of css variables. In addition, we'll create one
        class per each custom theme we want to support.
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
        By declaring our css variables in the order described above, we've set
        up our css to do everything we've described in our requirements. Our
        site will look great and automatically match the OS's light/dark theme
        preference. But we still need to do some work to allow for the user to
        manually modify the theme, and for the site to remember this decision.
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
      <h2>react-theme-helper</h2>
      <p>
        To smooth out our implementation, we've created a helper package, called{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/HovaLabs/react-theme-helper"
        >
          react-theme-helper
        </a>{" "}
        which we will use for keeping track of the OS's theme state, as well as
        our user-selected theme state.
      </p>
      <pre>
        {`// app/theme.tsx
import createThemeHelper from "react-theme-helper";

export const {
  useThemeName,
  nullishStringToThemeName,
} = createThemeHelper(["light", "dark", "christmas"]);`}
      </pre>
      <h2>Setting the cookie value</h2>
      <p>
        Remix allows each route to have an action handler, which can reply with
        a{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Response"
        >
          response-compliant payload
        </a>
        In this case, when a user clicks on the "Toggle Theme" button, a form is
        submitted, which the action handler will reply to with the new theme
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
        , which will allow it to set a "light", "dark", or "christmas" class on
        the {`<html />`} element returned to the user's browser.
      </p>
      <h2>Retrieving the theme cookie</h2>
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
      <h2>Consuming the cookie value in the browser</h2>
      <p>
        We're going a bit full-circle here. Now that userLoaderData has parsed
        our cookie, we can use the combination of the cookie value and the OS's
        current theme to determine what value the toggle should fire when
        clicked. In addition to submitting the form, we also optimistically
        update the state locally.
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
      <h2>Setting a custom theme</h2>
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
      <h2>What's still missing</h2>
      <p>
        You may notice there's no way for the server-rendered html to detect
        light/dark mode unless a cookie is set. We're able to avoid the dreaded
        flash by utilizing css media queries, but the server-rendered html
        remains unaware of the client's theme preference. If we wanted a toggle
        to render content differently for light/dark mode and could not achieve
        the result with css media queries, we would need to hack a bit further.
      </p>
      <h2>That's it</h2>
      <p>
        Hope you enjoyed this post. Please check out{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/hovalabs/remix-perfect-themes"
        >
          the actual code
        </a>
        , as I believe it provides a much more realistic context. If there's a
        way we can improve the example or supporting notes, we'd love your
        feedback.{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/HovaLabs/remix-perfect-themes/issues/new"
        >
          We're open to PR's.
        </a>
      </p>
      <h2>Thanks for reading</h2>
      <p>
        ❤️{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://hovalabs.com"
        >
          The Hovas
        </a>
      </p>
    </div>
  );
}
