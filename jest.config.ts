
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: '.'
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/infrastructure/testing/jest/__mocks__/file.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/infrastructure/testing/jest/setup/index.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/infrastructure/api/testing/tsconfig.jest.json'
    }
  }
}

export default createJestConfig(config)
