const { watch } = require("fs");

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Mapeia o alias "@/..." para o diretório "src"
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};