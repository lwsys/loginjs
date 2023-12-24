module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!decamelize)/'],
  testMatch: ['**/(*.)+(spec|test).(t|j)s'],
}
