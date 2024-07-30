import { baseConfig, testConfig } from '@osskit/eslint-config';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  {
    ignores: ['dist/**'],
  },
  {
    ...baseConfig,
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      ...baseConfig.languageOptions,
      parserOptions: {
        ...baseConfig.languageOptions.parserOptions,
        project: ['./tsconfig.eslint.json'],
      },
    },
  },
  {
    ...testConfig,
    files: ['**/*.spec.ts'],
  },
);
