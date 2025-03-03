import importPlugin from 'eslint-plugin-import';

export default [
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      'import/first': 0,
      'import/namespace': 0,
      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],
      'import/no-absolute-path': 2,
      'import/no-named-default': 0,
      'import/prefer-default-export': 0,
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        },
      ],
    },
  },
];
