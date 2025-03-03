import baseConfig from './config-eslint/base.js';
import importConfig from './config-eslint/import.js';
import prettierConfig from './config-eslint/prettier.js';
import reactBaseConfig from './config-eslint/react.base.js';
import reactPhorkitConfig from './config-eslint/react.phorkit.js';
import typescriptConfig from './config-eslint/typescript.js';
import vitestConfig from './config-eslint/vitest.js';

export default [
  ...baseConfig,
  ...importConfig,
  ...prettierConfig,
  ...reactBaseConfig,
  ...reactPhorkitConfig,
  ...vitestConfig,
  ...typescriptConfig,

  { ignores: ['config-eslint/*'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
        },
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
