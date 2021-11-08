const path = require('path');

module.exports = {
  resolve: {
    // modules: [path.resolve(__dirname, 'core'), 'node_modules'],
    extensions: ['.ts', '.js']
  },
  entry: './core/main.ts',
  module: {
    rules: require('./rules.webpack')
  }
};
