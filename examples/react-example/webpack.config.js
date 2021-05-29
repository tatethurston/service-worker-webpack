const path = require("path");
const { ServiceWorkerPlugin } = require("service-worker-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  mode: "production",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new ServiceWorkerPlugin({
      enableWorkboxLogging: true,
    }),
  ],
};
