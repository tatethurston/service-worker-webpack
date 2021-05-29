import { join } from "path";
import { validate } from "schema-utils";
import type { Compiler } from "webpack";
import {
  GenerateSW,
  GenerateSWOptions,
  InjectManifest,
  InjectManifestOptions,
} from "workbox-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import { Schema } from "schema-utils/declarations/ValidationError";

export interface ServiceWorkerConfig {
  /**
   * Enable the service worker in local development.
   *
   * Depending on your service worker configuration, this can be problematic for developer workflows where you end up serving outdated cached files.
   *
   * If `false` then a placeholder service worker will be generated, which will immediately clear any previously installed service workers that may have been installed previously such as testing a production build locally.
   *
   * Defaults to `false`. Recommended: `false` for general development, `true` for first time setup and when debugging your application's service worker.
   */
  enableInDevelopment?: boolean;
  /**
   * Enable workbox logging.
   *
   * Workbox logging is both very helpful and very chatty. By default, workbox will use the webpack mode to determine whether or not to enable workbox logging. When the mode is `production`, then logging is disabled. Otherwise, logging is enabled.
   *
   * Setting this to `true` enables workbox logging when the webpack `mode` is set to `production`. Setting this to `false` will disable workbox logging, which is likely preferred when not debugging your servicer worker.
   *
   * Note: This option is only relevant when using the service worker generated by workbox. It does not apply to the development service worker generated when `enableInDevelopment` is `false`, or if you supply your own service worker via workbox's `swSrc` field.
   *
   * Defaults to `unset`, falling back on the workbox behavior. Recommended: `false` for general development, `true` for first time setup and when debugging your application's service worker.
   */
  enableWorkboxLogging?: boolean;
  /**
   * Options to configure registration of the service worker on the client.
   */
  registration?: {
    /**
     * Autoregister the service worker.
     *
     * If `false`, then the application must initialize the service worker by invoking `register`. Set this to `false` if you'd like to take control over when you service worker is initialized. You'll then need to add something like the following to your application:
     *
     * ```javascript
     * import { Workbox } from 'workbox-window';
     *
     * if ('serviceWorker' in navigator) {
     *   const wb = new Workbox('/path-to-your-service-worker.js');
     *   wb.register();
     * }
     * ```
     *
     * Defaults to `true`. Recommended: `true`.
     */
    autoRegister?: boolean;
    /**
     * The webpack [entry](https://webpack.js.org/concepts/entry-points/) to inject the auto registration code into. The resulting bundle must be present on all pages that expect to register the service worker.
     *
     * Defaults to `main`, the [default entry](https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax.)
     */
    entry?: string;
    /**
     * The [registration path](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope) tells the browser where your service worker is located.
     *
     * Defaults to `/service-worker.js`.
     */
    path?: string;
    /**
     * The [scope](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope) of the service worker determines which files the service worker controls, in other words, from which path the service worker will intercept requests. The default scope is the location of the service worker file, and extends to all directories below. So if service-worker.js is located in the root directory, the service worker will control requests from all files at this domain.
     *
     * Defaults to `undefined` which sets the default scope as described above.
     */
    scope?: string;
  };
  /**
   * Options passed to `worbox-webpack-plugin`. See all available configuration options [here](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin).
   *
   * Defaults to `GenerateSW` which will generate a service worker with the workbox runtime included.
   */
  workbox?: InjectManifestOptions | GenerateSWOptions;
}

const schema: Schema = {
  type: "object",
  properties: {
    enableInDevelopment: {
      type: "boolean",
    },
    enableWorkboxLogging: {
      type: "boolean",
    },
    registration: {
      type: "object",
      properties: {
        autoRegister: {
          type: "boolean",
        },
        entry: {
          type: "string",
        },
        scope: {
          type: "string",
        },
        path: {
          type: "string",
        },
      },
      additionalProperties: false,
    },
    workbox: {
      type: "object",
    },
  },
  additionalProperties: false,
};

function isInjectManifest(
  workboxConfig: InjectManifestOptions | GenerateSWOptions
): workboxConfig is InjectManifestOptions {
  return "swSrc" in workboxConfig;
}

export class ServiceWorkerPlugin {
  config: ServiceWorkerConfig;

  constructor(options: ServiceWorkerConfig = {}) {
    validate(schema, options, {
      name: "Service Worker Webpack Plugin",
      baseDataPath: "options",
    });
    this.config = options;
  }

  apply(compiler: Compiler): void {
    const DEFAULT_SW_NAME = "service-worker.js";
    const DEFAULT_SW_DEST = join(
      compiler.options.output.path ?? "",
      DEFAULT_SW_NAME
    );
    // https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax
    const DEFAULT_ENTRY = "main";

    const {
      enableInDevelopment = false,
      enableWorkboxLogging = undefined,
      workbox = {},
      registration: {
        entry: registrationEntry = DEFAULT_ENTRY,
        path = `./${DEFAULT_SW_NAME}`,
        scope,
        autoRegister = true,
      } = {},
    } = this.config;

    if (!workbox.swDest) {
      workbox.swDest = DEFAULT_SW_DEST;
    }

    if (autoRegister) {
      new compiler.webpack.DefinePlugin({
        __SERVICE_WORKER_SW_DEST__: JSON.stringify(path),
        __SERVICE_WORKER_SCOPE__: JSON.stringify(scope),
      }).apply(compiler);

      const autoRegisterJS = join(__dirname, "autoRegister.js");
      const entry =
        typeof compiler.options.entry === "function"
          ? compiler.options.entry()
          : Promise.resolve(compiler.options.entry);

      compiler.options.entry = () =>
        entry.then((e) => {
          const injectEntry: typeof e[string] | undefined =
            e[registrationEntry];
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!injectEntry?.import) {
            throw new Error(
              `Could not find the webpack entry '${registrationEntry}' to inject autoRegister code into. See https://github.com/tatethurston/service-worker-webpack for configuration options.`
            );
          }
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!injectEntry.import.includes(autoRegisterJS)) {
            injectEntry.import.unshift(autoRegisterJS);
          }
          return e;
        });
    }

    if (compiler.options.mode === "development" && !enableInDevelopment) {
      new CopyPlugin({
        patterns: [
          {
            from: join(__dirname, "service-worker-development.js"),
            to: workbox.swDest,
          },
        ],
      }).apply(compiler);
    } else {
      if (isInjectManifest(workbox)) {
        new InjectManifest(workbox).apply(compiler);
      } else {
        let mode = undefined;
        if (enableWorkboxLogging === true) {
          mode = "development";
        } else if (enableWorkboxLogging === false) {
          mode = "production";
        }
        new GenerateSW({ mode, ...workbox }).apply(compiler);
      }
    }
  }
}
