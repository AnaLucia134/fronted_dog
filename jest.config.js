module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.test.js'],
  coverageReporters: ['lcov', 'text'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: '.', outputName: 'junit.xml' }]
  ]
};
