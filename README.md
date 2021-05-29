# service-worker-webpack

<blockquote>A Webpack Plugin to generate a Service Worker. Powered by Workbox.</blockquote>

<br />

<a href="https://www.npmjs.com/package/service-worker-webpack">
  <img src="https://img.shields.io/npm/v/service-worker-webpack.svg">
</a>
<a href="https://github.com/tatethurston/service-worker-webpack/blob/master/LICENSE">
  <img src="https://img.shields.io/npm/l/service-worker-webpack.svg">
</a>
<a href="https://www.npmjs.com/package/service-worker-webpack">
  <img src="https://img.shields.io/npm/dy/service-worker-webpack.svg">
</a>

## What is this? 🧐

A minimal wrapper around [Workbox](https://developers.google.com/web/tools/workbox) to quickly add a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) via your webpack build process.

## Motivation

Workbox is great -- it's well documented and straightforward to customize your service worker. [workbox-webpack-plugin](https://www.npmjs.com/package/workbox-webpack-plugin) makes caching your webpack assets simple, but I found myself reimplementing the same patterns across projects. Specifically:

- Wiring up service worker registration boilerplate
- Toggling service worker development on/off in development
- Toggling Workbox logging on/off when debugging

## Installation & Usage 📦

1. Add this package to your project:

   `yarn add -D service-worker-webpack`

2. Add [workbox-window](https://www.npmjs.com/package/workbox-window) if opting into `autoRegister` (default)

   `yarn add workbox-window`

3. Update your `webpack.config.js`:

   ```js
   const ServiceWorkerPlugin = require("service-worker-webpack-plugin");

   module.exports = {
     plugins: [new ServiceWorkerPlugin()],
   };
   ```

## API Overview 🛠

| Name                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Type                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| enableInDevelopment       | Enable the service worker in local development.<br><br>Depending on your service worker configuration, this can be problematic for developer workflows where you end up serving outdated cached files.<br><br>If `false` then a placeholder service worker will be generated, which will immediately clear any previously installed service workers that may have been installed previously such as testing a production build locally.<br><br>Defaults to `false`. Recommended: `false` for general development, `true` for first time setup and when debugging your application's service worker.                                                                                                                                                                                                                                                                                                                                                                                         | boolean                                    |
| enableWorkboxLogging      | Enable workbox logging.<br><br>Workbox logging is both very helpful and very chatty. By default, workbox will use the webpack mode to determine whether or not to enable workbox logging. When the mode is 'production', then logging is disabled. Otherwise, logging is enabled.<br><br>Setting this to `true` enables workbox logging when the webpack `mode` is set to `production`. Setting this to `false` will disable workbox logging, which is likely preferred when not debugging your servicer worker.<br><br>Note: This option is only relevant when using the service worker generated by workbox. It does not apply to the development service worker generated when `enableInDevelopment` is `false`, or if you supply your own service worker via workbox's `swSrc` field.<br><br>Defaults to `unset`, falling back on the workbox behavior. Recommended: `false` for general development, `true` for first time setup and when debugging your application's service worker. | boolean \| undefined                       |
| registration.autoRegister | Autoregister the service worker.<br><br>If `false`, then the application must initialize the service worker by invoking `register`. Set this to `false` if you'd like to take control over when you service worker is initialized. You'll then need to add something like the following to your application:<br><br><pre><code><br>import { Workbox } from 'workbox-window';<br><br>if ('serviceWorker' in navigator) {<br> const wb = new Workbox('/path-to-your-service-worker.js');<br> wb.register();<br>}<br></code></pre><br><br>Defaults to `true`. Recommended: `true`.                                                                                                                                                                                                                                                                                                                                                                                                             | boolean \| undefined                       |
| registration.entry        | The webpack [entry](https://webpack.js.org/concepts/entry-points/) to inject the auto registration code into. The resulting bundle must be present on all pages that expect to register the service worker.<br><br>Defaults to `main`. https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | string \| undefined                        |
| registration.scope        | The scope of the service worker determines which files the service worker controls, in other words, from which path the service worker will intercept requests. The default scope is the location of the service worker file, and extends to all directories below. So if service-worker.js is located in the root directory, the service worker will control requests from all files at this domain.<br><br>https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope<br><br>Defaults to `undefined` which sets the default scope as described above.                                                                                                                                                                                                                                                                                                                                                                                                | string \| undefined                        |
| registration.path         | The registration path tells the browser where your service worker is located.<br><br>https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope<br><br>Defaults to `/service-worker.js`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | string \| undefined                        |
| workbox                   | Options passed to `worbox-webpack-plugin`. See all available configuration options [here](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin).<br><br>Defaults to `GenerateSW` which will generate a service worker with the workbox runtime included.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | InjectManifestOptions \| GenerateSWOptions |

## Examples 🚀

Check out the [service-worker-webpack-example](https://github.com/tatethurston/service-worker-webpack/blob/master/examples/react-example/).

## Warning ⚠️

You must serve your application over HTTPS in production environments. [Service Workers must be served from the site's origin over HTTPS](https://developers.google.com/web/fundamentals/primers/service-workers). A special case is made for `localhost`, so this is generally not necessary during local development. HTTPS is _not_ handled by this library.

The origin constraint means that the service worker can not control `mysite.com` if it was served from something like `mycdn.mysite.com`.

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/service-worker-webpack/blob/master/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/service-worker-webpack/blob/master/LICENSE).
