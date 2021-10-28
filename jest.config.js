module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    '^.+\\.(tsx|jsx|ts|js|mjs)?$': '@swc-node/jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/package/dist/', '<rootDir>/example/dist/'],
  moduleNameMapper: {
    '@tldraw/core': '<rootDir>/package/src',
    '~(.*)$': '<rootDir>/package/src/$1',
  },
}
