const babelConfig = require('@istanbuljs/nyc-config-babel');

module.exports = {
  ...babelConfig,
  statements: 95,
  branches: 91,
  functions: 100,
  lines: 95,
  include: ['src/*.js'],
  exclude: ['test/**/*.js'],
  reporter: ['lcov', 'text-summary'],
  all: true,
  'check-coverage': true
};
