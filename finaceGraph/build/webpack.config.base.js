const path = require('path');

const webpack = require('webpack');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const minimist = require('minimist');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { SOURCE_DIR, OUTPUT_DIR } = require('./config');

const join = (...dir) => path.join(__dirname, ...dir);

let entries = {},
  htmlWebpackPluginArray = [];

const options = minimist(process.argv.slice(2));
const packagePath = options.path ? `${options.path}` : '';

glob.sync(`./src/pages${packagePath ? '/' + packagePath : ''}/**/app.js`).forEach(path => {
  const chunk = path
    .split('./src/pages/')[1]
    .split('/app.js')
    .shift();

  entries[chunk] =
    process.env.NODE_ENV === 'production'
      ? ['core-js/stable', 'regenerator-runtime/runtime', join('../', path)]
      : join('../', path);

  const filename = `${chunk}.html`,
    htmlConf = {
      filename,
      template: join('../', path.replace(/\.js/g, '.ejs')),
      hash: true,
      chunks: ['vendors', chunk],
      minify:{ //压缩HTML文件
        removeComments:true,    //移除HTML中的注释
        collapseWhitespace:true    //删除空白符与换行符
      }
    };

  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf));
});

let pageLen = htmlWebpackPluginArray.length;

module.exports = {
  context: SOURCE_DIR,
  entry: entries,
  output: {
    path: OUTPUT_DIR,
    filename: `${packagePath ? packagePath + '/' : ''}assets/js/[name].js`,
  },
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      '@': join('../src'),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vendors',
          chunks: 'initial',
          minChunks: 3,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader?cacheDirectory',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'webpack-zepto',
      Zepto: 'webpack-zepto',
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${packagePath ? packagePath + '/' : ''}assets/css/[name].style.css`,
      chunkFilename: `${packagePath ? packagePath + '/' : ''}assets/css/[name].css`,
    }),
    ...htmlWebpackPluginArray,
  ],
};
