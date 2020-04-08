module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier', 'eslint:recommended'],
  plugins: ['vue'],
  globals: {
    $: false,
    Zepto: false,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': [0, 'error', 'unix', 'windows'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
