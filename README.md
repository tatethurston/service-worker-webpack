# service-worker-webpack

<blockquote>A Webpack plugin that generates a Service Worker. Powered by Workbox.</blockquote>

<br />

<a href="https://www.npmjs.com/package/service-worker-webpack">
  <img src="https://img.shields.io/npm/v/service-worker-webpack.svg">
</a>
<a href="https://github.com/tatethurston/service-worker-webpack/blob/main/LICENSE">
  <img src="https://img.shields.io/npm/l/service-worker-webpack.svg">
</a>
<a href="https://www.npmjs.com/package/service-worker-webpack">
  <img src="https://img.shields.io/npm/dy/service-worker-webpack.svg">
</a>

## What is this? 🧐

A minimal wrapper around [Workbox](https://developers.google.com/web/tools/workbox) to quickly add a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) via your webpack build process.

Compatible with Webpack 4 and Webpack 5.

## Installation & Usage 📦

1. Add this package to your project:

   - `npm install --save dev service-worker-webpack` or `yarn add --dev service-worker-webpack`

2. Update your `webpack.config.js`:

   ```diff
   const path = require('path');
   + const { ServiceWorkerPlugin } = require("service-worker-webpack");

   module.exports = {
     entry: './src/index.js',
     output: {
       filename: 'main.js',
       path: path.resolve(__dirname, 'dist'),
     },
   + plugins: [new ServiceWorkerPlugin()],
   };
   ```

3. That's it! A service worker that precaches all of your build's static assets will be generated. Static assets will be served from the service worker's cache instead of making network calls, speeding up your page views and enabling offline viewing 🙌.

## Verification 🤔

1. To view the production service worker, set your [webpack mode](https://webpack.js.org/configuration/mode/) to `production` and build your assets.
2. The service worker must first install before it intercepts any traffic. You can view the status of the service worker in Chrome by opening the dev console, clicking the `Application` tab and then clicking the `Service Workers` tab.
3. Disable your internet connection and click around your site. Your assets will be served by the service worker. This is most obvious when you are disconnected from the internet, but even when users have an internet connection your assets will be served from the service worker and not from the network -- markedly speeding up these requests.

## Examples 🚀

Check out the [service-worker-webpack-example](https://github.com/tatethurston/service-worker-webpack/blob/main/examples/react-example/).

## Common Service Worker Pitfalls ⚠️

You must serve your application over HTTPS in production environments. [Service Workers must be served from the site's origin over HTTPS](https://developers.google.com/web/fundamentals/primers/service-workers).

Some browsers special case `localhost`, so this may not be necessary during local development. HTTPS is _not_ handled by this library. You can use a reverse proxy like [Nginx](https://www.nginx.com/) or [Caddy](https://caddyserver.com/) if you want to setup HTTPS for local development.

The service worker origin constraint means that service workers can not control pages on a different subdomain. Eg `mysite.com` can not be controlled by a service worker if that was served from a subdomain such as `mycdn.mysite.com`. To learn more about how service workers work in general, read [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

## Motivation

Workbox is great -- it's well documented and straightforward to customize your service worker. [workbox-webpack-plugin](https://www.npmjs.com/package/workbox-webpack-plugin) makes caching your webpack assets simple, but I found myself reimplementing the same patterns across projects. Specifically:

- Wiring up service worker registration boilerplate
- Toggling service worker development on/off in development

## API Overview 🛠

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>enableInDevelopment</td>
<td>

Enable the service worker in local development.

Depending on your service worker configuration, this can be problematic for developer workflows where you end up serving outdated cached files.

If `false` then a placeholder service worker will be generated, which will immediately clear any previously installed service workers that may have been installed previously such as testing a production build locally.

Defaults to `false`. Recommended: `false` for general development, `true` for first time setup and when debugging your application's service worker.

</td>
<td>boolean | undefined</td>
</tr>
<tr>
  <td>enableWorkboxLogging</td>
<td>

Enable workbox logging.

Workbox logging is both very helpful and very chatty. By default, workbox will use the webpack mode to determine whether or not to enable workbox logging. When the mode is `production`, then logging is disabled. Otherwise, logging is enabled.

Setting this to `true` enables workbox logging when the webpack `mode` is set to `production`. Setting this to `false` will disable workbox logging, which is likely preferred when not debugging your servicer worker.

Note: This option is only relevant when using the service worker generated by workbox. It does not apply to the development service worker generated when `enableInDevelopment` is `false`, or if you supply your own service worker via workbox's `swSrc` field.

Defaults to `unset`, falling back on the workbox behavior. Recommended: `false` for general development, `true` for first time setup and when debugging your application's service worker.

</td>
  <td>boolean | undefined</td>
</tr>
<tr>
  <td>registration.autoRegister</td>
<td>

Autoregister the service worker.

If `false`, then the application must initialize the service worker by invoking `register`. Set this to `false` if you'd like to take control over when you service worker is initialized. You'll then need to add something like the following to your application:

```javascript
import { Workbox } from "workbox-window";

if ("serviceWorker" in navigator) {
  const wb = new Workbox("/path-to-your-service-worker.js");
  wb.register();
}
```

Defaults to `true`. Recommended: `true`.

</td>
</td>
  <td>boolean | undefined</td>
</tr>
<tr>
  <td>registration.entry</td>
<td>

The webpack [entry](https://webpack.js.org/concepts/entry-points/) to inject the auto registration code into. The resulting bundle must be present on all pages that expect to register the service worker.

Defaults to `main`, the [default entry](https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax.)

</td>
</td>
  <td>string | undefined</td>
</tr>
<tr>
  <td>registration.path</td>
<td>

The [registration path](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope) tells the browser where your service worker is located.

Defaults to `/service-worker.js`.

</td>
</td>
  <td>string | undefined</td>
</tr>
<tr>
  <td>registration.scope</td>
<td>

The [scope](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope) of the service worker determines which files the service worker controls, in other words, from which path the service worker will intercept requests. The default scope is the location of the service worker file, and extends to all directories below. So if service-worker.js is located in the root directory, the service worker will control requests from all files at this domain.

Defaults to `undefined` which sets the default scope as described above.
The registration path tells the browser where your service worker is located.

</td>
</td>
  <td>string | undefined</td>
</tr>
<tr>
  <td>workbox</td>
<td>

Options passed to `worbox-webpack-plugin`. See all available configuration options [here](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin).

Defaults to `GenerateSW` which will generate a service worker with the workbox runtime included.

</td>
  <td>InjectManifestOptions | GenerateSWOptions</td>
</tr>
  </tbody>
</table>

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/service-worker-webpack/blob/main/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/service-worker-webpack/blob/main/LICENSE).
