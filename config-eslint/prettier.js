import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': 'error',
      'no-extra-parens': 'off',
    },
  },
];
