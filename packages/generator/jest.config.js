/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageReporters: ['json-summary'],
  modulePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '__helpers__/',
    '__fixtures__/',
  ],
};
