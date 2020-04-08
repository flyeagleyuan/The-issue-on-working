module.exports = {
  presets: ['@vue/app'],
  plugins: [
    'lodash',
    [
      'component',
      {
        libraryName: 'mint-ui',
        style: true,
      },
    ],
  ],
};
