const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

const config = require("./config");
const NODE_ENV = config.get("NODE_ENV");
const isDev = NODE_ENV === "development";

module.exports = {
  devtool: isDev ? "inline-source-map" : false,
  entry: path.join(__dirname, "./client/index.jsx"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource"
      }
    ]
  },
  target: isDev ? "web" : "browserslist",
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: path.join(__dirname, "./dist/index.html"),
      favicon: path.join(__dirname, "./public/favicon.ico"),
      minify: {
        collapseWhitespace: !isDev,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
    })
  ],
  devServer: {
    port: config.get("client:devServer:port"),
    hot: true,
    compress: true,
    historyApiFallback: true,
    contentBase: path.join(__dirname, "./dist"),
    watchContentBase: true,
    watchOptions: {
      poll: true
    },
    proxy: {
      "/api": "http://localhost:" + config.get("server:port")
    }
  },
  optimization: {
    minimize: !isDev ? true : false
  }
};
