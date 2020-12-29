const { SOURCE_DIR } = require('./config');
const webpack = require('webpack');
const merge = require('webpack-merge'),
  baseConfig = require('./webpack.config.base');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ip = require('ip');

const proxies = ['getCompanyF9Data'].map(p => {
  return {
    ['/' + p]: {
      target: 'http://10.15.97.42:8800/finchinaAPP',
      // target: 'http://10.15.43.1:8800/finchinaAPP',
      // target: 'https://appdev.finchina.com/finchinaAPP',
      changeOrigin: true,
      secure: false,
    },
  };
});

const proxyObjects = proxies.reduce((obj, proxy) => {
  return Object.assign(obj, proxy);
}, {});

const port = process.env.PORT || 8081;

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-style-loader',
          },
          'css-loader',
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
          {
            loader: 'vue-style-loader',
            options: { singleton: true },
          },
          'css-loader',
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
        use: [
          {
            loader: 'vue-style-loader',
          },
          'css-loader',
        ],
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: 'assets/images/',
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../dll/static-manifest.json'),
    }),
    new AddAssetHtmlPlugin({
      publicPath: '../../',
      filepath: require.resolve('../dll/static.dll.js'),
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `You application is running here http://${ip.address()}:${port} \r\nYou can also open local address http://localhost:${port}`,
        ],
        clearConsole: true,
      },
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port,
    clientLogLevel: 'warning',
    contentBase: SOURCE_DIR,
    historyApiFallback: true,
    noInfo: true,
    useLocalIp: true,
    quiet: true,
    inline: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://10.15.97.42:8800/finchinaAPP',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
      '/finchinaAPP': {
        //在所有请求接口前加/finchinaAPP 即可
        target: 'http://10.15.97.30:8800/finchinaAPP',
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true,
        pathRewrite: { '^/finchinaAPP': '' },
      },
      ...proxyObjects,
    },
    openPage: 'index.html',
  },
});
