import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

const config: InitialOptionsTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '../',
    testMatch: ['<rootDir>/tests/specs/**.spec.ts'],
};

export default config;
