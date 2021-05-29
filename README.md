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

| Name                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Type    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| enableInDevelopment | Enable the service worker in local development.<br><br>Depending on your service worker configuration, this can be problematic for developer<br>workflows where you end up serving outdated cached files.<br><br>If `false` then a placeholder service worker will be generated, which will immediately clear<br>any previously installed service workers that may have been installed previously such as testing<br>a production build locally.<br><br>Defaults to `false`. Recommended: `false` for general development, `true` for first time setup and<br>when debugging your application's service worker. | boolean |

## Examples 🚀

Check out the [service-worker-webpack-example](https://github.com/tatethurston/service-worker-webpack/blob/master/examples/react-example/).

## Warning ⚠️

You must serve your application over HTTPS in production environments. [Service Workers must be served from the site's origin over HTTPS](https://developers.google.com/web/fundamentals/primers/service-workers). A special case is made for `localhost`, so this is generally not necessary during local development. HTTPS is _not_ handled by this library.

The origin constraint means that the service worker can not control `mysite.com` if it was served from something like `mycdn.mysite.com`.

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/service-worker-webpack/blob/master/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/service-worker-webpack/blob/master/LICENSE).
