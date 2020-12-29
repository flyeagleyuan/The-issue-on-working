const { BaseCssTransform, SOURCE_DIR } = require('./config');

const webpack = require('webpack'),
  merge = require('webpack-merge'),
  baseConfig = require('./webpack.config.base'),
  minimist = require('minimist'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin');

const options = minimist(process.argv.slice(2));
const packagePath = options.path ? `${options.path}` : '';

module.exports = merge(baseConfig, {
  mode: 'production',
  performance: {
    hints: 'error',
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          ...BaseCssTransform,
          {
            loader: 'sass-loader',
            options: {
              includePaths: [SOURCE_DIR],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          ...BaseCssTransform,
          {
            loader: 'less-loader',
            options: {
              includePaths: [SOURCE_DIR],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, ...BaseCssTransform],
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[hash:8].[ext]',
            outputPath: `${packagePath ? packagePath + '/' : ''}assets/images/`,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
