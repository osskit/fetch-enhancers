import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../',
  testMatch: ['<rootDir>/tests/specs/**.spec.ts'],
  globals: {
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
    },
  },
};

export default config;
