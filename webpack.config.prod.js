const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const dotenv = require("dotenv-webpack");
const webpack = require("webpack");

const appBundleName = require("./package.json").name;
const appVersion = require("./package.json").version;
const commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

const distPath = path.resolve(__dirname, "dist");

const getPublicPath = () => {
  return process.env.PUBLIC_PATH
    ? `${process.env.PUBLIC_PATH}/${appBundleName}/${commitHash}/`
    : `https://uxss.in/embol.com/cdn/${appBundleName}/${appVersion}/`;
};

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    publicPath: getPublicPath(),
    path: path.join(distPath, appBundleName, appVersion),
    filename: `${appBundleName}.js`,
    chunkFilename: `${appBundleName}.[id].[chunkhash:8].js`
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(less|css)$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: `images/[name].[hash][ext]`
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: `${appBundleName}/fonts/[name].[hash][ext]`
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new dotenv({
      path: path.resolve(__dirname, ".env.prod"),
      systemvars: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
};
