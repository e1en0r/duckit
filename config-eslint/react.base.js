import { fixupPluginRules } from '@eslint/compat';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ...reactPlugin.configs.flat.recommended,
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      'react-hooks': fixupPluginRules(reactHooks),
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 2,
      'react/forbid-prop-types': 0,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-curly-brace-presence': 0,
      'react/jsx-filename-extension': 0,
      'react/jsx-props-no-spreading': 0,
      'react/jsx-no-undef': 'error',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: false,
          shorthandFirst: true,
          shorthandLast: false,
          ignoreCase: false,
          noSortAlphabetically: false,
          reservedFirst: false,
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
