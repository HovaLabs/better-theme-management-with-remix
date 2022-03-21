# Remix Perfect Dark Mode

Check out the live site [here](https://remix-perfect-dark-mode.netlify.app).

This repo is a minimal example of how to set up a Remix app with light/dark mode. The site defaults to the OS's theme preferences (light/dark theme) while also allowing the user to override it, manually. The user's setting is stored in a cookie 🍪. No flash, no fuss, just good clean theming fun.

This project is inspired by Josh Comeau's blog post "[The Quest for the Perfect Dark Mode](https://www.joshwcomeau.com/react/dark-mode/)". With Remix, we can take the core UX and DX concerns addressed in this blog post to the next level by utilizing cookies instead of localStorage.

# Setting up the styles

In [/app/styles/root.css](/app/styles/root.css) we set up four nearly identical set of css variables.

- :root - We default to light mode
- @media (prefers-color-scheme: dark) - If the device prefers dark mode, we update the css variables
- .light - Any div with the class `.light` will overwrite the css variables with light themed colors
- .dark - Any div with the class `.dark` will overwrite the css variables with dark themed colors

By setting css variables in the order described above, we can allow for common sense default colors, and still allow for manually overriding the theme.

# Setting the theme cookie

TODO

# Retrieving the theme cookie

TODO

# bUt ThIs IsN't PeRfEcT!!!1

You're probably right. Sorry you got click bait'd by the title, but we'd love your feedback if there's a way we can improve this minimalist example. [We're open to PR's.](https://github.com/HovaLabs/remix-perfect-dark-mode/issues/new)

## Netlify Setup

1. Install the [Netlify CLI](https://www.netlify.com/products/dev/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

## Development

The Netlify CLI starts your app in development mode, rebuilding assets on file changes.

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

## Deployment

There are two ways to deploy your app to Netlify, you can either link your app to your git repo and have it auto deploy changes to Netlify, or you can deploy your app manually. If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run build
# preview deployment
netlify deploy

# production deployment
netlify deploy --prod
```
