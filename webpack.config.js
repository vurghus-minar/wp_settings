const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const externals = require('./externals');

// Extract multiple stylesheet using 'mini-css-extract-plugin'
function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  }
  if (m.name) {
    return m.name;
  }
  return false;
}

const webpackConfig = {
  mode: NODE_ENV,
  entry: {
    script: path.resolve(__dirname, 'src/index.js'),
    style: path.resolve(__dirname, 'src/style.scss'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    library: ['wp', '[name]'],
    libraryTarget: 'window',
  },
  externals,
  optimization: {
    splitChunks: {
      cacheGroups: {
        styleCSS: {
          name: 'style',
          test: (m, c, entry = 'style') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // clean build dir before every build
    new CleanWebpackPlugin({
      // after each build clean ghost stylesheet file
      cleanAfterEveryBuildPatterns: [path.resolve(__dirname, 'build/script.css')],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // fix for mini-css-extract-plugin as outlined here:
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/151
    new FixStyleOnlyEntriesPlugin(),
  ],
};

if (NODE_ENV === 'production') {
  webpackConfig.optimization = {
    minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
  };
}

module.exports = webpackConfig;
