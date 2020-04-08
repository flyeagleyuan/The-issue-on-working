const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const PurgecssPlugin = require('purgecss-webpack-plugin');

const join = (...dir) => path.join(__dirname, ...dir);

// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const entries = [];
const chunks = [];

glob.sync('./src/pages/**/app.js').forEach(path => {
  const chunk = path
    .split('./src/pages/')[1]
    .split('/app.js')
    .shift();

  chunks.push(chunk);

  entries.push({
    [chunk]: {
      entry: path,
      template: path.replace('.js', '.html'),
      filename: `${chunk}.html`,
    },
  });
});

const pages = entries.reduce((results, page) => Object.assign(results, page), {});

module.exports = {
  assetsDir: './static',
  pages,
  outputDir: './dist',
  publicPath: './',
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production' ? 'error' : false,
  devServer: {
    proxy: {
      '/finchinaAPP': {
        target: 'http://10.15.97.30:8800/finchinaAPP',
        secure: true,
        changeOrigin: true,
        pathRewrite: { '^/finchinaAPP': '' },
      },
    },
    openPage: './src/index.html',
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }));

    chunks.forEach(chunk => {
      config.plugins.delete(`prefetch-${chunk}`);
    });

    config.resolve.alias.set('@', join('./src'));

    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-plugin').use(BundleAnalyzerPlugin, [{ analyzerMode: 'static' }]);
    }
    /*if (IS_PROD) {
      config.plugin('removeUnusedCss').use(
        new PurgecssPlugin({
          paths: glob.sync(`${join('./src')}/!**!/!*.vue`, { nodir: true }),
          whitelist: ['html', 'body', ':root'],
        })
      );
    }*/
  },
  configureWebpack: {
    plugins: [
      new LodashModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        $: 'webpack-zepto',
        Zepto: 'webpack-zepto',
      }),
    ],
  },
};
