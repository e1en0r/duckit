import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      'function-paren-newline': ['off'],
    },
  },
];
