import type { InitialOptionsTsJest } from 'ts-jest';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  rootDir: '../',
  testMatch: ['<rootDir>/tests/specs/**.spec.ts'],
  globals: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'ts-jest': {
      tsconfig: {
        target: 'ESNext',
        lib: ['DOM', 'ESNext'],
        skipLibCheck: true,
        strictPropertyInitialization: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        isolatedModules: true,
      },
      useESM: true,
    },
  },
  moduleNameMapper: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;