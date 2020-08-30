const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  watch: true,
  output: {
    filename: "transaction-fee.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", //4. Inject styles into DOM
          "css-loader", // 3. Turns css into commonjs
          {
            loader: "postcss-loader", // 2. Add Autoprefixer to CSS
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")],
            },
          },
          "sass-loader", //1. Turns sass into css
        ],
      },
    ],
  },
});
