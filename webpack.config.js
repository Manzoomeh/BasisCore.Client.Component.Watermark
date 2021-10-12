const path = require("path");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    watermark: {
      import: "./src/loader.ts",
      filename: "basiscore.watermark.js",
      library: {
        name: "[name]",
        type: "assign",
      },
    },
    watermarkComponent: {
      import: "./src/BcComponentLoader.ts",
      filename: "basiscore.watermark.component.js",
      library: {
        name: "bc",
        type: "assign",
      },
    },
    wmDemoData: {
      import: "./src/DemoData.ts",
      filename: "basiscore.watermark.demo-data.js",
      library: {
        name: "[name]",
        type: "assign",
      },
    },
  },
  output: {
    filename: "basiscore.[name].js",
  },
  devServer: {
    static: path.resolve(__dirname, "wwwroot"),
    open: true,
    port: 3001,
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       app: {
  //         test: /[\\/]app[\\/]/,
  //         name: "basiscore.watermark",
  //         chunks: "all",
  //       },
  //       boot: {
  //         test: /[\\/]src[\\/]loader.ts$/,
  //         name: "basiscore.watermark.loader",
  //         chunks: "all",
  //       },
  //     },
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"], // there's a dot missing
  },
  plugins: [
    new CircularDependencyPlugin({
      // `onStart` is called before the cycle detection starts
      onStart({ compilation }) {
        console.log("start detecting webpack modules cycles");
      },
      // `onDetected` is called for each module that is cyclical
      onDetected({ module: webpackModuleRecord, paths, compilation }) {
        // `paths` will be an Array of the relative module paths that make up the cycle
        // `module` will be the module record generated by webpack that caused the cycle
        compilation.errors.push(new Error(paths.join(" -> ")));
      },
      // `onEnd` is called before the cycle detection ends
      onEnd({ compilation }) {
        console.log("end detecting webpack modules cycles");
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(
            __dirname,
            "node_modules/jquery/dist/jquery.min.js"
          ),
        },
      ],
    }),
  ],
};
