module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testMatch: ['**/(*.)+(spec|test).(t|j)s'],
};
