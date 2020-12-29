const path = require('path'),
  autoprefixer = require('autoprefixer');

module.exports.SOURCE_DIR = path.resolve(__dirname, '../src');
module.exports.OUTPUT_DIR = path.resolve(__dirname, '../dist');

module.exports.BaseCssTransform = [
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [autoprefixer({ browsers: ['last 10 versions', 'ios 6'] })],
      sourceMap: false,
    },
  },
];
