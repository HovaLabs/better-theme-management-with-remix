import { MetaFunction } from "remix";

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
    title: "Perfect Dark Mode with Remix",
    "og:title": "The perfect dark mode with Remix",
    "og:image": "https://placekitten.com/400/400",
    "twitter:card": "TODO",
    "twitter:title": "TODO",
    "twitter:description": "TODO",
    "twitter:image:width": "1200",
    "twitter:image:height": "630",
    "twitter:image": "https://placekitten.com/400/400",
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
        <a href="https://remix.run/">Remix</a> app with light/dark mode. The
        site defaults to the OS's light/dark theme preference while also
        allowing the user to override it, manually. The user's setting is stored
        in a cookie 🍪. No flash, no fuss, just good clean theming fun.
      </p>
      <h2>Project Inspiration</h2>
      <p>
        This project is inspired by Josh Comeau's blog post{" "}
        <a href="https://www.joshwcomeau.com/react/dark-mode/">
          The Quest for the Perfect Dark Mode
        </a>
        . With Remix, we can take the core UX and DX concerns addressed in this
        blog post to the next level by utilizing cookies instead of
        localStorage. Apologies for the copy/pasting, Josh, but your list of
        requirements are too perfect to not re-use.
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
      <h2>Setting the theme cookie</h2>
      <p>TODO</p>
      <h2>Retrieving the theme cookie</h2>
      <p> TODO</p>
      <h2>bUt ThIs IsN't PeRfEcT!!!1</h2>
      <p>
        You're probably right. Sincere apologies for the clickbaity title 😅 and
        thank you for reading! We'd love your feedback if there's a way we can
        improve the example or supporting notes.{" "}
        <a href="https://github.com/HovaLabs/remix-perfect-dark-mode/issues/new">
          We're open to PR's.
        </a>
      </p>
    </div>
  );
}
