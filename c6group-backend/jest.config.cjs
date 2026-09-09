module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': '<rootDir>/jest.transform.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
