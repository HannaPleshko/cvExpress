import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import { Config } from '@jest/types';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.test.local' });

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['mocks.ts'],
  testRegex: '/tests/.*\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
};

export default config;
