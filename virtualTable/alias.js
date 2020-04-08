const path = require('path');

const join = (...dir) => path.join(__dirname, ...dir);

module.exports = {
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      '@': join('./src'),
    },
  },
};
