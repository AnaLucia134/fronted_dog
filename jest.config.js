module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: '.', outputName: 'junit.xml' }]
  ]
};
