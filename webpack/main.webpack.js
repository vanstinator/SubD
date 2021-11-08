const path = require('path');

module.exports = {
  resolve: {
    alias: {
      core: path.resolve(__dirname, 'core/')
    },
    extensions: ['.ts', '.js']
  },
  entry: './core/main.ts',
  module: {
    rules: require('./rules.webpack')
  }
};
