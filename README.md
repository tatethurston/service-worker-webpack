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

## Installation & Usage 📦

1. Add this package to your project:

   `yarn add service-worker-webpack`

2. Update your `webpack.config.js`:

   ```js
   const ServiceWorkerPlugin = require("service-worker-webpack-plugin");

   module.exports = {
     plugins: [new ServiceWorkerPlugin()],
   };
   ```

## API Overview 🛠

| Name                 | Type                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoRegister         | boolean                                    | Autoregister the service worker.<br><br>If `false`, then the application must initialize the service worker by invoking `register`.<br>Set this to `false` if you'd like to take control over when you service worker is initialized. You'll<br>then need to add something like this to your application:<br><br>`js<br>import { Workbox } from 'workbox-window';<br><br>if ('serviceWorker' in navigator) {<br> const wb = new Workbox('/path-to-your-service-worker.js');<br> wb.register();<br>}<br>`<br><br>Defaults to `true`. Recommended: `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| enableInDevelopment  | boolean                                    | Enable the service worker in local development.<br><br>Depending on your service worker configuration, this can be problematic for developer<br>workflows where you end up serving outdated cached files.<br><br>If `false` then a placeholder service worker will be generated, which will immediately clear<br>any previously installed service workers that may have been installed previously such as testing<br>a production build locally.<br><br>Defaults to `false`. Recommended: `false` for general development, `true` for first time setup and<br>when debugging your application's service worker.                                                                                                                                                                                                                                                                                                                                                                                                |
| enableWorkboxLogging | boolean \| undefined                       | Enable workbox logging.<br><br>Workbox logging is both very helpful and very chatty. By default, workbox will use the webpack<br>mode to determine whether or not to enable workbox logging. When the mode is 'production',<br>then logging is disabled. Otherwise, logging is enabled.<br><br>Setting this to `true` enables workbox logging in a when the webpack mode is set to production. Setting this to `false` will disable workbox logging, which<br>is likely preferred when not debugging your servicer worker.<br><br>Note: This option is only relevant when using the service worker generated by workbox. It does not<br>apply to the development service worker generated when `enableInDevelopment` is `false`, or if you<br>supply your own service worker via workbox's `swSrc` field.<br><br>Defaults to `unset`, falling back on the workbox behavior. Recommended: `false` for general development,<br>`true` for first time setup and when debugging your application's service worker. |
| workbox              | InjectManifestOptions \| GenerateSWOptions | Options passed through to `worbox-webpack-plugin`. See all available configuration options here:<br>https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin<br><br>Defaults to `GenerateSW` which will generate a service worker with the workbox runtime included.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Examples 🚀

Check out the [service-worker-webpack-example](https://github.com/tatethurston/service-worker-webpack/blob/master/examples/react-example/).

## Warning ⚠️

You must serve your application over HTTPS in production environments. [Service Workers must be served from the site's origin over HTTPS](https://developers.google.com/web/fundamentals/primers/service-workers). A special case is made for `localhost`, so this is generally not necessary during local development. HTTPS is _not_ handled by this library.

The origin constraint means that the service worker can not control `mysite.com` if it was served from something like `mycdn.mysite.com`.

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/service-worker-webpack/blob/master/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/service-worker-webpack/blob/master/LICENSE).
